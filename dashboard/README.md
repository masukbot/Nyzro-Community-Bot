<div align="center">

```
███████╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗
╚══███╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚██╗██╔╝
  ███╔╝  ╚████╔╝ ██████╔╝██║   ██║ ╚███╔╝ 
 ███╔╝    ╚██╔╝  ██╔══██╗██║   ██║ ██╔██╗ 
███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

**ZyroX Dashboard — Next.js Web Interface**

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)
[![Support](https://img.shields.io/badge/Support-discord.gg/codexdev-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/codexdev)

</div>

---

## ✦ Overview

This folder contains the ZyroX web dashboard built with `Next.js 14` (App Router), `TypeScript`, and `Tailwind CSS`. It connects to the bot's FastAPI backend to let server admins manage all bot settings through a modern UI.

```
dashboard/
├── app/               App Router pages & API routes
│   ├── api/           Next.js API routes (auth callbacks, etc.)
│   ├── dashboard/     Per-server settings pages
│   ├── docs/          Documentation page
│   ├── privacy/       Privacy policy page
│   └── terms/         Terms of service page
├── components/
│   ├── dashboard/     Dashboard-specific UI components
│   └── ui/            Reusable base components
├── hooks/             Custom React hooks
├── lib/               API helpers, auth config, utilities
└── types/             TypeScript type definitions
```

---

## ✦ Features

- **Discord OAuth2 login** — secure sign-in with your Discord account
- **Per-server management** — configure antinuke, automod, leveling, and more per guild
- **Live bot stats** — view real-time data from the bot
- **Fully branded** — customisable name, logo, and colours via environment variables
- **Vercel-ready** — deploys in minutes with zero config changes

---

## ✦ Setup

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 or higher |
| ZyroX bot running | with `API_ENABLED=true` |
| Discord OAuth app | — |

### 1 — Install dependencies

```bash
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL           = http://localhost:8000/api/v1
NEXT_PUBLIC_DASHBOARD_API_KEY = your_shared_api_key   # must match bot's DASHBOARD_API_KEY

NEXTAUTH_URL    = http://localhost:3000
NEXTAUTH_SECRET = a_long_random_string

DISCORD_CLIENT_ID     = your_discord_oauth_client_id
DISCORD_CLIENT_SECRET = your_discord_oauth_client_secret

NEXT_PUBLIC_ADMIN_IDS       = your_discord_user_id
NEXT_PUBLIC_BRAND_NAME      = "ZyroX"
NEXT_PUBLIC_BRAND_NAME_WORD = "ZX"
```

### 3 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✦ Environment Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full URL to the bot's FastAPI backend |
| `NEXT_PUBLIC_DASHBOARD_API_KEY` | Must match `DASHBOARD_API_KEY` in the bot `.env` |
| `NEXTAUTH_URL` | Your dashboard's public URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session signing |
| `DISCORD_CLIENT_ID` | Discord OAuth2 client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 client secret |
| `NEXT_PUBLIC_ADMIN_IDS` | Comma-separated Discord user IDs with admin access |
| `NEXT_PUBLIC_BRAND_NAME` | Bot name shown in the dashboard UI |
| `NEXT_PUBLIC_BRAND_NAME_WORD` | Short abbreviation shown in the dashboard |

---

## ✦ Deployment (Vercel)

Vercel is the recommended host — the project is pre-configured for it.

**Step 1 — Upload to Vercel**

Go to [vercel.com](https://vercel.com) → **Add New Project** → connect your GitHub repo and set the root directory to `dashboard/`.

Vercel auto-detects Next.js — no build settings needed.

**Step 2 — Add environment variables**

In your Vercel project → **Settings → Environment Variables**, add all keys from `.env.example`.

| Variable | Example Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-bot.render.com/api/v1` |
| `NEXT_PUBLIC_DASHBOARD_API_KEY` | same value as bot's `DASHBOARD_API_KEY` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | [generate one here](https://generate-secret.vercel.app/32) |
| `DISCORD_CLIENT_ID` | from [Discord Developer Portal](https://discord.com/developers/applications) |
| `DISCORD_CLIENT_SECRET` | from Discord Developer Portal |
| `NEXT_PUBLIC_ADMIN_IDS` | your Discord user ID |

**Step 3 — Add redirect URI in Discord**

Go to your app in the [Discord Developer Portal](https://discord.com/developers/applications) → **OAuth2 → Redirects** → add:

```
https://your-app.vercel.app/api/auth/callback/discord
```

**Step 4 — Deploy**

Hit **Deploy**. Vercel builds and publishes automatically. ✓

---

## ✦ Troubleshooting

| Problem | Fix |
|---|---|
| Auth error on login | Check Discord OAuth client ID/secret and redirect URI in Developer Portal |
| Dashboard can't load data | Confirm the bot is running with `API_ENABLED=true` and `NEXT_PUBLIC_API_URL` is correct |
| `NEXTAUTH_SECRET` error | Make sure `NEXTAUTH_SECRET` is set and non-empty |
| API key mismatch | `NEXT_PUBLIC_DASHBOARD_API_KEY` must exactly match `DASHBOARD_API_KEY` in the bot |

---

<div align="center">

Developed with ❤️ by **CodeX Devs**

[![Discord](https://img.shields.io/badge/Join_Support_Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/codexdev)
[![Hosting](https://img.shields.io/badge/Bot_Hosting-NexioHost-FF6B6B?style=for-the-badge)](https://nexiohost.in)

*ZyroX — Built for protection. Designed for style.*

</div>
