<div align="center">

```
███████╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗
╚══███╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚██╗██╔╝
  ███╔╝  ╚████╔╝ ██████╔╝██║   ██║ ╚███╔╝ 
 ███╔╝    ╚██╔╝  ██╔══██╗██║   ██║ ██╔██╗ 
███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

**ZyroX Bot — Python Discord Bot + FastAPI Backend**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Discord](https://img.shields.io/badge/Discord.py-v2-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discordpy.readthedocs.io)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)
[![Support](https://img.shields.io/badge/Support-discord.gg/codexdev-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/codexdev)

</div>

---

## ✦ Overview

This folder contains the ZyroX Discord bot built on `discord.py v2` with a `FastAPI` backend that powers the web dashboard. It handles all server moderation, music, leveling, and utility features.

```
bot/
├── api/               FastAPI backend (routes, schemas, db manager)
├── cogs/
│   ├── antinuke/      Antinuke protection events
│   ├── automod/       Automod enforcement events
│   ├── commands/      All slash & prefix commands
│   └── events/        General Discord event listeners
├── utils/             Shared utilities (emoji, tools, sync)
├── assets/            Fonts, backgrounds, GIFs
└── CodeX.py           Entry point
```

---

## ✦ Features

**🛡️ Antinuke**
- Protection against mass ban, kick, channel/role flood, webhook abuse, bot adds, prune, and more
- Whitelist / unwhitelist system
- Emergency lockdown mode

**🤖 Automod**
- Anti-spam, anti-caps, anti-links, anti-invites
- Mass mention and emoji spam protection
- Fully configurable per server

**🎵 Music**
- Lavalink v4 powered playback
- YouTube, SoundCloud, JioSaavn support
- Queue, loop, shuffle, autoplay, seek controls

**⚙️ Moderation & Management**
- Ban, kick, mute, warn, lock, and more
- Logging, reaction roles, vanity roles
- Tickets, giveaways, verification, join-to-create VC

**🎉 Engagement**
- Leveling & XP system
- Birthday tracker, AFK, autorole
- Counting, blackjack, slots, autoresponder, sticky messages

**🔧 Developer**
- Jishaku eval support
- Application emoji auto-sync
- Slash + prefix commands
- FastAPI backend with API key auth

---

## ✦ Setup

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.10 or higher |
| A Lavalink node | v4 |
| Discord bot token | — |

### 1 — Install dependencies

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
```

### 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# ── Core ──────────────────────────────────────
TOKEN = your_discord_bot_token
brand_name = 'ZyroX'

# ── Lavalink ──────────────────────────────────
LAVALINK_HOST     = "lava-v4.ajieblogs.eu.org"
LAVALINK_PASSWORD = "your_password"
LAVALINK_SECURE   = "true"    # true = HTTPS (no port needed)
LAVALINK_PORT     = ""        # only needed when LAVALINK_SECURE=false

# ── Emoji Sync ────────────────────────────────
EMOJI_SYNC = "true"           # auto-uploads & patches emoji.py on startup

# ── API / Dashboard Backend ───────────────────
API_ENABLED       = "true"    # false = skip starting the FastAPI server
API_PORT          = "8000"
DASHBOARD_API_KEY = "change_this_to_a_strong_secret"

# ── Webhooks ──────────────────────────────────
WEBHOOK_URL = "https://discord.com/api/webhooks/..."
```

### 3 — Run

```bash
python CodeX.py
```

---

## ✦ Environment Reference

| Variable | Default | Description |
|---|---|---|
| `TOKEN` | — | Discord bot token |
| `LAVALINK_HOST` | — | Lavalink server hostname (no protocol) |
| `LAVALINK_PASSWORD` | — | Lavalink password |
| `LAVALINK_SECURE` | `true` | `true` = HTTPS, `false` = HTTP |
| `LAVALINK_PORT` | _(empty)_ | Port — only needed when `LAVALINK_SECURE=false` |
| `EMOJI_SYNC` | `true` | Run application emoji sync on startup |
| `API_ENABLED` | `true` | Start the FastAPI dashboard backend |
| `API_PORT` | `8000` | Port the backend listens on |
| `DASHBOARD_API_KEY` | — | Shared secret between bot API and dashboard |
| `WEBHOOK_URL` | — | Discord webhook for command logs |

---

## ✦ Emoji Sync

When `EMOJI_SYNC=true`, the bot automatically syncs application emojis on every startup:

```
★ Starting Application Emoji Sync — 140 unique emojis found in emoji.py
◈ Found 140 templates | Application hosts 98 emojis
↑ Uploading: ztick  (not in application emojis)
✔ Uploaded: ztick  [saved as ID: 1234567890]
✔ emoji.py patched in-place to reflect current API state.
★ Restarting bot to load updated emoji IDs...
```

- New emojis → uploaded to your application, ID written to `emoji.py`
- Stale IDs → `emoji.py` is patched automatically
- No changes → sync completes instantly, no restart
- After any patch → bot restarts itself so fresh IDs are live immediately

Set `EMOJI_SYNC=false` to disable entirely.

---

## ✦ Deployment

Upload the entire `bot/` folder to your host (Render, Railway, Fly.io, VPS) and set the start command to:

```bash
python CodeX.py
```

Add all environment variables from `.env.example`. Make sure port `API_PORT` (`8000` by default) is publicly reachable if you're using the dashboard.

> Recommended free/cheap hosts: [NexioHost](https://nexiohost.in) · Render · Railway

---

## ✦ Troubleshooting

| Problem | Fix |
|---|---|
| Bot fails to start | Check `TOKEN` is set correctly and the bot has the right gateway intents |
| Music not working | Verify `LAVALINK_HOST`, `LAVALINK_SECURE`, and `LAVALINK_PORT` are correct |
| Dashboard can't load data | Confirm `API_ENABLED=true`, bot is running, and `NEXT_PUBLIC_API_URL` in the dashboard is correct |
| Emojis showing as plain text | Run with `EMOJI_SYNC=true` once to upload and patch IDs |
| Port conflict on API | Change `API_PORT` in `.env` and update `NEXT_PUBLIC_API_URL` in the dashboard |

---

<div align="center">

Developed with ❤️ by **CodeX Devs**

[![Discord](https://img.shields.io/badge/Join_Support_Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/codexdev)
[![Hosting](https://img.shields.io/badge/Bot_Hosting-NexioHost-FF6B6B?style=for-the-badge)](https://nexiohost.in)

*ZyroX — Built for protection. Designed for style.*

</div>
