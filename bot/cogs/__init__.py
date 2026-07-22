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

from __future__ import annotations
from core import nyzro
from colorama import Fore, Style, init


from .commands.help import Help
from .commands.general import General
from .commands.music import Music
from .commands.automod import Automod
from .commands.welcome import Welcomer
from .commands.fun import Fun
from .commands.Games import Games
from .commands.extra import Extra
from .commands.owner import Owner
from .commands.voice import Voice
from .commands.afk import afk
from .commands.ignore import Ignore
from .commands.Media import Media
from .commands.Invc import Invcrole
from .commands.giveaway import Giveaway
from .commands.Embed import Embed
from .commands.steal import Steal
from .commands.timer import Timer
from .commands.blacklist import Blacklist
from .commands.block import Block
from .commands.nightmode import Nightmode
from .commands.tracking import Tracking
from .commands.owner import Badges
#from .commands.map import Map
from .commands.autoresponder import AutoResponder
from .commands.customrole import Customrole
from .commands.autorole import AutoRole
from .commands.ticket import TicketCog
from .commands.logging import Logging
from .commands.translate import TranslateCog
from .commands.jail import Jail
from .commands.antinuke import Antinuke
from .commands.extraown import Extraowner
from .commands.anti_wl import Whitelist
from .commands.anti_unwl import Unwhitelist
from .commands.slots import Slots
from .commands.blackjack import Blackjack
from .commands.autoreact import AutoReaction
from .commands.stats import Stats
from .commands.emergency import Emergency
from .commands.notify import NotifCommands
from .commands.status import Status
from .commands.np import NoPrefix
from .commands.filters import FilterCog
from .commands.owner2 import Global
from .commands.qr import QR
from .commands.vanityroles import VanityRoles
from .commands.reactionroles import ReactionRoles 
from .commands.messages import Messages
from .commands.fastgreet import FastGreet
from .commands.counting import Counting
from .commands.j2c import JoinToCreate
from .commands.ai import AI 
from .commands.dms import StaffDMCog
from .commands.booster import Booster
from .commands.leveling import Leveling
from .commands.stickymessage import StickyMessage
from .commands.verification import Verification
from .commands.minecraft import Minecraft
from .commands.encryption import encryption
from .commands.calc import calculator
from .commands.joindm import joindm
from .commands.Birthday import Birthdays
from .commands.nitro import Nitro
from .commands.image import ImageCommands
from .commands.youtube import Youtube
from .commands.starboard import Starboard
from .commands.voicelog import VoiceLog
from .commands.economy import Economy
from .commands.customcommands import CustomCommands
from .commands.premium import Premium
#____________ Events _____________

#from .events.autoblacklist import AutoBlacklist
from .events.Errors import Errors
from .events.on_guild import Guild
from .events.autorole import Autorole2
from .events.auto import Autorole
from .events.greet2 import greet
from .events.mention import Mention
from .events.react import React
from .events.autoreact import AutoReactListener
#from .events.topgg import TopGG
from .events.ai import AIResponses
from .events.admin_ai import AdminAI
from .events.stickymessage import StickyMessageListener

########-------HELP-------########
from .nyzro.antinuke import _antinuke
from .nyzro.extra import _extra
from .nyzro.general import _general
from .nyzro.automod import _automod 
from .nyzro.moderation import _moderation
#from .nyzro.inviteTracker import _inviteTracker
from .nyzro.music import _music
from .nyzro.fun import _fun
from .nyzro.games import _games
from .nyzro.ignore import _ignore
from .nyzro.server import _server
from .nyzro.voice import _voice 
from .nyzro.welcome import _welcome 
from .nyzro.giveaway import _giveaway
from .nyzro.ticket import _ticket
#from .axon.vanityroles import Vanityroles69999
from .nyzro.logging import _logging
from .nyzro.vanity import _vanity
from .nyzro.inviteTracker import inviteTracker 
from .nyzro.counting import _Counting
from .nyzro.j2c import _J2C
from .nyzro.ai import _ai
from .nyzro.booster import __boost 
from .nyzro.leveling import _leveling
from .nyzro.sticky import _sticky
from .nyzro.verify import _verify
from .nyzro.encryption import _encrypt
from .nyzro.mc import _mc
from .nyzro.joindm import _joindm
from .nyzro.birth import _birth

