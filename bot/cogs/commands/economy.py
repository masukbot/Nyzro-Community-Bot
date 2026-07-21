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

# cogs/commands/economy.py

import discord
from discord import app_commands
from discord.ext import commands
import sqlite3
import os
import random
from datetime import datetime, timedelta
from typing import Optional

class Economy(commands.Cog, name="Economy"):
    def __init__(self, bot):
        self.bot = bot
        self.db_path = 'db/economy.db'
        self._init_db()

    def _init_db(self):
        if not os.path.exists('db'):
            os.makedirs('db')
        
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS users
                         (guild_id INTEGER, user_id INTEGER, 
                          balance INTEGER DEFAULT 0, 
                          bank INTEGER DEFAULT 0,
                          last_daily TEXT,
                          last_work TEXT,
                          PRIMARY KEY (guild_id, user_id))''')
            c.execute('''CREATE TABLE IF NOT EXISTS shop
                         (id INTEGER PRIMARY KEY AUTOINCREMENT,
                          guild_id INTEGER,
                          name TEXT,
                          price INTEGER,
                          description TEXT,
                          role_id INTEGER)''')
            conn.commit()

    def _get_user(self, guild_id, user_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT * FROM users WHERE guild_id = ? AND user_id = ?', (guild_id, user_id))
            user = c.fetchone()
            if not user:
                c.execute('INSERT INTO users (guild_id, user_id) VALUES (?, ?)', (guild_id, user_id))
                conn.commit()
                return (guild_id, user_id, 0, 0, None, None)
            return user

    def _update_user(self, guild_id, user_id, balance=None, bank=None, last_daily=None, last_work=None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            if balance is not None:
                c.execute('UPDATE users SET balance = ? WHERE guild_id = ? AND user_id = ?', (balance, guild_id, user_id))
            if bank is not None:
                c.execute('UPDATE users SET bank = ? WHERE guild_id = ? AND user_id = ?', (bank, guild_id, user_id))
            if last_daily is not None:
                c.execute('UPDATE users SET last_daily = ? WHERE guild_id = ? AND user_id = ?', (last_daily, guild_id, user_id))
            if last_work is not None:
                c.execute('UPDATE users SET last_work = ? WHERE guild_id = ? AND user_id = ?', (last_work, guild_id, user_id))
            conn.commit()

    def _get_shop_items(self, guild_id):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT * FROM shop WHERE guild_id = ?', (guild_id,))
            return c.fetchall()

    @app_commands.command(name="balance", description="Check your or someone else's balance")
    @app_commands.describe(user="The user to check (optional)")
    async def balance(self, interaction: discord.Interaction, user: Optional[discord.User] = None):
        target = user or interaction.user
        user_data = self._get_user(interaction.guild.id, target.id)
        
        embed = discord.Embed(title=f"💵 {target.display_name}'s Balance", color=0x00FF00)
        embed.add_field(name="💳 Wallet", value=f"${user_data[2]:,}", inline=True)
        embed.add_field(name="🏦 Bank", value=f"${user_data[3]:,}", inline=True)
        embed.add_field(name="📊 Total", value=f"${user_data[2] + user_data[3]:,}", inline=False)
        embed.set_thumbnail(url=target.display_avatar.url)
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="daily", description="Claim your daily reward")
    async def daily(self, interaction: discord.Interaction):
        user_data = self._get_user(interaction.guild.id, interaction.user.id)
        now = datetime.now()
        
        if user_data[4]:
            last_daily = datetime.fromisoformat(user_data[4])
            if now - last_daily < timedelta(hours=24):
                remaining = timedelta(hours=24) - (now - last_daily)
                hours, remainder = divmod(remaining.seconds, 3600)
                minutes, _ = divmod(remainder, 60)
                await interaction.response.send_message(f"❌ You can claim your daily again in {hours}h {minutes}m!", ephemeral=True)
                return
        
        reward = random.randint(100, 500)
        new_balance = user_data[2] + reward
        self._update_user(interaction.guild.id, interaction.user.id, balance=new_balance, last_daily=now.isoformat())
        
        embed = discord.Embed(title="🎉 Daily Reward Claimed!", color=0x00FF00)
        embed.description = f"You received **${reward:,}**!\nYour new balance: **${new_balance:,}**"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="work", description="Work to earn some money")
    async def work(self, interaction: discord.Interaction):
        user_data = self._get_user(interaction.guild.id, interaction.user.id)
        now = datetime.now()
        
        if user_data[5]:
            last_work = datetime.fromisoformat(user_data[5])
            if now - last_work < timedelta(minutes=30):
                remaining = timedelta(minutes=30) - (now - last_work)
                minutes, _ = divmod(remaining.seconds, 60)
                await interaction.response.send_message(f"❌ You can work again in {minutes}m!", ephemeral=True)
                return
        
        jobs = [
            ("a software developer", 50, 200),
            ("a fast food worker", 20, 100),
            ("a delivery driver", 30, 150),
            ("a streamer", 40, 180),
            ("a YouTuber", 35, 170),
            ("a teacher", 45, 190),
            ("a waiter", 25, 120),
            ("a taxi driver", 28, 130),
            ("a barista", 22, 110),
            ("a programmer", 55, 220)
        ]
        
        job, min_reward, max_reward = random.choice(jobs)
        reward = random.randint(min_reward, max_reward)
        new_balance = user_data[2] + reward
        self._update_user(interaction.guild.id, interaction.user.id, balance=new_balance, last_work=now.isoformat())
        
        embed = discord.Embed(title="💼 Work Complete!", color=0x00FF00)
        embed.description = f"You worked as {job} and earned **${reward:,}**!\nYour new balance: **${new_balance:,}**"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="deposit", description="Deposit money into your bank")
    @app_commands.describe(amount="The amount to deposit (or 'all')")
    async def deposit(self, interaction: discord.Interaction, amount: str):
        user_data = self._get_user(interaction.guild.id, interaction.user.id)
        
        if amount.lower() == "all":
            deposit_amount = user_data[2]
        else:
            try:
                deposit_amount = int(amount)
            except ValueError:
                await interaction.response.send_message("❌ Please enter a valid number or 'all'!", ephemeral=True)
                return
        
        if deposit_amount <= 0:
            await interaction.response.send_message("❌ Please enter a positive amount!", ephemeral=True)
            return
        
        if deposit_amount > user_data[2]:
            await interaction.response.send_message(f"❌ You only have ${user_data[2]:,} in your wallet!", ephemeral=True)
            return
        
        new_balance = user_data[2] - deposit_amount
        new_bank = user_data[3] + deposit_amount
        self._update_user(interaction.guild.id, interaction.user.id, balance=new_balance, bank=new_bank)
        
        embed = discord.Embed(title="🏦 Deposit Complete!", color=0x00FF00)
        embed.description = f"You deposited **${deposit_amount:,}** into your bank!\n💳 Wallet: ${new_balance:,}\n🏦 Bank: ${new_bank:,}"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="withdraw", description="Withdraw money from your bank")
    @app_commands.describe(amount="The amount to withdraw (or 'all')")
    async def withdraw(self, interaction: discord.Interaction, amount: str):
        user_data = self._get_user(interaction.guild.id, interaction.user.id)
        
        if amount.lower() == "all":
            withdraw_amount = user_data[3]
        else:
            try:
                withdraw_amount = int(amount)
            except ValueError:
                await interaction.response.send_message("❌ Please enter a valid number or 'all'!", ephemeral=True)
                return
        
        if withdraw_amount <= 0:
            await interaction.response.send_message("❌ Please enter a positive amount!", ephemeral=True)
            return
        
        if withdraw_amount > user_data[3]:
            await interaction.response.send_message(f"❌ You only have ${user_data[3]:,} in your bank!", ephemeral=True)
            return
        
        new_balance = user_data[2] + withdraw_amount
        new_bank = user_data[3] - withdraw_amount
        self._update_user(interaction.guild.id, interaction.user.id, balance=new_balance, bank=new_bank)
        
        embed = discord.Embed(title="🏦 Withdrawal Complete!", color=0x00FF00)
        embed.description = f"You withdrew **${withdraw_amount:,}** from your bank!\n💳 Wallet: ${new_balance:,}\n🏦 Bank: ${new_bank:,}"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="shop", description="View the server shop")
    async def shop(self, interaction: discord.Interaction):
        items = self._get_shop_items(interaction.guild.id)
        
        if not items:
            await interaction.response.send_message("❌ There are no items in the shop yet!", ephemeral=True)
            return
        
        embed = discord.Embed(title="🛒 Server Shop", color=0xFFD700)
        for item in items:
            role = interaction.guild.get_role(item[5]) if item[5] else None
            value = f"Price: **${item[3]:,}**"
            if item[4]:
                value += f"\n{item[4]}"
            if role:
                value += f"\nRole: {role.mention}"
            embed.add_field(name=f"{item[2]} (ID: {item[0]})", value=value, inline=False)
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="buy", description="Buy an item from the shop")
    @app_commands.describe(item_id="The ID of the item to buy")
    async def buy(self, interaction: discord.Interaction, item_id: int):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT * FROM shop WHERE id = ? AND guild_id = ?', (item_id, interaction.guild.id))
            item = c.fetchone()
        
        if not item:
            await interaction.response.send_message("❌ Item not found!", ephemeral=True)
            return
        
        user_data = self._get_user(interaction.guild.id, interaction.user.id)
        if user_data[2] < item[3]:
            await interaction.response.send_message(f"❌ You need ${item[3]:,} to buy this item!", ephemeral=True)
            return
        
        # Deduct money
        new_balance = user_data[2] - item[3]
        self._update_user(interaction.guild.id, interaction.user.id, balance=new_balance)
        
        # Give role if applicable
        if item[5]:
            role = interaction.guild.get_role(item[5])
            if role:
                await interaction.user.add_roles(role)
        
        embed = discord.Embed(title="✅ Purchase Complete!", color=0x00FF00)
        embed.description = f"You bought **{item[2]}** for **${item[3]:,}**!\nYour new balance: **${new_balance:,}**"
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="shop-add", description="Add an item to the shop (admin)")
    @app_commands.describe(name="The name of the item", price="The price of the item", description="Item description (optional)", role="Role to give when purchased (optional)")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def shop_add(self, interaction: discord.Interaction, name: str, price: int, description: Optional[str] = None, role: Optional[discord.Role] = None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('INSERT INTO shop (guild_id, name, price, description, role_id) VALUES (?, ?, ?, ?, ?)',
                      (interaction.guild.id, name, price, description, role.id if role else None))
            conn.commit()
            item_id = c.lastrowid
        
        embed = discord.Embed(title="✅ Item Added!", color=0x00FF00)
        embed.description = f"Added **{name}** to the shop!\nID: {item_id}\nPrice: ${price:,}"
        if description:
            embed.add_field(name="Description", value=description, inline=False)
        if role:
            embed.add_field(name="Role", value=role.mention, inline=False)
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="shop-remove", description="Remove an item from the shop (admin)")
    @app_commands.describe(item_id="The ID of the item to remove")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def shop_remove(self, interaction: discord.Interaction, item_id: int):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('DELETE FROM shop WHERE id = ? AND guild_id = ?', (item_id, interaction.guild.id))
            conn.commit()
        
        await interaction.response.send_message("✅ Item removed from shop!", ephemeral=True)

    @app_commands.command(name="leaderboard", description="View the economy leaderboard")
    async def leaderboard(self, interaction: discord.Interaction):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute('SELECT user_id, balance, bank FROM users WHERE guild_id = ? ORDER BY (balance + bank) DESC LIMIT 10', (interaction.guild.id,))
            users = c.fetchall()
        
        if not users:
            await interaction.response.send_message("❌ No data yet!", ephemeral=True)
            return
        
        embed = discord.Embed(title="🏆 Economy Leaderboard", color=0xFFD700)
        for index, (user_id, balance, bank) in enumerate(users, 1):
            user = interaction.guild.get_member(user_id)
            name = user.display_name if user else f"User {user_id}"
            total = balance + bank
            medal = "🥇" if index == 1 else "🥈" if index == 2 else "🥉" if index == 3 else f"#{index}"
            embed.add_field(name=f"{medal} {name}", value=f"Total: **${total:,}**\n💳 ${balance:,} | 🏦 ${bank:,}", inline=False)
        
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Economy(bot))
