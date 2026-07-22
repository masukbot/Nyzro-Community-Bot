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
Master AIManager Orchestrator — dynamically loads per-guild AI config.
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
        self._guild_id: Optional[int] = None

    def load_from_guild_config(self, guild_id: int, data: Dict[str, Any]) -> None:
        """
        Dynamically load per-guild AI configuration from dashboard-saved data.
        Replaces all default providers/models/features with guild-specific ones.
        """
        self._guild_id = guild_id
        self.providers.clear()

        # Load providers from guild config
        raw_providers = data.get("providers") or data.get("provider_profiles", [])
        for p_cfg in raw_providers:
            pid = p_cfg.get("id")
            if not pid:
                continue
            ptype = p_cfg.get("provider_type", "custom")
            cls = get_provider_class(ptype)
            try:
                self.providers[pid] = cls(p_cfg)
            except Exception as e:
                logger.error(f"Failed to load provider '{pid}': {e}")

        # Register models from guild config
        raw_models = data.get("models") or data.get("model_definitions", [])
        for m_cfg in raw_models:
            mid = m_cfg.get("id") or m_cfg.get("model_id")
            if not mid:
                continue
            try:
                m = ModelDefinition(
                    model_id=mid,
                    model_name=m_cfg.get("model_name", ""),
                    provider_id=m_cfg.get("provider_id", ""),
                    description=m_cfg.get("description", ""),
                    context_window=m_cfg.get("context_window", 128000),
                    max_output_tokens=m_cfg.get("max_output_tokens", 4096),
                    temperature=m_cfg.get("temperature", 0.7),
                    supports_vision=m_cfg.get("supports_vision", False),
                    input_cost_per_1m=m_cfg.get("input_cost_per_1m", 0.0),
                    output_cost_per_1m=m_cfg.get("output_cost_per_1m", 0.0),
                )
                self.models.register(m)
            except Exception as e:
                logger.error(f"Failed to register model '{mid}': {e}")

        # Apply feature assignments from guild config
        raw_assignments = data.get("feature_assignments", [])
        for fa in raw_assignments:
            fkey = fa.get("feature_key")
            if not fkey:
                continue
            self.features.update_assignment(
                feature_key=fkey,
                primary_model_id=fa.get("assigned_model_id", ""),
                fallback_model_id=fa.get("fallback_model_id", ""),
                enabled=fa.get("enabled", False)
            )

        # Load failover config
        failover_cfg = data.get("failover") or data.get("failover_config", {})
        self.failover = FailoverEngine(failover_cfg)

        logger.info(f"Loaded AI config for guild {guild_id}: {len(self.providers)} providers, {len(self.models.list_all())} models")

    async def execute_feature(
        self,
        feature_key: str,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AIResponse:
        """
        Execute an AI task for a specific system feature key (e.g. 'chat_ai', 'moderation_ai').
        Finds the mapped model, primary provider, and dispatches via failover engine.

        kwargs:
            system_prompt: override the default system prompt
            model_override: override the model for this request
            temperature: override temperature
            max_tokens: override max tokens
        """
        feature = self.features.get(feature_key)
        if not feature or not feature.enabled:
            raise ValueError(f"Feature '{feature_key}' is disabled or not configured.")

        # Determine target model — allow runtime override
        model_id = kwargs.get("model_override") or feature.assigned_model_id
        model_def = self.models.get(model_id) or self.models.get(feature.fallback_model_id)
        if not model_def:
            raise ValueError(f"No model registered for feature '{feature_key}'")

        primary_provider_id = model_def.provider_id
        system_prompt = kwargs.get("system_prompt") or feature.custom_system_prompt
        temperature = kwargs.get("temperature") or model_def.temperature
        max_tokens = kwargs.get("max_tokens") or model_def.max_output_tokens

        async def dispatch(provider_id: str) -> AIResponse:
            provider = self.providers.get(provider_id)
            if not provider:
                raise ValueError(f"Provider '{provider_id}' not configured for this guild")

            req = AIRequest(
                messages=messages,
                model=model_def.model_name,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=model_def.top_p,
                frequency_penalty=model_def.frequency_penalty,
                presence_penalty=model_def.presence_penalty,
                system_prompt=system_prompt,
                images=kwargs.get("images")
            )

            res = await provider.chat(req)
            res.cost = model_def.calculate_cost(
                res.usage.get("prompt_tokens", 0),
                res.usage.get("completion_tokens", 0)
            )
            self.failover.record_cost(res.cost)
            return res

        return await self.failover.execute_with_failover(dispatch, primary_provider_id)

    async def close(self):
        """Close all provider sessions."""
        for pid, provider in self.providers.items():
            try:
                await provider.close()
            except Exception as e:
                logger.warning(f"Error closing provider '{pid}': {e}")
