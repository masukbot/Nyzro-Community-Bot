# ╔══════════════════════════════════════════════════════════════════╗
# ║                                                                  ║
# ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
# ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
# ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
# ║                                                                  ║
# ║            © 2026 CodeX Devs — All Rights Reserved              ║
# ║                                                                  ║
# ║   discord  ──  https://discord.gg/codexdev                      ║
# ║   youtube  ──  https://youtube.com/@CodeXDevs                   ║
# ║   github   ──  https://github.com/RayExo                        ║
# ║                                                                  ║
# ╚══════════════════════════════════════════════════════════════════╝

# cogs/commands/voicelog.py

import discord
from discord import app_commands
from discord.ext import commands
import sqlite3
import os
from datetime import datetime

class VoiceLog(commands.Cog, name="Voice Log"):
    def __init__(self, bot):
        self.bot = bot
        self.db_path = 'db/voicelog.db'
        self._init_db()

    def _init_db(self):
        if not os.path.exists('db'):
            os.makedirs('db')
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS guild_config
                         (guild_id INTEGER PRIMARY KEY, 
                          channel_id INTEGER,
                          enabled INTEGER DEFAULT 0)''')
            conn.commit()

    def _get_guild_config(self, guild_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT * FROM guild_config WHERE guild_id = ?', (guild_id,))
            return c.fetchone()

    def _set_guild_config(self, guild_id, channel_id=None, enabled=None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''INSERT OR REPLACE INTO guild_config 
                         (guild_id, channel_id, enabled)
                         VALUES (?, COALESCE(?, (SELECT channel_id FROM guild_config WHERE guild_id = ?)), 
                                 COALESCE(?, (SELECT enabled FROM guild_config WHERE guild_id = ?)))''',
                      (guild_id, channel_id, guild_id, enabled, guild_id))
            conn.commit()

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        if member.bot:
            return
        
        config = self._get_guild_config(member.guild.id)
        if not config or not config[1] or not config[2]:
            return
        
        log_channel = member.guild.get_channel(config[1])
        if not log_channel:
            return
        
        embed = discord.Embed(color=0x5865F2, timestamp=datetime.now())
        embed.set_author(name=member.display_name, icon_url=member.display_avatar.url)
        
        if before.channel is None and after.channel is not None:
            # Joined a voice channel
            embed.title = "📞 Voice Channel Joined"
            embed.description = f"{member.mention} joined {after.channel.mention}"
            if after.self_mute:
                embed.add_field(name="Status", value="🔇 Self-muted", inline=False)
            if after.self_deaf:
                embed.add_field(name="Status", value="🔊 Self-deafened", inline=False)
        
        elif before.channel is not None and after.channel is None:
            # Left a voice channel
            embed.title = "📞 Voice Channel Left"
            embed.description = f"{member.mention} left {before.channel.mention}"
        
        elif before.channel is not None and after.channel is not None and before.channel != after.channel:
            # Moved between voice channels
            embed.title = "📞 Voice Channel Changed"
            embed.description = f"{member.mention} moved from {before.channel.mention} to {after.channel.mention}"
        
        elif before.channel == after.channel:
            # Something else changed (mute/deafen/etc)
            changes = []
            if before.self_mute != after.self_mute:
                changes.append(f"Self-mute: {'🔇 Muted' if after.self_mute else '🔊 Unmuted'}")
            if before.self_deaf != after.self_deaf:
                changes.append(f"Self-deafen: {'🔇 Deafened' if after.self_deaf else '🔊 Undeafened'}")
            if before.mute != after.mute:
                changes.append(f"Server mute: {'🔇 Muted' if after.mute else '🔊 Unmuted'}")
            if before.deaf != after.deaf:
                changes.append(f"Server deafen: {'🔇 Deafened' if after.deaf else '🔊 Undeafened'}")
            if before.self_stream != after.self_stream:
                changes.append(f"Streaming: {'📺 Started' if after.self_stream else '📺 Stopped'}")
            if before.self_video != after.self_video:
                changes.append(f"Camera: {'📹 On' if after.self_video else '📹 Off'}")
            
            if changes:
                embed.title = "📞 Voice State Updated"
                embed.description = f"{member.mention} in {after.channel.mention}"
                for change in changes:
                    embed.add_field(name="Change", value=change, inline=False)
        
        if embed.title:
            try:
                await log_channel.send(embed=embed)
            except discord.Forbidden:
                pass

    @app_commands.command(name="voicelog-setup", description="Set up voice channel logging")
    @app_commands.describe(channel="The channel to use for voice logs")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def voicelog_setup(self, interaction: discord.Interaction, channel: discord.TextChannel):
        self._set_guild_config(interaction.guild.id, channel.id, 1)
        await interaction.response.send_message(f"✅ Voice logging set up successfully!\nChannel: {channel.mention}", ephemeral=True)

    @app_commands.command(name="voicelog-disable", description="Disable voice channel logging")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def voicelog_disable(self, interaction: discord.Interaction):
        self._set_guild_config(interaction.guild.id, enabled=0)
        await interaction.response.send_message("✅ Voice logging disabled!", ephemeral=True)

    @app_commands.command(name="voicelog-enable", description="Enable voice channel logging")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def voicelog_enable(self, interaction: discord.Interaction):
        config = self._get_guild_config(interaction.guild.id)
        if not config or not config[1]:
            await interaction.response.send_message("❌ Please set up a log channel first using `/voicelog-setup`", ephemeral=True)
            return
        
        self._set_guild_config(interaction.guild.id, enabled=1)
        await interaction.response.send_message("✅ Voice logging enabled!", ephemeral=True)

async def setup(bot):
    await bot.add_cog(VoiceLog(bot))