#########ANTINUKE#########

from .antinuke.anti_member_update import AntiMemberUpdate
from .antinuke.antiban import AntiBan
from .antinuke.antibotadd import AntiBotAdd
from .antinuke.antichcr import AntiChannelCreate
from .antinuke.antichdl import AntiChannelDelete
from .antinuke.antichup import AntiChannelUpdate
from .antinuke.antieveryone import AntiEveryone
from .antinuke.antiguild import AntiGuildUpdate
from .antinuke.antiIntegration import AntiIntegration
from .antinuke.antikick import AntiKick
from .antinuke.antiprune import AntiPrune
from .antinuke.antirlcr import AntiRoleCreate
from .antinuke.antirldl import AntiRoleDelete
from .antinuke.antirlup import AntiRoleUpdate
from .antinuke.antiwebhook import AntiWebhookUpdate
from .antinuke.antiwebhookcr import AntiWebhookCreate
from .antinuke.antiwebhookdl import AntiWebhookDelete

#Extra Optional Events 

#from .antinuke.antiemocr import AntiEmojiCreate
#from .antinuke.antiemodl import AntiEmojiDelete
#from .antinuke.antiemoup import AntiEmojiUpdate
#from .antinuke.antisticker import AntiSticker
#from .antinuke.antiunban import AntiUnban

############ AUTOMOD ############
from .automod.antispam import AntiSpam
from .automod.anticaps import AntiCaps
from .automod.antilink import AntiLink
from .automod.anti_invites import AntiInvite
from .automod.anti_mass_mention import AntiMassMention
from .automod.anti_emoji_spam import AntiEmojiSpam


from .moderation.ban import Ban
from .moderation.unban import Unban
from .moderation.timeout import Mute
from .moderation.unmute import Unmute
from .moderation.lock import Lock
from .moderation.unlock import Unlock
from .moderation.hide import Hide
from .moderation.unhide import Unhide
from .moderation.kick import Kick
from .moderation.warn import Warn
from .moderation.role import Role
from .moderation.message import Message
from .moderation.moderation import Moderation
from .moderation.topcheck import TopCheck
from .moderation.snipe import Snipe


from utils.config import BotName

async def _safe_add_cog(bot, cog_class, *args, **kwargs):
    try:
        await bot.add_cog(cog_class(*args, **kwargs))
        return True
    except Exception as e:
        print(f"{Fore.YELLOW}{Style.BRIGHT}Cog '{cog_class.__name__}' failed to load: {e}{Fore.RESET}")
        return False

