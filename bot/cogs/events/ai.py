import discord
from discord.ext import commands
import io
import json
import logging
import aiohttp
from utils.Tools import *

logger = logging.getLogger("ai.events")

async def _get_guild_ai_config(guild_id: int):
    try:
        from api.db_manager import db_manager
        db = await db_manager.get_connection('db/ai.db')
        await db.execute("""
            CREATE TABLE IF NOT EXISTS ai_warning_strikes (
                guild_id INTEGER, user_id INTEGER, strike_count INTEGER DEFAULT 1,
                last_strike_at TEXT, PRIMARY KEY (guild_id, user_id)
            )
        """)
        await db.commit()
        cursor = await db.execute(
            "SELECT config_json FROM ai_guild_configs WHERE guild_id = ? OR guild_id = ?",
            (guild_id, str(guild_id))
        )
        row = await cursor.fetchone()
        if row and row[0]:
            return json.loads(row[0])
    except Exception as e:
        logger.error(f"Failed to load AI config for guild {guild_id}: {e}")
    return None

def _is_feature_enabled(data: dict, feature_key: str) -> bool:
    for fa in data.get("feature_assignments", []):
        if fa.get("feature_key") == feature_key:
            return fa.get("enabled", False) in (True, 1, "true", "True")
    return False

async def _add_strike(guild_id: int, user_id: int):
    from api.db_manager import db_manager
    db = await db_manager.get_connection('db/ai.db')
    cursor = await db.execute(
        "SELECT strike_count FROM ai_warning_strikes WHERE guild_id = ? AND user_id = ?",
        (guild_id, user_id)
    )
    row = await cursor.fetchone()
    now = discord.utils.utcnow().isoformat()
    if row:
        new_count = row[0] + 1
        await db.execute(
            "UPDATE ai_warning_strikes SET strike_count = ?, last_strike_at = ? WHERE guild_id = ? AND user_id = ?",
            (new_count, now, guild_id, user_id)
        )
    else:
        new_count = 1
        await db.execute(
            "INSERT INTO ai_warning_strikes (guild_id, user_id, strike_count, last_strike_at) VALUES (?, ?, ?, ?)",
            (guild_id, user_id, new_count, now)
        )
    await db.commit()
    return new_count
def _build_dm_embed(user: discord.User, guild: discord.Guild, reason: str, feat_cfg: dict, strike_count: int, max_strikes: int):
    title = feat_cfg.get("title", "Warning from {guild_name}").replace("{guild_name}", guild.name)
    desc = (feat_cfg.get("message") or feat_cfg.get("template") or "Warning from {guild_name}: {reason}").replace("{guild_name}", guild.name).replace("{reason}", reason[:500]).replace("{strikes}", str(strike_count)).replace("{max_strikes}", str(max_strikes))
    color_hex = (feat_cfg.get("color") or "#FF4444").lstrip("#")
    try:
        color = int(color_hex, 16)
    except ValueError:
        color = 0xFF4444
    embed = discord.Embed(title=title, description=desc, color=color)
    embed.set_author(name=guild.name, icon_url=guild.icon.url if guild.icon else None)
    embed.set_footer(text=f"User ID: {user.id} | Strike {strike_count}/{max_strikes}")
    embed.timestamp = discord.utils.utcnow()
    return embed

class AppealModal(discord.ui.Modal, title="Appeal Your Warning"):
    def __init__(self, bot, guild_id: int, user_id: int, dm_cfg: dict):
        super().__init__()
        self.bot = bot
        self.guild_id = guild_id
        self.user_id = user_id
        self.dm_cfg = dm_cfg
        self.reason = discord.ui.TextInput(
            label="Why should your warning be removed?",
            style=discord.TextStyle.paragraph,
            placeholder="Explain your appeal here...",
            max_length=1000
        )
        self.add_item(self.reason)

    async def on_submit(self, interaction: discord.Interaction):
        await interaction.response.send_message("Your appeal has been submitted. Staff will review it shortly.", ephemeral=True)
        guild = self.bot.get_guild(self.guild_id)
        if not guild:
            return
        appeal_cfg = self.dm_cfg.get("appeal", {})
        target = None
        raw_ch = appeal_cfg.get("channel_id")
        if raw_ch:
            try:
                target = guild.get_channel(int(raw_ch))
            except (ValueError, TypeError):
                pass
        if not target:
            raw_cat = appeal_cfg.get("category_id")
            if raw_cat:
                try:
                    cat = guild.get_channel(int(raw_cat))
                    if cat:
                        target = await guild.create_text_channel(name=f"appeal-{self.user_id}", category=cat)
                except (ValueError, TypeError):
                    pass
        if not target:
            for chan in guild.text_channels:
                if chan.permissions_for(guild.me).send_messages and "appeal" in chan.name.lower():
                    target = chan
                    break
        if not target:
            target = guild.system_channel or guild.text_channels[0]
        try:
            view = discord.ui.View()
            view.add_item(discord.ui.Button(label="View User", style=discord.ButtonStyle.link, url=f"https://discord.com/users/{self.user_id}"))
            embed = discord.Embed(title="Appeal Submitted", color=0x5865F2,
                                  description=self.reason.value[:1000])
            embed.set_author(name=f"User ID: {self.user_id}")
            embed.timestamp = discord.utils.utcnow()
            await target.send(f"New appeal from <@{self.user_id}>", embed=embed, view=view)
        except Exception as e:
            logger.error(f"Failed to send appeal: {e}")

