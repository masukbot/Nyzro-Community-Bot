<div align="center">

```
███████╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗
╚══███╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚██╗██╔╝
  ███╔╝  ╚████╔╝ ██████╔╝██║   ██║ ╚███╔╝ 
 ███╔╝    ╚██╔╝  ██╔══██╗██║   ██║ ██╔██╗ 
███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

**A feature-rich Discord bot paired with a sleek Next.js dashboard**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Discord](https://img.shields.io/badge/Discord.py-v2-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discordpy.readthedocs.io)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)
[![Support](https://img.shields.io/badge/Support-discord.gg/codexdev-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/codexdev)

</div>

---

## ✦ Overview

ZyroX is a fully-featured Discord bot with a modern web dashboard for managing everything from antinuke to music. Built on `discord.py v2`, `FastAPI`, and `Next.js 14` with Tailwind CSS.

```
ZyroX-CV2-With-Dashboard/
├── 🤖  bot/               Python Discord bot + FastAPI backend
│   ├── api/               Dashboard REST API (FastAPI)
│   ├── cogs/              All bot features (commands, events, antinuke, automod…)
│   ├── utils/             Shared utilities (emoji, tools, sync…)
│   ├── assets/            Fonts, backgrounds, GIFs
│   └── CodeX.py           Entry point
│
└── 🌐  dashboard/         Next.js frontend
    ├── app/               App Router pages
    ├── components/        Reusable UI components
    ├── hooks/             Custom React hooks
    └── lib/               API helpers & utilities
```

---

## ✦ Features

<table>
<tr>
<td width="50%">

**🛡️ Security**
- Antinuke (ban, kick, channel/role flood, webhook abuse…)
- Automod (spam, caps, links, invites, mass mentions, emoji spam)
- Anti-member update protection
- Whitelist / unwhitelist system
- Emergency mode

</td>
<td width="50%">

**🎵 Music**
- Lavalink v4 powered playback
- YouTube, SoundCloud, JioSaavn search
- Queue, loop, autoplay, shuffle
- Seek, rewind, forward controls
- Fully configurable via `.env`

</td>
</tr>
<tr>
<td>

**⚙️ Management**
- Moderation (ban, kick, mute, warn, lock…)
- Logging system
- Reaction roles, vanity roles
- Tickets, giveaways, verification
- Join-to-create voice channels

</td>
<td>

**🌐 Dashboard**
- Discord OAuth2 login
- Per-server settings management
- Bot stats & live data
- Fully branded & customisable
- Deployed to Vercel in minutes

</td>
</tr>
<tr>
<td>

**🎉 Engagement**
- Leveling system with XP
- Birthday tracker
- Counting games, blackjack, slots
- AFK system, autorole, autoresponder
- Sticky messages, booster perks

</td>
<td>

**🔧 Developer**
- Application emoji auto-sync
- Jishaku eval support
- Slash + prefix commands
- FastAPI backend with API key auth
- Hot-patchable emoji.py on startup

</td>
</tr>
</table>

---

## ✦ Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.10 or higher |
| Node.js | 18 or higher |
| A Lavalink node | v4 |
| Discord bot token | — |
| Discord OAuth app | (for dashboard) |

---

## ✦ Bot Setup

**1 — Clone and enter the bot folder**

```bash
git clone https://github.com/your-org/ZyroX-CV2-With-Dashboard
cd ZyroX-CV2-With-Dashboard/bot
```

**2 — Create a virtual environment and install dependencies**

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
```

**3 — Configure the environment**

```bash
cp .env.example .env
```

Then edit `.env`:

```env
# ── Core ──────────────────────────────────────
TOKEN = your_discord_bot_token
brand_name = 'ZyroX'

# ── Lavalink ──────────────────────────────────
LAVALINK_HOST     = "lava-v4.ajieblogs.eu.org"
LAVALINK_PASSWORD = "your_password"
LAVALINK_SECURE   = "true"    # true = https (no port needed)
LAVALINK_PORT     = ""        # only needed when LAVALINK_SECURE=false

# ── Emoji Sync ────────────────────────────────
EMOJI_SYNC = "true"           # auto-uploads & patches emoji.py on startup
                              # restarts the bot automatically after patching

# ── API / Dashboard Backend ───────────────────
API_ENABLED       = "true"    # false = skip starting the FastAPI server
API_PORT          = "8000"
DASHBOARD_API_KEY = "change_this_to_a_strong_secret"

# ── Webhooks ──────────────────────────────────
WEBHOOK_URL = "https://discord.com/api/webhooks/..."
```

**4 — Run the bot**

```bash
python CodeX.py
```

---

## ✦ Dashboard Setup

**1 — Install dependencies**

```bash
cd dashboard
npm install
```

**2 — Configure the environment**

```bash
cp .env.example .env.local
```

Edit `dashboard/.env.local`:

```env
NEXT_PUBLIC_API_URL           = http://localhost:8000/api/v1
NEXT_PUBLIC_DASHBOARD_API_KEY = your_shared_api_key   # must match bot's DASHBOARD_API_KEY

NEXTAUTH_URL    = http://localhost:3000
NEXTAUTH_SECRET = a_long_random_string

DISCORD_CLIENT_ID     = your_discord_oauth_client_id
DISCORD_CLIENT_SECRET = your_discord_oauth_client_secret

NEXT_PUBLIC_ADMIN_IDS    = your_discord_user_id
NEXT_PUBLIC_BRAND_NAME   = "ZyroX"
NEXT_PUBLIC_BRAND_NAME_WORD = "ZX"
```

