# ZyroX With Dashboard

A Discord bot project with a Next.js dashboard for managing bot features and server settings.

## Project Structure

- bot/ - Python Discord bot
- dashboard/ - Next.js frontend dashboard
- bot/api/ - FastAPI backend endpoints used by the dashboard

## 1) Bot Setup

### Requirements

- Python 3.10+
- pip
- A Discord bot token from the Discord Developer Portal

### Install dependencies

```bash
cd bot
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

### Configure environment

Create a `.env` file inside the `bot/` folder with at least:

```env
TOKEN=your_discord_bot_token
```

You may also need to update values in:

- `bot/config.yml`
- `bot/api` configuration if you are using the API backend

### Run the bot

```bash
cd bot
python CodeX.py
```

If you want to run the API backend separately, use:

```bash
cd bot/api
uvicorn server:app --host 0.0.0.0 --port 8000
```

> The dashboard expects a reachable API base URL, so the bot API should be hosted somewhere public if you plan to use it outside localhost.

## 2) Dashboard Setup

### Requirements

- Node.js 18+
- npm

### Install dependencies

```bash
cd dashboard
npm install
cp .env.example .env.local
```

### Configure environment

Edit `dashboard/.env.local` and update the values:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change_this_to_a_long_random_string
DISCORD_CLIENT_ID=your_discord_oauth_client_id
DISCORD_CLIENT_SECRET=your_discord_oauth_client_secret
NEXT_PUBLIC_DASHBOARD_API_KEY=ZYROX_SECURE_API_KEY_12345
NEXT_PUBLIC_BRAND_NAME="Zyrox X"
NEXT_PUBLIC_BRAND_NAME_WORD="ZX"
```

### Run locally

```bash
cd dashboard
npm run dev
```

Open http://localhost:3000

## 3) Deploy the Bot and Dashboard

The first step is to upload the full bot folder to your hosting provider, and then upload the dashboard folder directly to Vercel.

### Bot hosting

1. Upload the entire `bot/` folder and all of its files to your Python hosting provider.
2. Make sure the app starts with the bot entry file, such as `bot/CodeX.py`.
3. Set the required environment variables on your host.
4. Keep the bot API reachable at a public URL if the dashboard needs to call it.
5. You can also use https://nexiohost.in for bot hosting; it offers free and paid plans.

### Dashboard deployment to Vercel

1. Push the dashboard folder to GitHub as its own project, or import it directly in Vercel.
2. Open Vercel and click New Project.
3. Import the dashboard repository or folder.
4. Set the project root to the `dashboard/` folder.
5. Use these build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add the required environment variables in Vercel:
   - `NEXT_PUBLIC_API_URL`
   - `NEXTAUTH_URL` (set to `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `NEXT_PUBLIC_DASHBOARD_API_KEY`
   - `NEXT_PUBLIC_BRAND_NAME`
   - `NEXT_PUBLIC_BRAND_NAME_WORD`
7. Deploy the project.

### Important Notes

- `NEXTAUTH_URL` must point to your Vercel domain.
- Discord OAuth redirect URIs must include your Vercel URL, for example:
  - `https://your-app.vercel.app/api/auth/callback/discord`
- If the dashboard uses the bot API, that API must be publicly reachable from Vercel.

## 4) Recommended Hosting for the Bot API

If you want the dashboard to talk to the bot API in production, host the API on a service such as:

- Render
- Railway
- Fly.io
- VPS / Ubuntu server

Then set `NEXT_PUBLIC_API_URL` to that public API URL.

## 5) Key Rules and Important Points

- Keep your bot token private and never share it publicly.
- Use a strong `NEXTAUTH_SECRET` and rotate it if it is exposed.
- Only use Discord OAuth credentials from a trusted app you control.
- Make sure your bot has the required permissions before inviting it to servers.
- The dashboard should only be exposed through a trusted domain and HTTPS.
- If the bot API is public, protect it with authentication or a secure secret key.
- Never upload real tokens, secrets, or private keys to GitHub or public forums.
- Always test the bot and dashboard in a staging environment before using them in production.
- Respect Discord ToS and platform rules when running moderation or automation features.
- If you use third-party hosting, verify that the provider allows bot processes and long-running services.

## 6) Credits

- Developed by CodeX Devs
- Community: https://discord.gg/codexdev
- Hosting partner: https://nexiohost.in

## 7) License

This project is licensed under the MIT License.

Copyright (c) 2026 CodeX Devs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 8) Troubleshooting

- If the dashboard shows authentication issues, verify your Discord OAuth credentials and redirect URIs.
- If the dashboard cannot load data, confirm that the API backend is running and reachable.
- If the bot fails to start, confirm the bot token and required Python packages are installed.