class AppealButton(discord.ui.Button):
    def __init__(self, bot, guild_id: int, user_id: int, dm_cfg: dict):
        super().__init__(label="Appeal Warning", style=discord.ButtonStyle.danger, emoji="📩")
        self.bot = bot
        self.guild_id = guild_id
        self.user_id = user_id
        self.dm_cfg = dm_cfg

    async def callback(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("This appeal button is not for you.", ephemeral=True)
            return
        await interaction.response.send_modal(AppealModal(self.bot, self.guild_id, self.user_id, self.dm_cfg))

class AIResponses(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        pass

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if message.author.bot or not message.guild:
            return
        guild_id = message.guild.id
        data = await _get_guild_ai_config(guild_id)
        if not data:
            return
        from ai.manager import AIManager
        manager = AIManager()
        try:
            manager.load_from_guild_config(guild_id, data)
            mod_features = [
                ("moderation_ai", self._handle_moderation),
                ("auto_moderation", self._handle_auto_moderation),
                ("toxicity_detection", self._handle_toxicity),
                ("spam_detection", self._handle_spam),
            ]
            for feat_key, handler in mod_features:
                if _is_feature_enabled(data, feat_key) and message.content:
                    try:
                        await handler(manager, message, feat_key, data)
                    except Exception as e:
                        logger.error(f"AI feature '{feat_key}' error: {e}")
            if _is_feature_enabled(data, "message_classification") and message.content:
                try:
                    result = await manager.execute_classification(message.content[:2000])
                    if result.get("category") in ("spam", "report"):
                        logger.info(f"[AI Classify] Guild {guild_id} msg {message.id}: {result.get('category')}")
                except Exception:
                    pass
            if message.attachments and _is_feature_enabled(data, "scam_image_detection"):
                try:
                    await self._scan_attachments(manager, message, "scam_image_detection", data)
                except Exception as e:
                    logger.error(f"Vision scan error: {e}")
            if message.attachments and _is_feature_enabled(data, "nsfw_detection"):
                try:
                    await self._scan_attachments(manager, message, "nsfw_detection", data)
                except Exception as e:
                    logger.error(f"NSFW scan error: {e}")
            if _is_feature_enabled(data, "translation") and message.content:
                try:
                    await self._handle_translation(manager, message, data)
                except Exception as e:
                    logger.error(f"Translation error: {e}")
        except Exception as e:
            logger.error(f"AI on_message feature dispatch error: {e}")
        finally:
            await manager.close()

    async def _send_dm_warning(self, user: discord.User, guild: discord.Guild, data: dict, reason: str, feature_key: str = "manual"):
        dm_cfg = data.get("dm_warning", {})
        logger.info(f"[DM Warning] Guild={guild.id} User={user.id} Feature={feature_key} Reason={reason[:50]} dm_cfg={dm_cfg.get('enabled')}")
        if not dm_cfg.get("enabled", False):
            logger.info(f"[DM Warning] Skipped: dm_warning not enabled")
            return
        per_feature = dm_cfg.get("per_feature", {})
        feat_cfg = per_feature.get(feature_key, {})
        if feat_cfg.get("enabled") is False:
            logger.info(f"[DM Warning] Skipped: per_feature.{feature_key} not enabled")
            return
        strike_cfg = dm_cfg.get("strikes", {})
        max_strikes = int(strike_cfg.get("max_strikes", 3))
        strike_count = 0
        if strike_cfg.get("enabled", False):
            strike_count = await _add_strike(guild.id, user.id)
        template = feat_cfg.get("template") or dm_cfg.get("warning_template", "")
        fmt = feat_cfg.get("format") or dm_cfg.get("format", "embed")
        if not template:
            template = "You received a warning in **{guild_name}**.\nReason: {reason}"
        msg_text = template.replace("{guild_name}", guild.name).replace("{reason}", reason[:500]).replace("{strikes}", str(strike_count)).replace("{max_strikes}", str(max_strikes))
        try:
            view = discord.ui.View()
            appeal_cfg = dm_cfg.get("appeal", {})
            if appeal_cfg.get("enabled", False):
                view.add_item(AppealButton(self.bot, guild.id, user.id, dm_cfg))
            if fmt == "embed":
                embed = _build_dm_embed(user, guild, reason, feat_cfg, strike_count, max_strikes)
                await user.send(embed=embed, view=view if view.children else None)
            else:
                await user.send(msg_text, view=view if view.children else None)
            logger.info(f"[DM Warning] Successfully sent to {user} ({user.id}) via {fmt}")
            if dm_cfg.get("notify_moderators", False):
                for chan in guild.text_channels:
                    if chan.permissions_for(guild.me).send_messages and "mod" in chan.name.lower():
                        await chan.send(f"⚠️ DM warning sent to {user.mention} ({user.id}) | Feature: {feature_key} | Strike {strike_count}/{max_strikes}\nReason: {reason[:200]}")
                        break
            if strike_cfg.get("enabled", False) and strike_count >= max_strikes:
                await self._enforce_strike_limit(user, guild, strike_cfg)
        except discord.Forbidden:
            logger.warning(f"[DM Warning] Forbidden: {user} has DMs disabled")
        except Exception as e:
            logger.error(f"[DM Warning] Failed to send to {user}: {e}", exc_info=True)

    async def _enforce_strike_limit(self, user: discord.User, guild: discord.Guild, strike_cfg: dict):
        action = strike_cfg.get("action", "mute")
        duration = int(strike_cfg.get("action_duration_minutes", 60))
        try:
            member = guild.get_member(user.id) or await guild.fetch_member(user.id)
            if not member:
                return
            if action == "mute":
                await member.timeout(discord.utils.utcnow() + discord.timedelta(minutes=duration),
                                     reason=f"Exceeded max AI warning strikes ({strike_cfg.get('max_strikes', 3)})")
            elif action == "kick":
                await member.kick(reason=f"Exceeded max AI warning strikes")
            elif action == "ban":
                await member.ban(reason=f"Exceeded max AI warning strikes", delete_message_days=1)
        except Exception as e:
            logger.error(f"Failed to enforce strike limit on {user}: {e}")

    async def _handle_moderation(self, manager, message, feature_key, data):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        if result.get("flagged") and result.get("severity") in ("high", "critical"):
            reason = result.get("reason", "Violates server policy")
            try:
                await message.delete()
                warn = await message.channel.send(
                    f"{message.author.mention} Your message was removed by AI moderation. "
                    f"Reason: {reason[:200]}"
                )
                await warn.delete(delay=5)
            except discord.Forbidden:
                pass
            await self._send_dm_warning(message.author, message.guild, data, reason, feature_key)

    async def _handle_auto_moderation(self, manager, message, feature_key, data):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        action = result.get("action", "allow")
        reason = result.get("reason", "Auto moderation triggered")
        if action == "delete":
            try:
                await message.delete()
            except discord.Forbidden:
                pass
            await self._send_dm_warning(message.author, message.guild, data, reason, feature_key)
        elif action == "warn":
            try:
                await message.channel.send(
                    f"{message.author.mention} ⚠️ Warning: {reason[:200]}",
                    delete_after=5
                )
            except discord.Forbidden:
                pass
            await self._send_dm_warning(message.author, message.guild, data, reason, feature_key)

    async def _handle_toxicity(self, manager, message, feature_key, data):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        if result.get("is_toxic") and result.get("toxicity_score", 0) > 70:
            reason = result.get("reason", "Toxic language detected")
            try:
                await message.channel.send(
                    f"{message.author.mention} Please keep conversations respectful. "
                    f"Toxicity detected: {reason[:200]}",
                    delete_after=8
                )
            except discord.Forbidden:
                pass
            await self._send_dm_warning(message.author, message.guild, data, reason, feature_key)

    async def _handle_spam(self, manager, message, feature_key, data):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        if result.get("is_spam") and result.get("confidence", 0) > 60:
            try:
                await message.delete()
            except discord.Forbidden:
                pass
            await self._send_dm_warning(message.author, message.guild, data,
                                        result.get("reason", "Spam detected"), feature_key)

    async def _scan_attachments(self, manager, message, feature_key, data):
        images = []
        for att in message.attachments[:3]:
            if att.content_type and att.content_type.startswith("image/"):
                try:
                    async with aiohttp.ClientSession() as sess:
                        async with sess.get(att.url) as resp:
                            if resp.status == 200:
                                images.append(await resp.read())
                except Exception:
                    continue
        if not images:
            return
        prompt = f"Scan this image attached by {message.author.display_name} in a Discord server."
        result = await manager.execute_vision_scan(images, prompt=prompt, feature_key=feature_key)
        if result.get("is_flagged") or result.get("is_nsfw"):
            reason = result.get("reason", "Flagged by AI")
            try:
                await message.delete()
                warn = await message.channel.send(
                    f"{message.author.mention} Your attachment was removed. "
                    f"Reason: {reason[:200]}"
                )
                await warn.delete(delay=8)
            except discord.Forbidden:
                pass
            await self._send_dm_warning(message.author, message.guild, data, reason, feature_key)

    async def _handle_translation(self, manager, message, data):
        chat_channels = data.get("chat_channels", [])
        channel_id_str = str(message.channel.id)
        matching = next((
            c for c in chat_channels
            if (str(c.get("channel_id")).strip() == channel_id_str or c.get("channel_id") == message.channel.id)
        ), None)
        if not matching:
            return
        target_lang = matching.get("translation_target", "English")
        translated = await manager.execute_translation(message.clean_content[:2000], target_language=target_lang)
        if translated and translated != message.clean_content:
            try:
                await message.channel.send(
                    f"🌐 **Translation ({target_lang}):** {translated}",
                    delete_after=15
                )
            except discord.Forbidden:
                pass

async def setup(bot):
    await bot.add_cog(AIResponses(bot))
