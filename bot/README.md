<div align="center">

```
███████╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗
╚══███╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚██╗██╔╝
  ███╔╝  ╚████╔╝ ██████╔╝██║   ██║ ╚███╔╝ 
 ███╔╝    ╚██╔╝  ██╔══██╗██║   ██║ ██╔██╗ 
███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

<h3>ZyroX Bot — Python Discord Bot + FastAPI Backend</h3>
  <a href="https://nexiohost.in"><img src="https://img.shields.io/badge/⭐%20PREMIUM%20HOSTING-NexioHost-FFD700?style=for-the-badge&labelColor=1a1a2e&color=FFD700&logoColor=FFD700"/></a>
<p>
  <a href="https://python.org"><img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white"/></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white"/></a>
  <a href="https://discordpy.readthedocs.io"><img src="https://img.shields.io/badge/Discord.py-v2-5865F2?style=for-the-badge&logo=discord&logoColor=white"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-red?style=for-the-badge"/></a>
</p>
<p>
  <a href="https://discord.gg/codexdev"><img src="https://img.shields.io/badge/Discord-Join_Server-5865F2?style=for-the-badge&logo=discord&logoColor=white"/></a>
  <a href="https://youtube.com/@CodeXDevs"><img src="https://img.shields.io/badge/YouTube-CodeXDevs-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>
  <a href="https://github.com/RayExo"><img src="https://img.shields.io/badge/GitHub-RayExo-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
</p>

</div>

---

## ✦ Overview

This folder contains the ZyroX Discord bot built on `discord.py v2` alongside a `FastAPI` backend that powers the web dashboard. It handles all server moderation, music, leveling, mini-games, and utility features — all from a single `python CodeX.py` command.

```
bot/
├── api/                   FastAPI backend (routes, schemas, db manager)
│   └── routes/            /bot  /guilds  /admin
├── cogs/
│   ├── antinuke/          Antinuke protection event listeners
│   ├── automod/           Automod enforcement event listeners
│   ├── commands/          All slash & prefix command modules
│   ├── events/            General Discord event listeners
│   ├── moderation/        Moderation action modules
│   └── zyrox/             Core ZyroX feature cogs
├── core/                  Bot client, context, cog base classes
├── games/                 Standalone game logic + button views
├── utils/                 Emoji, tools, sync, ngrok tunnel
├── assets/                Fonts, backgrounds, GIFs
└── CodeX.py               Entry point
```

---

## ✦ Features

<table>
<tr>
<td width="50%">

**🛡️ Antinuke**
- Mass ban, kick, channel & role flood detection
- Webhook abuse, bot add, prune protection
- Anti-member update
- Whitelist / unwhitelist system
- Emergency lockdown mode

</td>
<td width="50%">

**🤖 Automod**
- Anti-spam, anti-caps, anti-links
- Anti-invites, mass mention, emoji spam
- Fully configurable per server
- Works alongside Discord's native automod

</td>
</tr>
<tr>
<td>

**🎵 Music**
- Lavalink v4 powered playback
- YouTube, SoundCloud, JioSaavn support
- Queue, loop, shuffle, autoplay
- Seek, rewind, forward controls

</td>
<td>

**⚙️ Moderation**
- Ban, kick, mute, warn, lock, jail
- Snipe, message management
- Full logging system
- Reaction roles, vanity roles, invite tracker

</td>
</tr>
<tr>
<td>

**🎉 Engagement**
- Leveling & XP with leaderboard
- Birthday tracker
- Counting, AFK, autorole, autoresponder
- Sticky messages, booster perks, giveaways

</td>
<td>

**🎮 Games**
- Chess, Battleship, Connect Four
- Wordle, Typeracer, 2048, Memory
- Reaction test, RPS, Tic-tac-toe
- Country guess, Number slider, Lights out

</td>
</tr>
<tr>
<td>

**🌐 API Backend**
- FastAPI with API key auth
- SlowAPI rate limiting
- Structured JSON request logging
- CORS configured for your dashboard domain
- `CORS_ORIGINS` env var for extra domains

</td>
<td>

**🔧 Developer**
- Jishaku eval support
- Application emoji auto-sync
- Slash + prefix commands
- ngrok HTTPS tunnel (pyngrok — no system install)
- CodeX Devs watermark on every source file

</td>
</tr>
</table>

---

## ✦ Prerequisites

| Requirement | Notes |
|---|---|
| Python 3.10+ | — |
| Lavalink v4 node | for music features |
| Discord bot token | from Developer Portal |
| ngrok free account | for HTTPS tunnel |

---

## ✦ Setup

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

Create a `.env` file in this folder:

```env
# ── Core ──────────────────────────────────────────────────────────
TOKEN              = your_discord_bot_token
brand_name         = 'ZyroX'

# ── Lavalink ──────────────────────────────────────────────────────
LAVALINK_HOST      = "lava-v4.ajieblogs.eu.org"
LAVALINK_PASSWORD  = "your_password"
LAVALINK_SECURE    = "true"     # true = HTTPS (no port needed)
LAVALINK_PORT      = ""         # only needed when LAVALINK_SECURE=false

