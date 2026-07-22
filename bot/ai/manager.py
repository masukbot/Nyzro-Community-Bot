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
import json
import logging
from typing import Dict, List, Any, Optional
from ai.models import ModelRegistry, ModelDefinition
from ai.features import FeatureRegistry, FeatureDefinition
from ai.failover import FailoverEngine
from ai.providers.base import BaseProvider, AIRequest, AIResponse
from ai.providers.builtins import get_provider_class

logger = logging.getLogger("ai.manager")

# ── Feature-specific system prompts ──────────────────────────────────────────
FEATURE_SYSTEM_PROMPTS: Dict[str, str] = {
    "moderation_ai": (
        "You are a content moderation AI. Analyze the user message for: "
        "hate speech, harassment, toxicity, NSFW content, threats, and spam. "
        "Respond ONLY in valid JSON format with no markdown or extra text:\n"
        '{"flagged": true/false, "categories": ["hate","harassment","toxic","nsfw","threat","spam"], '
        '"severity": "none"|"low"|"medium"|"high"|"critical", "reason": "brief reason"}'
    ),
    "auto_moderation": (
        "You are a fast auto-moderation AI. Evaluate the message for rule violations. "
        "Respond ONLY in valid JSON:\n"
        '{"action": "allow"|"warn"|"delete"|"timeout", "confidence": 0-100, "reason": "brief reason"}'
    ),
    "message_classification": (
        "You are a message classifier. Categorize the user message into one of: "
        "support, spam, chat, feedback, report, other. "
        "Respond ONLY in valid JSON:\n"
        '{"category": "support"|"spam"|"chat"|"feedback"|"report"|"other", "confidence": 0-100, "summary": "brief"}'
    ),
    "spam_detection": (
        "You are a spam detection AI. Check if the message is spam, mass mention, "
        "repetitive content, or advertisement. Respond ONLY in valid JSON:\n"
        '{"is_spam": true/false, "type": "mass_mention"|"repetitive"|"ad"|"phishing"|"none", '
        '"confidence": 0-100, "reason": "brief explanation"}'
    ),
    "toxicity_detection": (
        "You are a toxicity analyzer. Evaluate the message for hostility, profanity, "
        "and harassment. Respond ONLY in valid JSON:\n"
        '{"is_toxic": true/false, "toxicity_score": 0-100, '
        '"categories": ["profanity","threat","harassment","hostility"], '
        '"reason": "brief explanation"}'
    ),
    "scam_image_detection": (
        "You are a security AI specialized in scanning images for scams. "
        "Analyze the image for: QR code scams, fake nitro giveaways, fake gift cards, "
        "phishing attempts, and fraudulent content. "
        "Respond ONLY in valid JSON:\n"
        '{"is_flagged": true/false, "category": "Clean"|"QR_Scam"|"Fake_Nitro"|"Fake_GiftCard"|"Phishing"|"Other", '
        '"confidence": 0-100, "reason": "brief description of what was detected"}'
    ),
    "nsfw_detection": (
        "You are an NSFW content detector. Analyze the image for explicit adult content. "
        "Respond ONLY in valid JSON:\n"
        '{"is_nsfw": true/false, "nsfw_score": 0-100, "categories": ["sexual","gore","suggestive","none"], "reason": "brief"}'
    ),
    "image_captioning": (
        "You are an image captioning AI. Describe what you see in the image in detail. "
        "Be descriptive but concise. Focus on: objects, people, text, actions, scene."
    ),
    "ocr": (
        "You are an OCR (Optical Character Recognition) AI. Extract all text visible in the image. "
        "Preserve formatting where possible. If no text is found, say 'No text detected in this image.'"
    ),
    "translation": (
        "You are a professional translator. Translate the user's message to the target language. "
        "Respond with ONLY the translated text, no explanations or notes. "
        "If the text is already in the target language, respond with the original text."
    ),
    "summarization": (
        "You are a summarization AI. Provide a concise summary of the conversation or text. "
        "Focus on key points, decisions, and action items. Keep it under 200 words."
    ),
    "knowledge_assistant": (
        "You are a knowledgeable assistant for a Discord community server. "
        "Answer questions based on general knowledge and common server setups. "
        "Be helpful, accurate, and concise."
    ),
}


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
        raw_providers = data.get("providers")
        if raw_providers is None:
            raw_providers = data.get("provider_profiles", [])
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
        raw_models = data.get("models")
        if raw_models is None:
            raw_models = data.get("model_definitions", [])
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

    async def execute_feature_typed(
        self,
        feature_key: str,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> AIResponse:
        """
        Execute a feature with the correct system prompt based on its category.
        Automatically sets the right system prompt for moderation/vision/utility features.
        """
        feature = self.features.get(feature_key)
        if not feature:
            raise ValueError(f"Feature '{feature_key}' not found")

        if not kwargs.get("system_prompt") and feature_key in FEATURE_SYSTEM_PROMPTS:
            kwargs["system_prompt"] = FEATURE_SYSTEM_PROMPTS[feature_key]

        return await self.execute_feature(feature_key, messages, **kwargs)

    async def execute_moderation(
        self,
        text: str,
        feature_key: str = "moderation_ai",
    ) -> Dict[str, Any]:
        """
        Execute content moderation on text. Returns structured JSON result.
        Falls back to safe defaults if parsing fails.
        """
        messages = [{"role": "user", "content": f"Analyze this message: {text[:2000]}"}]
        try:
            response = await self.execute_feature_typed(feature_key, messages)
            parsed = json.loads(response.content.strip().strip("```json").strip("```").strip())
            return parsed
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Moderation JSON parse failed for {feature_key}: {e}")
            return {
                "flagged": False,
                "action": "allow",
                "is_spam": False,
                "is_toxic": False,
                "category": "unknown",
                "confidence": 0,
                "severity": "none",
                "reason": "Could not parse AI response"
            }

    async def execute_vision_scan(
        self,
        images: List[bytes],
        prompt: str = "",
        feature_key: str = "scam_image_detection",
    ) -> Dict[str, Any]:
        """
        Execute vision/image scanning on attachments.
        Returns structured JSON or default safe result.
        """
        if not images:
            return {"is_flagged": False, "category": "Clean", "confidence": 100, "reason": "No images to scan"}

        feature = self.features.get(feature_key)
        model_def = None
        if feature:
            model_def = self.models.get(feature.assigned_model_id)

        user_content = prompt or "Analyze this image for security threats and policy violations."
        messages = [{"role": "user", "content": user_content}]

        try:
            response = await self.execute_feature_typed(
                feature_key, messages, images=images,
            )
            raw = response.content.strip().strip("```json").strip("```").strip()
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                return {"is_flagged": False, "category": "Clean", "confidence": 50, "analysis": raw[:500]}
        except Exception as e:
            logger.error(f"Vision scan failed for {feature_key}: {e}")
            return {"is_flagged": False, "category": "Clean", "confidence": 99, "reason": f"Scan error: {str(e)[:100]}"}

    async def execute_translation(
        self,
        text: str,
        target_language: str = "English",
        feature_key: str = "translation",
    ) -> str:
        """Execute translation of text to target language."""
        messages = [{"role": "user", "content": f"Translate this to {target_language}: {text[:2000]}"}]
        try:
            response = await self.execute_feature_typed(feature_key, messages)
            return response.content.strip()
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            return text

    async def execute_summarization(
        self,
        conversation: List[Dict[str, str]],
        feature_key: str = "summarization",
    ) -> str:
        """Execute summarization of conversation history."""
        messages = conversation[-10:] if len(conversation) > 10 else conversation
        try:
            response = await self.execute_feature_typed(feature_key, messages)
            return response.content.strip()
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            return "Could not generate summary."

    async def execute_classification(
        self,
        text: str,
        feature_key: str = "message_classification",
    ) -> Dict[str, Any]:
        """Classify a message into a category."""
        messages = [{"role": "user", "content": f"Classify this message: {text[:2000]}"}]
        try:
            response = await self.execute_feature_typed(feature_key, messages)
            return json.loads(response.content.strip().strip("```json").strip("```").strip())
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Classification parse failed: {e}")
            return {"category": "chat", "confidence": 0, "summary": ""}

    async def execute_knowledge_query(
        self,
        query: str,
        context: Optional[str] = None,
        feature_key: str = "knowledge_assistant",
    ) -> str:
        """Answer a knowledge query."""
        content = query[:2000]
        if context:
            content = f"Context: {context[:1000]}\n\nQuestion: {query[:1000]}"
        messages = [{"role": "user", "content": content}]
        try:
            response = await self.execute_feature_typed(feature_key, messages)
            return response.content.strip()
        except Exception as e:
            logger.error(f"Knowledge query failed: {e}")
            return "Sorry, I couldn't find an answer to that question."

    async def close(self):
        """Close all provider sessions."""
        for pid, provider in self.providers.items():
            try:
                await provider.close()
            except Exception as e:
                logger.warning(f"Error closing provider '{pid}': {e}")
