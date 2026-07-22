import discord
from discord.ext import commands
import json
import logging
import re
import datetime
from utils.Tools import *

logger = logging.getLogger("admin_ai")

ADMIN_AI_SYSTEM_PROMPT = """You are an AI Discord server administrator. Your job is to execute server management actions based on user requests.

AVAILABLE ACTIONS:
- add_role: Add a role to a user (requires user_id, role_id/role_name)
- remove_role: Remove a role from a user (requires user_id, role_id/role_name)
- create_role: Create a new role (requires name, optional color, hoist, mentionable)
- delete_role: Delete a role (requires role_id/role_name)
- rename_channel: Rename a channel (requires new_name)
- delete_channel: Delete a channel
- create_channel: Create a new channel (requires name, type: text/voice)
- kick_member: Kick a member (requires user_id, optional reason)
- ban_member: Ban a member (requires user_id, optional reason, delete_days)
- timeout_member: Timeout a member (requires user_id, duration_minutes)
- warn_member: Send a warning to a member (requires user_id, reason)
- delete_messages: Bulk delete messages (requires count 1-100)
- pin_message: Pin a message by ID
- server_info: Get server statistics
- list_roles: List all roles
- list_members: List members with a role (requires role_id/role_name)

RULES:
1. Respond ONLY in valid JSON format
2. For actions that need user/role names vs IDs, search by name if no ID given
3. Always confirm destructive actions if require_confirmation is true
4. Be helpful and explain what you're doing
5. If you cannot perform an action, explain why

RESPONSE FORMAT:
```json
{
  "response": "Your friendly message to the user explaining what you're doing",
  "actions": [
    {"type": "action_name", "params": {"key": "value"}}
  ],
  "requires_confirmation": false
}
```

If the user is just chatting or asking questions (not requesting actions), respond with:
```json
{
  "response": "Your helpful response",
  "actions": [],
  "requires_confirmation": false
}
```"""

async def _get_guild_ai_config(guild_id: int):
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
    for fa in data.get("feature_assignments", []):
        if fa.get("feature_key") == feature_key:
            return fa.get("enabled", False) in (True, 1, "true", "True")
    return False