# ── Emoji Sync ────────────────────────────────────────────────────
EMOJI_SYNC         = "true"

# ── API / Dashboard Backend ───────────────────────────────────────
API_ENABLED        = "true"
API_PORT           = "8000"
DASHBOARD_API_KEY  = "change_this_to_a_strong_secret"
CORS_ORIGINS       = ""         # extra allowed origins, comma-separated

# ── HTTPS Tunnel (ngrok) ──────────────────────────────────────────
TUNNEL_ENABLED     = "true"
NGROK_AUTHTOKEN    = "your_ngrok_authtoken"
NGROK_DOMAIN       = "xxxx-xxxx-xxxx.ngrok-free.app"

# ── Webhooks ──────────────────────────────────────────────────────
WEBHOOK_URL        = "https://discord.com/api/webhooks/..."
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
| `LAVALINK_PORT` | _(empty)_ | Port — only when `LAVALINK_SECURE=false` |
| `EMOJI_SYNC` | `true` | Auto-sync application emojis on startup |
| `API_ENABLED` | `true` | Start the FastAPI dashboard backend |
| `API_PORT` | `8000` | Port the backend listens on |
| `DASHBOARD_API_KEY` | — | Shared secret between bot API and dashboard |
| `CORS_ORIGINS` | _(empty)_ | Extra CORS-allowed origins, comma-separated |
| `WEBHOOK_URL` | — | Discord webhook for command logs |
| `TUNNEL_ENABLED` | `true` | Expose API over HTTPS via ngrok |
| `NGROK_AUTHTOKEN` | — | ngrok auth token |
| `NGROK_DOMAIN` | — | Reserved static domain (e.g. `xxxx.ngrok-free.app`) |

---

## ✦ HTTPS Tunnel (ngrok)

Uses **pyngrok** — downloads the ngrok binary automatically on first run. No system installs, works on Pterodactyl and any Python host.

### One-time setup

1. Sign up free at [ngrok.com](https://ngrok.com)
2. Copy your authtoken from [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Reserve a free static domain at [dashboard.ngrok.com/domains](https://dashboard.ngrok.com/domains) — looks like `xxxx.ngrok-free.app`
4. Add `NGROK_AUTHTOKEN` and `NGROK_DOMAIN` to `.env`

On every startup the console prints:
```
◈ Tunnel: API is live at  https://xxxx.ngrok-free.app
  ↳ set NEXT_PUBLIC_API_URL=https://xxxx.ngrok-free.app/api/v1
```

Set `TUNNEL_ENABLED=false` to disable.

---

## ✦ Emoji Sync

When `EMOJI_SYNC=true`, the bot syncs application emojis on every startup:

| Event | Action |
|---|---|
| New emoji found | Uploaded to application, ID written to `emoji.py` |
| Stale ID detected | `emoji.py` patched automatically |
| No changes | Sync completes instantly, no restart |
| After any patch | Bot restarts so fresh IDs are live |

---

## ✦ Deployment

Upload the entire `bot/` folder to your host and set the start command to:

```bash
python CodeX.py
```

pyngrok downloads the ngrok binary on first run — no extra steps needed on any host.

> Recommended free hosts: Render · Railway · Fly.io · Pterodactyl
>
> ⭐ **[NexioHost](https://nexiohost.in)** — Premium bot hosting, built for Discord bots. Fast, reliable, and affordable.

---

## ✦ Troubleshooting

| Problem | Fix |
|---|---|
| Bot fails to start | Check `TOKEN` and gateway intents in Developer Portal |
| Music not working | Verify `LAVALINK_HOST`, `LAVALINK_SECURE`, `LAVALINK_PORT` |
| Dashboard can't reach API | Check `API_ENABLED=true` and `NEXT_PUBLIC_API_URL` in dashboard |
| CORS errors | Add your Vercel URL to `CORS_ORIGINS` in `.env` |
| Emojis showing as plain text | Run once with `EMOJI_SYNC=true` to upload and patch IDs |
| Tunnel not starting | Check `NGROK_AUTHTOKEN` is valid |
| Tunnel URL changes each restart | Set `NGROK_DOMAIN` to your reserved static domain |

---

<div align="center">

## ✦ CodeX Devs

*Built for protection. Designed for style.*

<p>
  <a href="https://discord.gg/codexdev"><img src="https://img.shields.io/badge/Discord-Join_Server-5865F2?style=for-the-badge&logo=discord&logoColor=white"/></a>
  <a href="https://youtube.com/@CodeXDevs"><img src="https://img.shields.io/badge/YouTube-CodeXDevs-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>
  <a href="https://github.com/RayExo"><img src="https://img.shields.io/badge/GitHub-RayExo-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
  <a href="https://nexiohost.in"><img src="https://img.shields.io/badge/⭐%20PREMIUM%20HOSTING-NexioHost-FFD700?style=for-the-badge&labelColor=1a1a2e&color=FFD700&logoColor=FFD700"/></a>
</p>

© 2026 CodeX Devs — MIT License

</div>
