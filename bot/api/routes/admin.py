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

from fastapi import APIRouter, Depends, HTTPException
from api.dependencies import get_bot
from api.schemas import AdminStats, AdminNodeStatus, AdminConfig, AdminConfigUpdate, AuthToken, AuthTokenCreate
from typing import TYPE_CHECKING, List
import os
import json
import secrets
import time
import aiosqlite

if TYPE_CHECKING:
    from core.nyzro import nyzro

router = APIRouter()

CONFIG_DB = "db/admin_config.db"

async def init_db():
    async with aiosqlite.connect(CONFIG_DB) as db:
        await db.execute("CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)")
        # Default values
        await db.execute("INSERT OR IGNORE INTO config (key, value) VALUES ('maintenance_mode', 'false')")
        await db.execute("INSERT OR IGNORE INTO config (key, value) VALUES ('global_notification', '')")
        await db.commit()

import psutil
import time

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(bot: "nyzro" = Depends(get_bot)):
    # Calculate DB size and shard info
    total_size: float = 0.0
    db_count = 0
    db_dir = "db"
    if os.path.exists(db_dir):
        for f in os.listdir(db_dir):
            if f.endswith(".db"):
                total_size += float(os.path.getsize(os.path.join(db_dir, f)))
                db_count += 1
    
    mb_size = total_size / (1024 * 1024)
    db_size_str = f"{mb_size:.2f} MB"
    if mb_size > 1024:
        db_size_str = f"{(mb_size / 1024):.2f} GB"

    # System Metrics
    process = psutil.Process(os.getpid())
    # Use a non-blocking interval check or global state for CPU
    cpu_usage = psutil.cpu_percent() 
    ram_raw = process.memory_info().rss
    ram_mb = ram_raw / (1024 * 1024)
    
    total_commands = len(bot.commands)
    loaded_cogs = len(bot.cogs or {})

    # Node Healths
    nodes = [
        AdminNodeStatus(
            name="Primary API Cluster", 
            status="Healthy", 
            load=f"CPU: {cpu_usage}% | RAM: {ram_mb:.1f}MB", 
            icon="Globe"
        ),
        AdminNodeStatus(
            name="Database Shards", 
            status="Healthy" if db_count > 0 else "Warning", 
            load=f"{db_count} SQLite DBs | {db_size_str}", 
            icon="Database"
        ),
        AdminNodeStatus(
            name="Bot Microservices", 
            status="Healthy" if bot.is_ready() else "Booting", 
            load=f"{loaded_cogs} Modules", 
            icon="Cpu"
        ),
        AdminNodeStatus(
            name="Auth Sockets", 
            status="Healthy", 
            load=f"Shard: {bot.shard_count} | Latency: {round(bot.latency * 1000)}ms", 
            icon="Lock"
        )
    ]

    total_members = sum(g.member_count or 0 for g in bot.guilds)

    return AdminStats(
        total_users=str(total_members),
        active_servers=str(len(bot.guilds)),
        api_latency=f"{round(bot.latency * 1000, 2)}ms",
        db_size=db_size_str,
        nodes=nodes
    )

@router.get("/config", response_model=AdminConfig)
async def get_admin_config():
    await init_db()
    async with aiosqlite.connect(CONFIG_DB) as db:
        async with db.execute("SELECT value FROM config WHERE key = 'maintenance_mode'") as cursor:
            mm = await cursor.fetchone()
        async with db.execute("SELECT value FROM config WHERE key = 'global_notification'") as cursor:
            gn = await cursor.fetchone()
            
    return AdminConfig(
        maintenance_mode=mm[0].lower() == 'true' if mm else False,
        global_notification=gn[0] if gn else None
    )

@router.patch("/config")
async def patch_admin_config(data: AdminConfigUpdate):
    await init_db()
    async with aiosqlite.connect(CONFIG_DB) as db:
        if data.maintenance_mode is not None:
            await db.execute("UPDATE config SET value = ? WHERE key = 'maintenance_mode'", (str(data.maintenance_mode).lower(),))
        if data.global_notification is not None:
            await db.execute("UPDATE config SET value = ? WHERE key = 'global_notification'", (data.global_notification,))
        await db.commit()
    return {"status": "success"}


# ========== AUTH TOKENS (Third-party app access) ==========

AUTH_TOKENS_FILE = "jsondb/auth_tokens.json"

def _load_tokens() -> dict:
    os.makedirs("jsondb", exist_ok=True)
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
    with open(AUTH_TOKENS_FILE, "w") as f:
        json.dump(data, f, indent=2)

@router.get("/tokens", response_model=List[AuthToken], summary="List all auth tokens")
async def list_auth_tokens():
    """List all third-party auth tokens. Only the token metadata is shown, not the actual secret."""
    tokens = _load_tokens()
    return [
        AuthToken(
            token=t["token"][:12] + "..." + t["token"][-4:],  # Masked for display
            name=t["name"],
            created_at=t["created_at"],
            last_used=t.get("last_used"),
            scopes=t.get("scopes", [])
        )
        for t in tokens.values()
    ]

@router.post("/tokens", response_model=AuthToken, summary="Create a new auth token")
async def create_auth_token(data: AuthTokenCreate):
    """Create a new auth token for third-party apps to access the API."""
    tokens = _load_tokens()
    
    # Generate a secure random token
    raw_token = secrets.token_urlsafe(32)
    token_id = secrets.token_hex(8)
    
    token_data = {
        "token": raw_token,
        "name": data.name,
        "created_at": time.strftime('%Y-%m-%dT%H:%M:%S'),
        "last_used": None,
        "scopes": data.scopes
    }
    
    tokens[token_id] = token_data
    _save_tokens(tokens)
    
    # Return the full token ONCE on creation, so the user can copy it
    return AuthToken(
        token=raw_token,
        name=data.name,
        created_at=token_data["created_at"],
        last_used=None,
        scopes=data.scopes
    )

@router.delete("/tokens/{token_id}", summary="Delete an auth token")
async def delete_auth_token(token_id: str):
    """Delete a third-party auth token by its ID."""
    tokens = _load_tokens()
    if token_id not in tokens:
        raise HTTPException(status_code=404, detail="Token not found")
    del tokens[token_id]
    _save_tokens(tokens)
    return {"status": "success"}
