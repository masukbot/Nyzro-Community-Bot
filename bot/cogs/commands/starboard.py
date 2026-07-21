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

# cogs/commands/starboard.py

import discord
from discord import app_commands
from discord.ext import commands
import sqlite3
import os
from datetime import datetime

class Starboard(commands.Cog, name="Starboard"):
    def __init__(self, bot):
        self.bot = bot
        self.db_path = 'db/starboard.db'
        self._init_db()

    def _init_db(self):
        if not os.path.exists('db'):
            os.makedirs('db')
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS guild_config
                         (guild_id INTEGER PRIMARY KEY, 
                          channel_id INTEGER, 
                          star_emoji TEXT DEFAULT '⭐',
                          required_stars INTEGER DEFAULT 3)''')
            c.execute('''CREATE TABLE IF NOT EXISTS starred_messages
                         (message_id INTEGER PRIMARY KEY, 
                          guild_id INTEGER,
                          channel_id INTEGER,
                          author_id INTEGER,
                          starboard_message_id INTEGER,
                          star_count INTEGER DEFAULT 1,
                          timestamp TEXT)''')
            conn.commit()

    def _get_guild_config(self, guild_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT * FROM guild_config WHERE guild_id = ?', (guild_id,))
            return c.fetchone()

    def _set_guild_config(self, guild_id, channel_id=None, star_emoji=None, required_stars=None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''INSERT OR REPLACE INTO guild_config 
                         (guild_id, channel_id, star_emoji, required_stars)
                         VALUES (?, COALESCE(?, (SELECT channel_id FROM guild_config WHERE guild_id = ?)), 
                                 COALESCE(?, (SELECT star_emoji FROM guild_config WHERE guild_id = ?)),
                                 COALESCE(?, (SELECT required_stars FROM guild_config WHERE guild_id = ?)))''',
                      (guild_id, channel_id, guild_id, star_emoji, guild_id, required_stars, guild_id))
            conn.commit()

    def _get_starred_message(self, message_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT * FROM starred_messages WHERE message_id = ?', (message_id,))
            return c.fetchone()

    def _add_or_update_starred_message(self, message_id, guild_id, channel_id, author_id, starboard_message_id=None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            existing = self._get_starred_message(message_id)
            if existing:
                c.execute('''UPDATE starred_messages 
                             SET star_count = star_count + 1
                             WHERE message_id = ?''', (message_id,))
                return (existing[4], existing[5] + 1)
            else:
                c.execute('''INSERT INTO starred_messages 
                             (message_id, guild_id, channel_id, author_id, starboard_message_id, timestamp)
                             VALUES (?, ?, ?, ?, ?, ?)''',
                          (message_id, guild_id, channel_id, author_id, starboard_message_id, datetime.now().isoformat()))
                conn.commit()
                return (starboard_message_id, 1)

    def _remove_star(self, message_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''UPDATE starred_messages 
                         SET star_count = star_count - 1
                         WHERE message_id = ?''', (message_id,))
            c.execute('SELECT star_count, starboard_message_id FROM starred_messages WHERE message_id = ?', (message_id,))
            return c.fetchone()

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload):
        if payload.user_id == self.bot.user.id:
            return
        
        config = self._get_guild_config(payload.guild_id)
        if not config or not config[1]:
            return
        
        channel_id, star_emoji, required_stars = config[1], config[2], config[3]
        if str(payload.emoji) != star_emoji:
            return
        
        guild = self.bot.get_guild(payload.guild_id)
        if not guild:
            return
        
        channel = guild.get_channel(payload.channel_id)
        if not channel:
            return
        
        try:
            message = await channel.fetch_message(payload.message_id)
        except discord.NotFound:
            return
        
        if message.author.id == payload.user_id:
            return
        
        starred_msg = self._get_starred_message(message.id)
        if starred_msg:
            starboard_msg_id, star_count = self._add_or_update_starred_message(
                message.id, guild.id, channel.id, message.author.id)
            
            if starboard_msg_id:
                starboard_channel = guild.get_channel(channel_id)
                if starboard_channel:
                    try:
                        starboard_msg = await starboard_channel.fetch_message(starboard_msg_id)
                        embed = starboard_msg.embeds[0]
                        embed.set_footer(text=f"{star_emoji} {star_count}")
                        await starboard_msg.edit(embed=embed)
                    except discord.NotFound:
                        pass
        else:
            reactions = [r for r in message.reactions if str(r.emoji) == star_emoji]
            if not reactions:
                return
            
            star_count = reactions[0].count
            if star_count >= required_stars:
                await self._post_to_starboard(message, channel_id, star_emoji, star_count)

    async def _post_to_starboard(self, message, starboard_channel_id, star_emoji, star_count):
        guild = message.guild
        starboard_channel = guild.get_channel(starboard_channel_id)
        if not starboard_channel:
            return
        
        embed = discord.Embed(
            description=message.content,
            color=0xFFD700,
            timestamp=message.created_at
        )
        embed.set_author(name=message.author.display_name, icon_url=message.author.display_avatar.url)
        embed.add_field(name="Source", value=f"[Jump!]({message.jump_url})", inline=False)
        
        if message.attachments:
            embed.set_image(url=message.attachments[0].url)
        
        embed.set_footer(text=f"{star_emoji} {star_count}")
        
        starboard_msg = await starboard_channel.send(embed=embed)
        self._add_or_update_starred_message(
            message.id, guild.id, message.channel.id, message.author.id, starboard_msg.id)

    @commands.Cog.listener()
    async def on_raw_reaction_remove(self, payload):
        config = self._get_guild_config(payload.guild_id)
        if not config or not config[1]:
            return
        
        channel_id, star_emoji = config[1], config[2]
        if str(payload.emoji) != star_emoji:
            return
        
        result = self._remove_star(payload.message_id)
        if result:
            star_count, starboard_msg_id = result
            guild = self.bot.get_guild(payload.guild_id)
            if guild and starboard_msg_id:
                starboard_channel = guild.get_channel(channel_id)
                if starboard_channel:
                    try:
                        starboard_msg = await starboard_channel.fetch_message(starboard_msg_id)
                        if star_count <= 0:
                            await starboard_msg.delete()
                            with sqlite3.connect(self.db_path) as conn:
                                c = conn.cursor()
                                c.execute('DELETE FROM starred_messages WHERE message_id = ?', (payload.message_id,))
                                conn.commit()
                        else:
                            embed = starboard_msg.embeds[0]
                            embed.set_footer(text=f"{star_emoji} {star_count}")
                            await starboard_msg.edit(embed=embed)
                    except discord.NotFound:
                        pass

    @app_commands.command(name="starboard-setup", description="Set up the starboard channel")
    @app_commands.describe(channel="The channel to use for starboard", emoji="The emoji to use for starring (default: ⭐)", required_stars="Number of stars required (default: 3)")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def starboard_setup(self, interaction: discord.Interaction, channel: discord.TextChannel, emoji: str = "⭐", required_stars: int = 3):
        self._set_guild_config(interaction.guild.id, channel.id, emoji, required_stars)
        await interaction.response.send_message(f"✅ Starboard set up successfully!\nChannel: {channel.mention}\nEmoji: {emoji}\nRequired stars: {required_stars}", ephemeral=True)

    @app_commands.command(name="starboard-disable", description="Disable the starboard")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def starboard_disable(self, interaction: discord.Interaction):
        self._set_guild_config(interaction.guild.id, channel_id=None)
        await interaction.response.send_message("✅ Starboard disabled!", ephemeral=True)

async def setup(bot):
    await bot.add_cog(Starboard(bot))