**3 — Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✦ Environment Reference

### Bot — `bot/.env`

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

### Dashboard — `dashboard/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full URL to the bot's FastAPI backend |
| `NEXT_PUBLIC_DASHBOARD_API_KEY` | Must match `DASHBOARD_API_KEY` in the bot |
| `NEXTAUTH_URL` | Your dashboard's public URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session signing |
| `DISCORD_CLIENT_ID` | Discord OAuth2 client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 client secret |
| `NEXT_PUBLIC_ADMIN_IDS` | Comma-separated Discord user IDs with admin access |
| `NEXT_PUBLIC_BRAND_NAME` | Bot name shown in the dashboard UI |
| `NEXT_PUBLIC_BRAND_NAME_WORD` | Short abbreviation shown in the dashboard |

---

## ✦ Deployment

### 🤖 Bot — any Python host

1. Upload the entire `bot/` folder to your host (Render, Railway, Fly.io, VPS…)
2. Set the start command to `python CodeX.py`
3. Add all environment variables from `.env.example`
4. Make sure port `API_PORT` (`8000` by default) is publicly reachable if you're using the dashboard

> Recommended free/cheap hosts: [NexioHost](https://nexiohost.in) · Render · Railway

### 🌐 Dashboard — Vercel (recommended)

> **That's literally it — upload the folder, add the variables, done.**

**Step 1 — Upload to Vercel**

Go to [vercel.com](https://vercel.com) → **Add New Project** → drag and drop the `dashboard/` folder  
*(or connect your GitHub repo and set the root directory to `dashboard/`)*

Vercel auto-detects Next.js — no build settings to touch.

---

**Step 2 — Add environment variables**

In your Vercel project → **Settings → Environment Variables**, add these:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | Your bot API URL, e.g. `https://your-bot.render.com/api/v1` |
| `NEXT_PUBLIC_DASHBOARD_API_KEY` | Same value as `DASHBOARD_API_KEY` in the bot `.env` |
| `NEXTAUTH_URL` | Your Vercel domain, e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Any long random string — [generate one here](https://generate-secret.vercel.app/32) |
| `DISCORD_CLIENT_ID` | From [Discord Developer Portal](https://discord.com/developers/applications) |
| `DISCORD_CLIENT_SECRET` | From Discord Developer Portal |
| `NEXT_PUBLIC_ADMIN_IDS` | Your Discord user ID |
| `NEXT_PUBLIC_BRAND_NAME` | `ZyroX` *(or your custom name)* |
| `NEXT_PUBLIC_BRAND_NAME_WORD` | `ZX` *(short version)* |

---

**Step 3 — Add the redirect URI in Discord**

Go to your app in the [Discord Developer Portal](https://discord.com/developers/applications)  
→ **OAuth2 → Redirects** → add:

```
https://your-app.vercel.app/api/auth/callback/discord
```

---

**Step 4 — Deploy**

Hit **Deploy**. Vercel builds and publishes automatically. Your dashboard is live. ✓

---

## ✦ Emoji Sync

ZyroX includes an automatic emoji sync system that runs on every startup (when `EMOJI_SYNC=true`):

```
★ Starting Application Emoji Sync — 140 unique emojis found in emoji.py
◈ Found 140 templates | Application hosts 98 emojis
↑ Uploading: ztick  (not in application emojis)
✔ Uploaded: ztick  [saved as ID: 1234567890]
✔ emoji.py patched in-place to reflect current API state.
★ Restarting bot to load updated emoji IDs...
```

- **New emoji** → downloaded from CDN, uploaded to your application, ID written to `emoji.py`  
- **Stale ID** → `emoji.py` is patched automatically  
- **No changes** → sync completes instantly, no restart  
- **After any patch** → bot restarts itself so the fresh IDs are live immediately  

Set `EMOJI_SYNC=false` to disable entirely.

---

## ✦ Security Notes

- Never commit `.env` files or real tokens to a public repo — `.gitignore` already covers them
- Use a strong, unique `NEXTAUTH_SECRET` and `DASHBOARD_API_KEY`
- Rotate any secret that gets accidentally exposed
- Keep Discord OAuth credentials in environment variables only
- The bot API should always be behind an API key when publicly hosted

---

## ✦ Troubleshooting

| Problem | Fix |
|---|---|
| Bot fails to start | Check `TOKEN` is set correctly and the bot has the right gateway intents |
| Music not working | Verify `LAVALINK_HOST`, `LAVALINK_SECURE`, and `LAVALINK_PORT` are correct |
| Dashboard shows auth error | Check Discord OAuth client ID/secret and redirect URI in Developer Portal |
| Dashboard can't load data | Confirm `API_ENABLED=true`, the bot is running, and `NEXT_PUBLIC_API_URL` is correct |
| Emojis showing as plain text | Run with `EMOJI_SYNC=true` once to upload and patch IDs |
| Port conflict on API | Change `API_PORT` in `.env` and update `NEXT_PUBLIC_API_URL` in the dashboard |

---

## ✦ Credits & Links

<div align="center">

Developed with ❤️ by **CodeX Devs**

[![Discord](https://img.shields.io/badge/Join_Support_Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/codexdev)
[![Hosting](https://img.shields.io/badge/Bot_Hosting-NexioHost-FF6B6B?style=for-the-badge)](https://nexiohost.in)

</div>

---

## ✦ License

```
MIT License — Copyright (c) 2026 CodeX Devs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

<div align="center">

---

*ZyroX — Built for protection. Designed for style.*

</div>
