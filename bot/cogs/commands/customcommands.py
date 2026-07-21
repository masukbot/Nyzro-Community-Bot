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

# cogs/commands/customcommands.py

import discord
from discord import app_commands
from discord.ext import commands
import sqlite3
import os

class CustomCommands(commands.Cog, name="Custom Commands"):
    def __init__(self, bot):
        self.bot = bot
        self.db_path = 'db/customcommands.db'
        self._init_db()

    def _init_db(self):
        if not os.path.exists('db'):
            os.makedirs('db')
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS commands
                         (guild_id INTEGER, 
                          name TEXT, 
                          response TEXT,
                          PRIMARY KEY (guild_id, name))''')
            conn.commit()

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot or not message.guild:
            return
        
        # Check if message is a custom command
        prefix = await self.bot.get_prefix(message)
        if isinstance(prefix, list):
            prefix = prefix[0]
        
        if not message.content.startswith(prefix):
            return
        
        command_name = message.content[len(prefix):].strip().split()[0].lower()
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT response FROM commands WHERE guild_id = ? AND name = ?',
                      (message.guild.id, command_name))
            result = c.fetchone()
        
        if result:
            # Replace placeholders
            response = result[0]
            response = response.replace("{user}", message.author.mention)
            response = response.replace("{username}", message.author.display_name)
            response = response.replace("{server}", message.guild.name)
            response = response.replace("{channel}", message.channel.mention)
            
            await message.channel.send(response)

    @app_commands.command(name="custom-add", description="Add a custom command")
    @app_commands.describe(name="The name of the command", response="What the command should respond with")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def custom_add(self, interaction: discord.Interaction, name: str, response: str):
        name = name.lower()
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('INSERT OR REPLACE INTO commands (guild_id, name, response) VALUES (?, ?, ?)',
                      (interaction.guild.id, name, response))
            conn.commit()
        
        embed = discord.Embed(title="✅ Custom Command Added!", color=0x00FF00)
        embed.description = f"Command: `{name}`\nResponse: {response}"
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="custom-remove", description="Remove a custom command")
    @app_commands.describe(name="The name of the command to remove")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def custom_remove(self, interaction: discord.Interaction, name: str):
        name = name.lower()
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('DELETE FROM commands WHERE guild_id = ? AND name = ?',
                      (interaction.guild.id, name))
            conn.commit()
        
        await interaction.response.send_message(f"✅ Custom command `{name}` removed!", ephemeral=True)

    @app_commands.command(name="custom-list", description="List all custom commands")
    async def custom_list(self, interaction: discord.Interaction):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT name, response FROM commands WHERE guild_id = ?',
                      (interaction.guild.id,))
            commands_list = c.fetchall()
        
        if not commands_list:
            await interaction.response.send_message("❌ No custom commands yet!", ephemeral=True)
            return
        
        embed = discord.Embed(title="📜 Custom Commands", color=0x5865F2)
        for cmd_name, cmd_response in commands_list:
            embed.add_field(name=cmd_name, value=cmd_response[:100] + ("..." if len(cmd_response) > 100 else ""), inline=False)
        
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(CustomCommands(bot))
