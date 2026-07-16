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

"""
HTTPS Tunnel for the ZyroX API using pyngrok.

pyngrok is a pure Python package that automatically downloads the ngrok binary
on first run — no system installs, works on Pterodactyl out of the box.

With a free ngrok account + a reserved static domain you get the SAME URL on
every restart (free tier gives you 1 static domain).

──────────────────────────────────────────────────────────────────────────────
One-time setup (do this once)
──────────────────────────────────────────────────────────────────────────────
1. Sign up for a free account at https://ngrok.com
2. Copy your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Reserve a free static domain at https://dashboard.ngrok.com/domains
   (looks like: xxxx-xxxx-xxxx.ngrok-free.app)
4. Add these two vars to your .env:
       NGROK_AUTHTOKEN  = your_token_here
       NGROK_DOMAIN     = xxxx-xxxx-xxxx.ngrok-free.app
5. Set TUNNEL_ENABLED = "true"

That's it — pyngrok handles the binary download automatically on first start.
──────────────────────────────────────────────────────────────────────────────
"""

import os
import time
import threading

# ── env vars ──────────────────────────────────────────────────────────────────
TUNNEL_ENABLED  = os.getenv("TUNNEL_ENABLED", "true").strip().lower() == "true"
NGROK_AUTHTOKEN = os.getenv("NGROK_AUTHTOKEN", "").strip()
NGROK_DOMAIN    = os.getenv("NGROK_DOMAIN", "").strip()   # e.g. xxxx.ngrok-free.app
API_PORT        = int(os.getenv("API_PORT", "8000"))

# ── colours ───────────────────────────────────────────────────────────────────
_CYAN   = "\033[36m"
_GREEN  = "\033[32m"
_YELLOW = "\033[33m"
_RED    = "\033[31m"
_RESET  = "\033[0m"


def _run_ngrok(port: int, domain: str) -> None:
    """
    Blocking loop: opens an ngrok tunnel and keeps it alive.
    Restarts automatically if the connection drops.
    """
    try:
        from pyngrok import ngrok, conf, exception as ngrok_exc
    except ImportError:
        print(
            f"{_RED}◈ Tunnel: pyngrok is not installed.\n"
            f"  Run: pip install pyngrok{_RESET}"
        )
        return

    # Set the authtoken (pyngrok persists it for future runs)
    if NGROK_AUTHTOKEN:
        conf.get_default().auth_token = NGROK_AUTHTOKEN

    while True:
        tunnel = None
        try:
            options = {"addr": port, "proto": "http"}
            if domain:
                options["hostname"] = domain  # use reserved static domain

            # NOTE: request_header_add is NOT supported via the pyngrok API.
            # Instead the FastAPI middleware injects the ngrok-skip-browser-warning
            # header on every response, which achieves the same result.

            tunnel = ngrok.connect(**options)
            public_url = tunnel.public_url.replace("http://", "https://")

            print(f"{_GREEN}◈ Tunnel: API is live at  {public_url}{_RESET}")
            print(f"{_CYAN}  ↳ set NEXT_PUBLIC_API_URL={public_url}/api/v1 in your dashboard .env{_RESET}")

            # Block until the tunnel process exits
            ngrok.get_ngrok_process().proc.wait()

        except ngrok_exc.PyngrokNgrokHTTPError as e:
            # Catches auth errors (401) and other ngrok HTTP-level errors
            msg = str(e).lower()
            if "401" in msg or "auth" in msg or "token" in msg:
                print(
                    f"{_RED}◈ Tunnel: invalid NGROK_AUTHTOKEN.\n"
                    f"  Get your token from https://dashboard.ngrok.com/get-started/your-authtoken{_RESET}"
                )
                return  # no point retrying with a bad token
            print(f"{_RED}◈ Tunnel: ngrok HTTP error — {e}{_RESET}")

        except ngrok_exc.PyngrokNgrokError as e:
            print(f"{_RED}◈ Tunnel: ngrok error — {e}{_RESET}")

        except Exception as e:
            print(f"{_RED}◈ Tunnel: unexpected error — {e}{_RESET}")

        finally:
            # Clean up before retrying
            try:
                if tunnel:
                    ngrok.disconnect(tunnel.public_url)
            except Exception:
                pass
            try:
                ngrok.kill()
            except Exception:
                pass

        print(f"{_YELLOW}◈ Tunnel: connection lost, restarting in 5 s…{_RESET}")
        time.sleep(5)


def start_tunnel() -> None:
    """
    Start the ngrok HTTPS tunnel in a background daemon thread.
    Called from CodeX.py after keep_alive().
    """
    if not TUNNEL_ENABLED:
        print(f"{_YELLOW}◈ Tunnel: disabled via TUNNEL_ENABLED=false{_RESET}")
        return

    if not NGROK_AUTHTOKEN:
        print(
            f"{_YELLOW}◈ Tunnel: NGROK_AUTHTOKEN is not set — tunnel skipped.\n"
            f"  Get your token from https://dashboard.ngrok.com/get-started/your-authtoken{_RESET}"
        )
        return

    if not NGROK_DOMAIN:
        print(
            f"{_YELLOW}◈ Tunnel: NGROK_DOMAIN is not set — a random URL will be used (changes each restart).\n"
            f"  Reserve a free static domain at https://dashboard.ngrok.com/domains{_RESET}"
        )

    print(f"{_CYAN}◈ Tunnel: starting ngrok tunnel on port {API_PORT}…{_RESET}")
    t = threading.Thread(target=_run_ngrok, args=(API_PORT, NGROK_DOMAIN), daemon=True)
    t.start()
