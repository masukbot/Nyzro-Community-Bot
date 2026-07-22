import discord
from discord.ext import commands
import io
import json
import logging
import aiohttp
from utils.Tools import *

logger = logging.getLogger("ai.events")


async def _get_guild_ai_config(guild_id: int):
    """Fetch guild AI config from DB."""
    try:
        from api.db_manager import db_manager
        db = await db_manager.get_connection('db/ai.db')
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
    """Check if a feature is enabled in the guild AI config."""
    for fa in data.get("feature_assignments", []):
        if fa.get("feature_key") == feature_key:
            return fa.get("enabled", False) in (True, 1, "true", "True")
    return False


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

            # ── 1. Moderation: scan every message ────────────────────────────────
            mod_features = [
                ("moderation_ai", self._handle_moderation),
                ("auto_moderation", self._handle_auto_moderation),
                ("toxicity_detection", self._handle_toxicity),
                ("spam_detection", self._handle_spam),
            ]
            for feat_key, handler in mod_features:
                if _is_feature_enabled(data, feat_key) and message.content:
                    try:
                        await handler(manager, message, feat_key)
                    except Exception as e:
                        logger.error(f"AI feature '{feat_key}' error: {e}")

            # ── 2. Message Classification ────────────────────────────────────────
            if _is_feature_enabled(data, "message_classification") and message.content:
                try:
                    result = await manager.execute_classification(message.content[:2000])
                    if result.get("category") in ("spam", "report"):
                        logger.info(f"[AI Classify] Guild {guild_id} msg {message.id}: {result.get('category')}")
                except Exception:
                    pass

            # ── 3. Vision: scan attachments ──────────────────────────────────────
            if message.attachments and _is_feature_enabled(data, "scam_image_detection"):
                try:
                    await self._scan_attachments(manager, message, "scam_image_detection")
                except Exception as e:
                    logger.error(f"Vision scan error: {e}")

            if message.attachments and _is_feature_enabled(data, "nsfw_detection"):
                try:
                    await self._scan_attachments(manager, message, "nsfw_detection")
                except Exception as e:
                    logger.error(f"NSFW scan error: {e}")

            # ── 4. Translation ──────────────────────────────────────────────────
            if _is_feature_enabled(data, "translation") and message.content:
                try:
                    await self._handle_translation(manager, message, data)
                except Exception as e:
                    logger.error(f"Translation error: {e}")

        except Exception as e:
            logger.error(f"AI on_message feature dispatch error: {e}")
        finally:
            await manager.close()

    async def _handle_moderation(self, manager, message, feature_key):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        if result.get("flagged") and result.get("severity") in ("high", "critical"):
            try:
                await message.delete()
                warn = await message.channel.send(
                    f"{message.author.mention} Your message was removed by AI moderation. "
                    f"Reason: {result.get('reason', 'Violates server policy')[:200]}"
                )
                await warn.delete(delay=5)
            except discord.Forbidden:
                pass

    async def _handle_auto_moderation(self, manager, message, feature_key):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        action = result.get("action", "allow")
        if action == "delete":
            try:
                await message.delete()
            except discord.Forbidden:
                pass
        elif action == "warn":
            try:
                await message.channel.send(
                    f"{message.author.mention} ⚠️ Warning: {result.get('reason', 'Message flagged')[:200]}",
                    delete_after=5
                )
            except discord.Forbidden:
                pass

    async def _handle_toxicity(self, manager, message, feature_key):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        if result.get("is_toxic") and result.get("toxicity_score", 0) > 70:
            try:
                await message.channel.send(
                    f"{message.author.mention} Please keep conversations respectful. "
                    f"Toxicity detected: {result.get('reason', '')[:200]}",
                    delete_after=8
                )
            except discord.Forbidden:
                pass

    async def _handle_spam(self, manager, message, feature_key):
        result = await manager.execute_moderation(message.content[:2000], feature_key=feature_key)
        if result.get("is_spam") and result.get("confidence", 0) > 60:
            try:
                await message.delete()
            except discord.Forbidden:
                pass

    async def _scan_attachments(self, manager, message, feature_key):
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
            try:
                await message.delete()
                warn = await message.channel.send(
                    f"{message.author.mention} Your attachment was removed. "
                    f"Reason: {result.get('reason', 'Flagged by AI')[:200]}"
                )
                await warn.delete(delay=8)
            except discord.Forbidden:
                pass

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
