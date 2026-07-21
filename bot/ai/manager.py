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
Master AIManager Orchestrator
"""

from __future__ import annotations
import logging
from typing import Dict, List, Any, Optional
from ai.models import ModelRegistry, ModelDefinition
from ai.features import FeatureRegistry, FeatureDefinition
from ai.failover import FailoverEngine
from ai.providers.base import BaseProvider, AIRequest, AIResponse
from ai.providers.builtins import get_provider_class

logger = logging.getLogger("ai.manager")


class AIManager:
    """Enterprise AI Management Orchestrator for Discord Bot & Dashboard."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.models = ModelRegistry()
        self.features = FeatureRegistry()
        
        failover_cfg = self.config.get("failover", {})
        self.failover = FailoverEngine(failover_cfg)
        
        self.providers: Dict[str, BaseProvider] = {}
        self._initialize_providers()

    def _initialize_providers(self) -> None:
        """Instantiate configured providers."""
        raw_providers = self.config.get("providers", [
            {"id": "p1", "name": "Google Gemini Production", "provider_type": "gemini", "default_model": "gemini-2.5-flash"},
            {"id": "p2", "name": "Anthropic Claude Premium", "provider_type": "anthropic", "default_model": "claude-3-5-sonnet-20241022"},
            {"id": "p3", "name": "OpenAI GPT-5 Core", "provider_type": "openai", "default_model": "gpt-4o"},
            {"id": "p4", "name": "Groq Ultra Fast", "provider_type": "groq", "default_model": "llama-3.3-70b-versatile"},
        ])
        for p_cfg in raw_providers:
            pid = p_cfg.get("id")
            ptype = p_cfg.get("provider_type", "custom")
            cls = get_provider_class(ptype)
            self.providers[pid] = cls(p_cfg)

    async def execute_feature(self, feature_key: str, messages: List[Dict[str, str]], **kwargs) -> AIResponse:
        """
        Execute an AI task for a specific system feature key (e.g. 'chat_ai', 'moderation_ai').
        Finds the mapped model, primary provider, and dispatches via failover engine.
        """
        feature = self.features.get(feature_key)
        if not feature or not feature.enabled:
            raise ValueError(f"Feature '{feature_key}' is disabled or not configured.")

        # Determine target model definition
        model_def = self.models.get(feature.assigned_model_id) or self.models.get(feature.fallback_model_id)
        if not model_def:
            raise ValueError(f"No model registered for feature '{feature_key}'")

        primary_provider_id = model_def.provider_id

        async def dispatch(provider_id: str) -> AIResponse:
            provider = self.providers.get(provider_id)
            if not provider:
                # Instantiate on demand if needed
                provider_cls = get_provider_class("custom")
                provider = provider_cls({"id": provider_id, "name": provider_id})
                self.providers[provider_id] = provider

            req = AIRequest(
                messages=messages,
                model=model_def.model_name,
                temperature=model_def.temperature,
                max_tokens=model_def.max_output_tokens,
                top_p=model_def.top_p,
                frequency_penalty=model_def.frequency_penalty,
                presence_penalty=model_def.presence_penalty,
                system_prompt=kwargs.get("system_prompt") or feature.custom_system_prompt,
                images=kwargs.get("images")
            )

            res = await provider.chat(req)
            # Compute cost & record stats
            res.cost = model_def.calculate_cost(res.usage.get("prompt_tokens", 0), res.usage.get("completion_tokens", 0))
            self.failover.record_cost(res.cost)
            return res

        return await self.failover.execute_with_failover(dispatch, primary_provider_id)
