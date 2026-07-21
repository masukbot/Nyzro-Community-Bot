# ╔══════════════════════════════════════════════════════════════════╗
# ║                                                                  ║
# ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
# ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
# ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
# ║                                                                  ║
# ║            © 2026 CodeX Devs — All Rights Reserved               ║
# ║                                                                  ║
# ║   discord  ──  https://discord.gg/codexdev                      ║
# ║   youtube  ──  https://youtube.com/@CodeXDevs                   ║
# ║   github   ──  https://github.com/RayExo                        ║
# ║                                                                  ║
# ╚══════════════════════════════════════════════════════════════════╝

"""
AI Failover Engine & Budget Controller
"""

from __future__ import annotations
import asyncio
import logging
from typing import Dict, List, Any, Optional, Callable

logger = logging.getLogger("ai.failover")


class FailoverEngine:
    """Handles multi-provider failover routing, retry logic, and budget monitoring."""

    def __init__(self, config: Dict[str, Any]):
        self.enabled = config.get("enabled", True)
        self.priority_chain: List[str] = config.get("provider_priority", [])
        self.max_retries = config.get("max_retries", 3)
        self.load_balancing_mode = config.get("load_balancing_mode", "priority")
        self.budget_cap_daily = config.get("budget_cap_daily", 15.00)
        self.budget_cap_monthly = config.get("budget_cap_monthly", 100.00)
        self.auto_fallback_budget = config.get("auto_fallback_on_budget_exceeded", True)
        
        self.current_daily_cost = 0.0
        self.current_monthly_cost = 0.0
        self.provider_health: Dict[str, str] = {}  # provider_id -> status ('online', 'degraded', 'offline')

    def record_cost(self, cost: float) -> None:
        """Add cost to budget tracking."""
        self.current_daily_cost += cost
        self.current_monthly_cost += cost

    def is_budget_exceeded(self) -> bool:
        """Check if daily or monthly budget cap has been reached."""
        return (
            self.current_daily_cost >= self.budget_cap_daily or
            self.current_monthly_cost >= self.budget_cap_monthly
        )

    def mark_provider_status(self, provider_id: str, status: str) -> None:
        """Update provider health state."""
        self.provider_health[provider_id] = status

    async def execute_with_failover(self, dispatch_fn: Callable[[str], Any], primary_provider_id: str) -> Any:
        """
        Execute request with primary provider; fall back through priority chain on failure or budget excess.
        """
        candidate_providers = [primary_provider_id] + [p for p in self.priority_chain if p != primary_provider_id]

        if self.is_budget_exceeded() and self.auto_fallback_budget:
            logger.warning("Budget threshold exceeded. Routing to zero-cost / fallback provider.")
            # Move zero cost or local providers (e.g. Ollama) to front if available
            candidate_providers.sort(key=lambda p: 0 if p == "p7" else 1)

        last_error = None
        for attempt, provider_id in enumerate(candidate_providers):
            if self.provider_health.get(provider_id) == "offline" and attempt > 0:
                continue

            for retry in range(self.max_retries):
                try:
                    res = await dispatch_fn(provider_id)
                    self.mark_provider_status(provider_id, "online")
                    return res
                except Exception as e:
                    last_error = e
                    logger.warning(f"Attempt {retry + 1} for provider '{provider_id}' failed: {e}")
                    await asyncio.sleep(0.2 * (2 ** retry))  # Exponential backoff

            self.mark_provider_status(provider_id, "degraded")

        raise RuntimeError(f"All failover provider attempts failed. Last error: {last_error}")
