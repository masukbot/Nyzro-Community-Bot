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
AI Feature Assignment Registry
"""

from __future__ import annotations
from typing import Dict, List, Optional
from dataclasses import dataclass, field


@dataclass
class FeatureDefinition:
    """Definition of an AI-powered system capability."""
    feature_key: str
    feature_name: str
    description: str
    category: str  # chat, moderation, vision, utility, support
    assigned_model_id: str
    fallback_model_id: str
    enabled: bool = True
    custom_system_prompt: Optional[str] = None


FEATURES: Dict[str, FeatureDefinition] = {
    "chat_ai": FeatureDefinition(
        feature_key="chat_ai",
        feature_name="Chat AI",
        description="Handles interactive community chat conversations in designated channels.",
        category="chat",
        assigned_model_id="m1",
        fallback_model_id="m4"
    ),
    "moderation_ai": FeatureDefinition(
        feature_key="moderation_ai",
        feature_name="Moderation AI",
        description="Evaluates context, hate speech, and toxicity in messages.",
        category="moderation",
        assigned_model_id="m2",
        fallback_model_id="m5"
    ),
    "scam_image_detection": FeatureDefinition(
        feature_key="scam_image_detection",
        feature_name="Scam Image Detection",
        description="Scans uploaded images for QR code scams, fake gift cards, and nitro giveaways.",
        category="vision",
        assigned_model_id="m3",
        fallback_model_id="m1"
    ),
    "auto_moderation": FeatureDefinition(
        feature_key="auto_moderation",
        feature_name="Auto Moderation",
        description="Rapid sub-second message evaluation for instant action.",
        category="moderation",
        assigned_model_id="m4",
        fallback_model_id="m1"
    ),
    "message_classification": FeatureDefinition(
        feature_key="message_classification",
        feature_name="Message Classification",
        description="Categorizes incoming messages into support, spam, or chat.",
        category="utility",
        assigned_model_id="m1",
        fallback_model_id="m4"
    ),
    "translation": FeatureDefinition(
        feature_key="translation",
        feature_name="Translation",
        description="Multi-language real-time translation of user messages.",
        category="utility",
        assigned_model_id="m3",
        fallback_model_id="m1"
    ),
    "summarization": FeatureDefinition(
        feature_key="summarization",
        feature_name="Summarization",
        description="Generates quick recaps of active chat threads and ticket discussions.",
        category="utility",
        assigned_model_id="m2",
        fallback_model_id="m1"
    ),
    "image_captioning": FeatureDefinition(
        feature_key="image_captioning",
        feature_name="Image Captioning",
        description="Generates descriptive text captions for uploaded attachments.",
        category="vision",
        assigned_model_id="m1",
        fallback_model_id="m3"
    ),
    "ocr": FeatureDefinition(
        feature_key="ocr",
        feature_name="OCR Text Extraction",
        description="Extracts readable text from screenshots and image files.",
        category="vision",
        assigned_model_id="m3",
        fallback_model_id="m1"
    ),
    "spam_detection": FeatureDefinition(
        feature_key="spam_detection",
        feature_name="Spam Detection",
        description="Detects mass mentions, repetitive content, and bot spam.",
        category="moderation",
        assigned_model_id="m6",
        fallback_model_id="m4"
    ),
    "toxicity_detection": FeatureDefinition(
        feature_key="toxicity_detection",
        feature_name="Toxicity Detection",
        description="Analyzes severe hostility, profanity, and harassment.",
        category="moderation",
        assigned_model_id="m5",
        fallback_model_id="m2"
    ),
    "nsfw_detection": FeatureDefinition(
        feature_key="nsfw_detection",
        feature_name="NSFW Detection",
        description="Scans images and text for explicit adult content.",
        category="vision",
        assigned_model_id="m3",
        fallback_model_id="m1"
    ),
    "knowledge_assistant": FeatureDefinition(
        feature_key="knowledge_assistant",
        feature_name="Knowledge Assistant",
        description="Searches server documentation & FAQ to answer member questions.",
        category="support",
        assigned_model_id="m2",
        fallback_model_id="m1"
    )
}


class FeatureRegistry:
    """Manages system feature assignments."""

    def __init__(self):
        self._features: Dict[str, FeatureDefinition] = dict(FEATURES)

    def get(self, feature_key: str) -> Optional[FeatureDefinition]:
        return self._features.get(feature_key)

    def update_assignment(self, feature_key: str, primary_model_id: str, fallback_model_id: str, enabled: bool = True) -> None:
        if feature_key in self._features:
            feat = self._features[feature_key]
            feat.assigned_model_id = primary_model_id
            feat.fallback_model_id = fallback_model_id
            feat.enabled = enabled

    def list_all(self) -> List[FeatureDefinition]:
        return list(self._features.values())
