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

# cogs/commands/premium.py

import discord
from discord import app_commands
from discord.ext import commands
import sqlite3
import os
from datetime import datetime, timedelta
from typing import Optional

class Premium(commands.Cog, name="Premium"):
    def __init__(self, bot):
        self.bot = bot
        self.db_path = 'db/premium.db'
        self._init_db()

    def _init_db(self):
        if not os.path.exists('db'):
            os.makedirs('db')
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS users
                         (user_id INTEGER PRIMARY KEY, 
                          guild_id INTEGER,
                          is_premium INTEGER DEFAULT 0,
                          expires_at TEXT)''')
            conn.commit()

    def is_premium(self, user_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT is_premium, expires_at FROM users WHERE user_id = ?', (user_id,))
            result = c.fetchone()
            if result:
                is_premium, expires_at = result
                if is_premium and expires_at:
                    if datetime.now() > datetime.fromisoformat(expires_at):
                        c.execute('UPDATE users SET is_premium = 0, expires_at = NULL WHERE user_id = ?', (user_id,))
                        conn.commit()
                        return False
                return bool(is_premium)
            return False

    @app_commands.command(name="premium", description="Check premium status")
    async def premium_status(self, interaction: discord.Interaction, user: Optional[discord.User] = None):
        target = user or interaction.user
        is_premium = self.is_premium(target.id)
        
        embed = discord.Embed(title=f"{target.display_name}'s Premium Status", color=0xFFD700 if is_premium else 0xFF0000)
        embed.add_field(name="Status", value="✨ Premium" if is_premium else "❌ Not Premium")
        embed.set_thumbnail(url=target.display_avatar.url)
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="addpremium", description="Add premium to a user (owner only)")
    @app_commands.describe(user="User to add premium to", days="Number of days to add")
    @commands.is_owner()
    async def add_premium(self, interaction: discord.Interaction, user: discord.User, days: int = 30):
        expires_at = (datetime.now() + timedelta(days=days)).isoformat()
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''INSERT OR REPLACE INTO users 
                         (user_id, is_premium, expires_at)
                         VALUES (?, 1, ?)''', (user.id, expires_at))
            conn.commit()
            
        embed = discord.Embed(title="Premium Added!", color=0x00FF00)
        embed.description = f"Added {days} days of premium to {user.mention}! Expires at <t:{int((datetime.now() + timedelta(days=days)).timestamp())}>"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="removepremium", description="Remove premium from a user (owner only)")
    @app_commands.describe(user="User to remove premium from")
    @commands.is_owner()
    async def remove_premium(self, interaction: discord.Interaction, user: discord.User):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('UPDATE users SET is_premium = 0, expires_at = NULL WHERE user_id = ?', (user.id,))
            conn.commit()
            
        await interaction.response.send_message(f"Removed premium from {user.mention}!")

async def setup(bot):
    await bot.add_cog(Premium(bot))
