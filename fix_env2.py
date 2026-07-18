import os, re, glob

# Find .env regardless of hidden file quirks
candidates = glob.glob(r'C:\Users\Jatin\Desktop\ZyroX-CV2-With-Dashboard\bot\*')
env_path = None
for c in candidates:
    if os.path.basename(c) == '.env':
        env_path = c
        break

if not env_path:
    print("ERROR: .env not found, candidates:", candidates[:10])
    exit(1)

with open(env_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Strip old ngrok / tunnel block
content = re.sub(r'\n# HTTPS TUNNEL CONFIG.*?NGROK_DOMAIN=""\n', '', content, flags=re.DOTALL)
content = re.sub(r'\nTUNNEL_ENABLED=.*', '', content)
content = re.sub(r'\nNGROK_AUTHTOKEN=.*', '', content)
content = re.sub(r'\nNGROK_DOMAIN=.*', '', content)
# Strip any blank lines at the very end
content = content.rstrip()

content += '''

# ── CLOUDFLARE TUNNEL CONFIG ──────────────────────────────────────────────────
# pycloudflared auto-downloads the cloudflared binary — no system install needed
# Unlimited bandwidth & requests, permanent URL — far better than ngrok free tier
#
# Named tunnel setup (one-time, on your local machine):
#   1. cloudflared tunnel login
#   2. cloudflared tunnel create zyrox-api
#   3. cloudflared tunnel route dns zyrox-api api.yourdomain.com
#   4. Copy contents of ~/.cloudflared/<uuid>.json → paste into CF_TUNNEL_CREDENTIALS
#
TUNNEL_ENABLED="true"
CF_TUNNEL_NAME=""
CF_TUNNEL_URL=""
CF_TUNNEL_CREDENTIALS=""
'''

with open(env_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"done — updated {env_path}")