async def setup(bot: nyzro):
  loaded = 0
  failed = 0

  for cog_cls, args_list in [
    (Help, [bot]), (General, [bot]), (Music, [bot]), (Automod, [bot]),
    (Welcomer, [bot]), (Fun, [bot]), (Tracking, [bot]), (Games, [bot]),
    (Extra, [bot]), (Voice, [bot]), (Owner, [bot]), (Customrole, [bot]),
    (afk, [bot]), (Embed, [bot]), (Media, [bot]), (Ignore, [bot]),
    (Invcrole, [bot]), (Giveaway, [bot]), (Steal, [bot]), (Booster, [bot]),
    (Timer, [bot]), (Blacklist, [bot]), (Block, [bot]), (Nightmode, [bot]),
    (Badges, [bot]), (Antinuke, [bot]), (Whitelist, [bot]), (Unwhitelist, [bot]),
    (Extraowner, [bot]), (Slots, [bot]), (Blackjack, [bot]), (Stats, [bot]),
    (Emergency, [bot]), (Status, [bot]), (NoPrefix, [bot]), (FilterCog, [bot]),
    (Global, [bot]), (TicketCog, [bot]), (Logging, [bot]), (QR, [bot]),
    (VanityRoles, [bot]), (ReactionRoles, [bot]), (Messages, [bot]),
    (TranslateCog, [bot]), (FastGreet, [bot]), (Jail, [bot]), (JoinToCreate, [bot]),
    (AI, [bot]), (StaffDMCog, [bot]), (Leveling, [bot]), (StickyMessage, [bot]),
    (Verification, [bot]), (Minecraft, [bot]), (encryption, [bot]),
    (calculator, [bot]), (joindm, [bot]), (Birthdays, [bot]), (Nitro, [bot]),
    (ImageCommands, [bot]), (Youtube, [bot]), (Starboard, [bot]), (VoiceLog, [bot]),
    (Economy, [bot]), (CustomCommands, [bot]), (Premium, [bot]),
    (_antinuke, [bot]), (_extra, [bot]), (_general, [bot]), (_automod, [bot]),
    (_moderation, [bot]), (_music, [bot]), (_fun, [bot]), (_games, [bot]),
    (_ignore, [bot]), (_server, [bot]), (_voice, [bot]), (_welcome, [bot]),
    (_giveaway, [bot]), (_ticket, [bot]), (_logging, [bot]), (_vanity, [bot]),
    (inviteTracker, [bot]), (Counting, [bot]), (_Counting, [bot]), (_J2C, [bot]),
    (_ai, [bot]), (__boost, [bot]), (_leveling, [bot]), (_sticky, [bot]),
    (_verify, [bot]), (_encrypt, [bot]), (_mc, [bot]), (_joindm, [bot]),
    (_birth, [bot]),
    (Guild, [bot]), (Errors, [bot]), (Autorole2, [bot]), (Autorole, [bot]),
    (greet, [bot]), (AutoResponder, [bot]), (Mention, [bot]), (AutoRole, [bot]),
    (React, [bot]), (AutoReaction, [bot]), (AutoReactListener, [bot]),
    (NotifCommands, [bot]), (StickyMessageListener, [bot]), (AIResponses, [bot]), (AdminAI, [bot]),
    (AntiMemberUpdate, [bot]), (AntiBan, [bot]), (AntiBotAdd, [bot]),
    (AntiChannelCreate, [bot]), (AntiChannelDelete, [bot]), (AntiChannelUpdate, [bot]),
    (AntiEveryone, [bot]), (AntiGuildUpdate, [bot]), (AntiIntegration, [bot]),
    (AntiKick, [bot]), (AntiPrune, [bot]), (AntiRoleCreate, [bot]),
    (AntiRoleDelete, [bot]), (AntiRoleUpdate, [bot]), (AntiWebhookUpdate, [bot]),
    (AntiWebhookCreate, [bot]), (AntiWebhookDelete, [bot]),
    (AntiSpam, [bot]), (AntiCaps, [bot]), (AntiInvite, [bot]), (AntiLink, [bot]),
    (AntiMassMention, [bot]), (AntiEmojiSpam, [bot]),
    (Ban, [bot]), (Unban, [bot]), (Mute, [bot]), (Unmute, [bot]),
    (Lock, [bot]), (Unlock, [bot]), (Hide, [bot]), (Unhide, [bot]),
    (Kick, [bot]), (Warn, [bot]), (Role, [bot]), (Message, [bot]),
    (Moderation, [bot]), (TopCheck, [bot]), (Snipe, [bot])
  ]:
    if await _safe_add_cog(bot, cog_cls, *args_list):
        loaded += 1
    else:
        failed += 1

  print(Fore.RED + Style.BRIGHT + f"Loaded {loaded} cogs | Failed: {failed}")
  if failed == 0:
    print(Fore.RED + Style.BRIGHT + f"All {BotName} Cogs loaded successfully.")
