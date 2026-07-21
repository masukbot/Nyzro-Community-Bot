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

import os
import json
import time
from typing import Optional, TYPE_CHECKING
from fastapi import HTTPException, Depends, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from slowapi import Limiter
from slowapi.util import get_remote_address

if TYPE_CHECKING:
    from core.nyzro import nyzro

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["1000 per minute"])

# Global reference to the bot instance
_bot_instance: Optional["nyzro"] = None

# Security scheme
security = HTTPBearer()

AUTH_TOKENS_FILE = "jsondb/auth_tokens.json"

def _load_tokens() -> dict:
    """Load third-party auth tokens from disk."""
    if os.path.exists(AUTH_TOKENS_FILE):
        try:
            with open(AUTH_TOKENS_FILE, "r") as f:
                content = f.read().strip()
                if content:
                    data = json.loads(content)
                    if isinstance(data, dict):
                        return data
        except (json.JSONDecodeError, Exception):
            pass
    return {}

def _save_tokens(data: dict):
    """Save third-party auth tokens to disk."""
    os.makedirs("jsondb", exist_ok=True)
    with open(AUTH_TOKENS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def verify_api_key(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Dependency to verify the API key from the Authorization header.
    Accepts either the primary DASHBOARD_API_KEY or a third-party auth token.
    Expected: Authorization: Bearer <API_KEY|TOKEN>
    """
    api_key = os.getenv("DASHBOARD_API_KEY")
    presented = credentials.credentials
    
    # 1. Check primary dashboard API key
    if api_key and presented == api_key:
        return presented
    
    # 2. Check third-party auth tokens
    tokens = _load_tokens()
    for token_id, token_data in tokens.items():
        if token_data.get("token") == presented:
            # Update last_used timestamp (best-effort, no exception if fails)
            try:
                token_data["last_used"] = time.strftime('%Y-%m-%dT%H:%M:%S')
                tokens[token_id] = token_data
                _save_tokens(tokens)
            except Exception:
                pass
            return presented
    
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="DASHBOARD_API_KEY environment variable is not set."
        )

    raise HTTPException(
        status_code=401,
        detail="Invalid or missing API key."
    )

def set_bot(bot_instance: "nyzro"):
    """
    Sets the global bot instance. 
    This should be called in CodeX.py during startup.
    """
    global _bot_instance
    _bot_instance = bot_instance

def get_bot() -> "nyzro":
    """
    FastAPI dependency to retrieve the Discord bot instance.
    Usage: bot: nyzro = Depends(get_bot)
    """
    if _bot_instance is None:
        raise HTTPException(
            status_code=503, 
            detail="Discord bot instance is not initialized yet."
        )
    return _bot_instance