class AdminAI(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if message.author.bot:
            return
        if not message.guild:
            return

        guild_id = message.guild.id
        data = await _get_guild_ai_config(guild_id)
        if not data:
            return

        admin_cfg = data.get("admin_ai", {})
        channel_id = admin_cfg.get("channel_id", "")
        if not channel_id or str(message.channel.id) != str(channel_id).strip():
            return

        if not _is_feature_enabled(data, "admin_ai"):
            return

        await self._handle_admin_request(message, data, admin_cfg)

    async def _handle_admin_request(self, message: discord.Message, data: dict, admin_cfg: dict):
        system_prompt = admin_cfg.get("system_prompt", ADMIN_AI_SYSTEM_PROMPT)
        require_confirmation = admin_cfg.get("require_confirmation", True)
        allowed = admin_cfg.get("allowed_actions", {})

        model_id = admin_cfg.get("model_id", "")
        if not model_id:
            for fa in data.get("feature_assignments", []):
                if fa.get("feature_key") == "admin_ai":
                    model_id = fa.get("assigned_model_id", "")
                    break

        async with message.channel.typing():
            try:
                from ai.manager import AIManager
                manager = AIManager(data)
                manager.load_from_guild_config(message.guild.id, data)

                feature_key = "admin_ai"
                user_msg = message.clean_content[:2000] if message.clean_content else "(no text content)"
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"User {message.author.display_name} ({message.author.id}) says: {user_msg}"}
                ]

                response = await manager.execute_feature_typed(
                    feature_key, messages,
                    system_prompt=system_prompt,
                    model_override=model_id if model_id else None
                )

                raw = response.content.strip()
                raw = re.sub(r'^```json\s*', '', raw)
                raw = re.sub(r'^```\s*', '', raw)
                raw = re.sub(r'\s*```$', '', raw)
                raw = raw.strip()

                try:
                    result = json.loads(raw)
                except json.JSONDecodeError:
                    await message.channel.send(f"🤖 **Admin AI:** {raw[:1500]}")
                    return

                reply = result.get("response", "Done.")
                actions = result.get("actions", [])
                needs_confirmation = result.get("requires_confirmation", False)

                if not actions:
                    await message.channel.send(f"🤖 **Admin AI:** {reply[:1500]}")
                    return

                if needs_confirmation and require_confirmation:
                    view = AdminActionConfirmation(
                        message.author.id, actions, allowed, message.guild, self.bot
                    )
                    embed = discord.Embed(
                        title="Admin AI — Action Confirmation",
                        description=reply[:1500],
                        color=0xffa500
                    )
                    action_desc = "\n".join(
                        f"• `{a['type']}` — {json.dumps(a.get('params', {}))}" for a in actions
                    )
                    embed.add_field(name="Proposed Actions", value=action_desc[:1000], inline=False)
                    embed.set_footer(text="Confirm or cancel within 30 seconds")
                    await message.channel.send(embed=embed, view=view)
                else:
                    results = await self._execute_actions(actions, allowed, message.guild, self.bot)
                    embed = discord.Embed(
                        title="Admin AI — Actions Executed",
                        description=reply[:1500],
                        color=0x00ff00
                    )
                    for r in results:
                        status = "✅" if r["success"] else "❌"
                        embed.add_field(
                            name=f"{status} {r['action']}",
                            value=r["message"][:200],
                            inline=False
                        )
                    await message.channel.send(embed=embed)

            except Exception as e:
                logger.error(f"Admin AI error in guild {message.guild.id}: {e}")
                await message.channel.send(f"🤖 **Admin AI:** Sorry, I encountered an error: {str(e)[:200]}")

    async def _execute_actions(self, actions: list, allowed: dict, guild: discord.Guild, bot) -> list:
        results = []
        for action in actions:
            action_type = action.get("type", "")
            params = action.get("params", {})
            result = await self._execute_single_action(action_type, params, allowed, guild, bot)
            results.append(result)
        return results

    async def _execute_single_action(self, action_type: str, params: dict, allowed: dict, guild: discord.Guild, bot) -> dict:
        try:
            if action_type == "add_role":
                if not allowed.get("manage_roles", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_roles not enabled"}
                user = await self._resolve_member(guild, params.get("user_id", ""))
                role = await self._resolve_role(guild, params.get("role_id", ""), params.get("role_name", ""))
                if not user:
                    return {"action": action_type, "success": False, "message": "User not found"}
                if not role:
                    return {"action": action_type, "success": False, "message": "Role not found"}
                await user.add_roles(role, reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Added {role.name} to {user.display_name}"}

            elif action_type == "remove_role":
                if not allowed.get("manage_roles", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_roles not enabled"}
                user = await self._resolve_member(guild, params.get("user_id", ""))
                role = await self._resolve_role(guild, params.get("role_id", ""), params.get("role_name", ""))
                if not user:
                    return {"action": action_type, "success": False, "message": "User not found"}
                if not role:
                    return {"action": action_type, "success": False, "message": "Role not found"}
                await user.remove_roles(role, reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Removed {role.name} from {user.display_name}"}

            elif action_type == "create_role":
                if not allowed.get("manage_roles", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_roles not enabled"}
                name = params.get("name", "new-role")
                color = params.get("color", None)
                hoist = params.get("hoist", False)
                mentionable = params.get("mentionable", False)
                kw = {"name": name, "hoist": hoist, "mentionable": mentionable, "reason": "Admin AI action"}
                if color:
                    try:
                        kw["color"] = discord.Color(int(color.replace("#", ""), 16))
                    except:
                        pass
                role = await guild.create_role(**kw)
                return {"action": action_type, "success": True, "message": f"Role {role.name} created (ID: {role.id})"}

            elif action_type == "delete_role":
                if not allowed.get("manage_roles", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_roles not enabled"}
                role = await self._resolve_role(guild, params.get("role_id", ""), params.get("role_name", ""))
                if not role:
                    return {"action": action_type, "success": False, "message": "Role not found"}
                await role.delete(reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Role {role.name} deleted"}

            elif action_type == "rename_channel":
                if not allowed.get("manage_channels", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_channels not enabled"}
                new_name = params.get("new_name", "")
                if not new_name:
                    return {"action": action_type, "success": False, "message": "No new name provided"}
                channel = guild.get_channel(int(params.get("channel_id", 0))) if params.get("channel_id") else guild.system_channel
                if not channel:
                    return {"action": action_type, "success": False, "message": "Channel not found"}
                await channel.edit(name=new_name, reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Channel renamed to #{new_name}"}

            elif action_type == "delete_channel":
                if not allowed.get("manage_channels", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_channels not enabled"}
                channel = guild.get_channel(int(params.get("channel_id", 0))) if params.get("channel_id") else None
                if not channel:
                    return {"action": action_type, "success": False, "message": "Channel not found"}
                await channel.delete(reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Channel #{channel.name} deleted"}

            elif action_type == "create_channel":
                if not allowed.get("manage_channels", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_channels not enabled"}
                name = params.get("name", "new-channel")
                ch_type = params.get("type", "text")
                if ch_type == "voice":
                    channel = await guild.create_voice_channel(name, reason="Admin AI action")
                else:
                    channel = await guild.create_text_channel(name, reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Channel #{channel.name} created"}

            elif action_type == "kick_member":
                if not allowed.get("manage_members", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_members not enabled"}
                user = await self._resolve_member(guild, params.get("user_id", ""))
                if not user:
                    return {"action": action_type, "success": False, "message": "User not found"}
                reason = params.get("reason", "Admin AI action")
                await user.kick(reason=reason)
                return {"action": action_type, "success": True, "message": f"{user.display_name} kicked"}

            elif action_type == "ban_member":
                if not allowed.get("manage_members", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_members not enabled"}
                user_id = params.get("user_id", "")
                delete_days = params.get("delete_days", 0)
                reason = params.get("reason", "Admin AI action")
                user = await self._resolve_member(guild, user_id)
                target = user or await bot.fetch_user(int(user_id))
                if not target:
                    return {"action": action_type, "success": False, "message": "User not found"}
                await guild.ban(target, reason=reason, delete_message_days=min(delete_days, 7))
                return {"action": action_type, "success": True, "message": f"{target} banned"}

            elif action_type == "timeout_member":
                if not allowed.get("manage_members", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_members not enabled"}
                user = await self._resolve_member(guild, params.get("user_id", ""))
                if not user:
                    return {"action": action_type, "success": False, "message": "User not found"}
                duration = params.get("duration_minutes", 10)
                until = discord.utils.utcnow() + datetime.timedelta(minutes=duration)
                await user.timeout(until, reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"{user.display_name} timed out for {duration}m"}

            elif action_type == "warn_member":
                if not allowed.get("manage_members", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_members not enabled"}
                user = await self._resolve_member(guild, params.get("user_id", ""))
                reason = params.get("reason", "No reason provided")
                if not user:
                    return {"action": action_type, "success": False, "message": "User not found"}
                try:
                    await user.send(f"⚠️ **Warning from {guild.name}**\nReason: {reason}")
                except:
                    pass
                return {"action": action_type, "success": True, "message": f"{user.display_name} warned: {reason[:100]}"}

            elif action_type == "delete_messages":
                if not allowed.get("manage_messages", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_messages not enabled"}
                count = min(params.get("count", 5), 100)
                channel_id = params.get("channel_id", "")
                channel = guild.get_channel(int(channel_id)) if channel_id else None
                if not channel:
                    return {"action": action_type, "success": False, "message": "Channel not found"}
                await channel.purge(limit=count, reason="Admin AI action")
                return {"action": action_type, "success": True, "message": f"Deleted {count} messages in #{channel.name}"}

            elif action_type == "pin_message":
                if not allowed.get("manage_messages", False):
                    return {"action": action_type, "success": False, "message": "Permission denied: manage_messages not enabled"}
                msg_id = params.get("message_id", "")
                channel_id = params.get("channel_id", "")
                channel = guild.get_channel(int(channel_id)) if channel_id else None
                if not channel:
                    return {"action": action_type, "success": False, "message": "Channel not found"}
                try:
                    msg = await channel.fetch_message(int(msg_id))
                    await msg.pin(reason="Admin AI action")
                    return {"action": action_type, "success": True, "message": f"Message {msg_id} pinned"}
                except:
                    return {"action": action_type, "success": False, "message": "Message not found"}

            elif action_type == "server_info":
                return {"action": action_type, "success": True, "message": f"Server: {guild.name}  Members: {guild.member_count}  Channels: {len(guild.channels)}  Roles: {len(guild.roles)}  Boost: {guild.premium_tier}"}

            elif action_type == "list_roles":
                roles = [r.mention for r in guild.roles if not r.is_default()][:20]
                return {"action": action_type, "success": True, "message": f"Roles: {', '.join(roles) if roles else 'No roles found'}"}

            elif action_type == "list_members":
                role = await self._resolve_role(guild, params.get("role_id", ""), params.get("role_name", ""))
                if not role:
                    return {"action": action_type, "success": False, "message": "Role not found"}
                members = [m.display_name for m in role.members][:20]
                return {"action": action_type, "success": True, "message": f"Members with {role.name}: {', '.join(members) if members else 'None'}"}

            return {"action": action_type, "success": False, "message": f"Unknown action: {action_type}"}

        except discord.Forbidden:
            return {"action": action_type, "success": False, "message": "Bot lacks permission to perform this action"}
        except Exception as e:
            return {"action": action_type, "success": False, "message": f"Error: {str(e)[:200]}"}

    async def _resolve_member(self, guild: discord.Guild, user_id: str) -> discord.Member:
        if not user_id:
            return None
        try:
            uid = int(user_id)
            return guild.get_member(uid) or await guild.fetch_member(uid)
        except:
            pass
        for m in guild.members:
            if m.name == user_id or m.display_name == user_id or str(m) == user_id:
                return m
        return None

    async def _resolve_role(self, guild: discord.Guild, role_id: str, role_name: str = "") -> discord.Role:
        if role_id:
            try:
                return guild.get_role(int(role_id))
            except:
                pass
        if role_name:
            for r in guild.roles:
                if r.name.lower() == role_name.lower():
                    return r
            for r in guild.roles:
                if role_name.lower() in r.name.lower():
                    return r
        return None


class AdminActionConfirmation(discord.ui.View):
    def __init__(self, author_id: int, actions: list, allowed: dict, guild: discord.Guild, bot):
        super().__init__(timeout=30)
        self.author_id = author_id
        self.actions = actions
        self.allowed = allowed
        self.guild = guild
        self.bot = bot

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.user.id != self.author_id:
            await interaction.response.send_message("Only the original requester can confirm actions.", ephemeral=True)
            return False
        return True

    @discord.ui.button(label="Confirm", style=discord.ButtonStyle.green)
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer(ephemeral=True)
        self.disable_all_items()
        await interaction.message.edit(view=self)

        cog = self.bot.get_cog("AdminAI")
        if cog:
            results = await cog._execute_actions(self.actions, self.allowed, self.guild, self.bot)
            embed = discord.Embed(
                title="Admin AI — Actions Executed",
                color=0x00ff00
            )
            for r in results:
                status = "✅" if r["success"] else "❌"
                embed.add_field(name=f"{status} {r['action']}", value=r["message"][:200], inline=False)
            await interaction.followup.send(embed=embed)
        else:
            await interaction.followup.send("Admin AI cog not available.", ephemeral=True)

    @discord.ui.button(label="Cancel", style=discord.ButtonStyle.red)
    async def cancel(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.disable_all_items()
        await interaction.message.edit(view=self)
        await interaction.response.send_message("Actions cancelled.", ephemeral=True)

    async def on_timeout(self):
        for item in self.children:
            item.disabled = True
        try:
            await self.message.edit(view=self)
        except:
            pass


async def setup(bot):
    await bot.add_cog(AdminAI(bot))
