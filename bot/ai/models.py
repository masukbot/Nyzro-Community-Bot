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
AI Model Definitions and Registry
"""

from __future__ import annotations
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


@dataclass
class ModelDefinition:
    """Stores full specs and cost parameters for an AI Model."""
    model_id: str
    model_name: str
    provider_id: str
    description: str
    context_window: int = 128000
    max_output_tokens: int = 4096
    temperature: float = 0.7
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    supports_vision: bool = False
    supports_image_gen: bool = False
    supports_audio: bool = False
    supports_streaming: bool = True
    input_cost_per_1m: float = 0.0
    output_cost_per_1m: float = 0.0
    speed_rating: str = "fast"
    recommended_use_cases: List[str] = field(default_factory=list)

    def calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """Calculates cost in USD for given input/output token counts."""
        input_cost = (input_tokens / 1_000_000.0) * self.input_cost_per_1m
        output_cost = (output_tokens / 1_000_000.0) * self.output_cost_per_1m
        return round(input_cost + output_cost, 6)


class ModelRegistry:
    """Manages registered models across all providers."""

    def __init__(self):
        self._models: Dict[str, ModelDefinition] = {}
        self._register_default_models()

    def register(self, model: ModelDefinition) -> None:
        """Register a new model definition."""
        self._models[model.model_id] = model

    def get(self, model_id: str) -> Optional[ModelDefinition]:
        """Get model by ID."""
        return self._models.get(model_id)

    def list_all(self) -> List[ModelDefinition]:
        """List all registered models."""
        return list(self._models.values())

    def list_by_provider(self, provider_id: str) -> List[ModelDefinition]:
        """List models owned by a specific provider ID."""
        return [m for m in self._models.values() if m.provider_id == provider_id]

    def _register_default_models(self) -> None:
        """Pre-populate default enterprise models."""
        defaults = [
            ModelDefinition(
                model_id="m1",
                model_name="gemini-2.5-flash",
                provider_id="p1",
                description="Google's ultra-fast multimodal AI model for speed and reasoning.",
                context_window=1048576,
                max_output_tokens=8192,
                supports_vision=True,
                supports_audio=True,
                input_cost_per_1m=0.15,
                output_cost_per_1m=0.60,
                speed_rating="ultra_fast",
                recommended_use_cases=["Chat AI", "Summarization", "Image Captioning"]
            ),
            ModelDefinition(
                model_id="m2",
                model_name="claude-3-5-sonnet-20241022",
                provider_id="p2",
                description="Anthropic's flagship model for coding, reasoning, and complex moderation.",
                context_window=200000,
                max_output_tokens=8192,
                supports_vision=True,
                input_cost_per_1m=3.00,
                output_cost_per_1m=15.00,
                speed_rating="balanced",
                recommended_use_cases=["Moderation AI", "Knowledge Assistant", "Ticket Assistant"]
            ),
            ModelDefinition(
                model_id="m3",
                model_name="gpt-4o",
                provider_id="p3",
                description="OpenAI's high-intelligence flagship model with vision.",
                context_window=128000,
                max_output_tokens=4096,
                supports_vision=True,
                supports_image_gen=True,
                supports_audio=True,
                input_cost_per_1m=2.50,
                output_cost_per_1m=10.00,
                speed_rating="fast",
                recommended_use_cases=["Scam Image Detection", "OCR", "Translation"]
            ),
            ModelDefinition(
                model_id="m4",
                model_name="llama-3.3-70b-versatile",
                provider_id="p4",
                description="Groq accelerated open weight model with sub-second latency.",
                context_window=128000,
                max_output_tokens=4096,
                input_cost_per_1m=0.59,
                output_cost_per_1m=0.79,
                speed_rating="ultra_fast",
                recommended_use_cases=["Auto Moderation", "Spam Detection", "Message Classification"]
            ),
            ModelDefinition(
                model_id="m5",
                model_name="deepseek-reasoner",
                provider_id="p6",
                description="DeepSeek's advanced reasoning engine for deep analysis.",
                context_window=64000,
                max_output_tokens=4096,
                input_cost_per_1m=0.55,
                output_cost_per_1m=2.19,
                speed_rating="balanced",
                recommended_use_cases=["Toxicity Detection", "Forms Scoring"]
            ),
            ModelDefinition(
                model_id="m6",
                model_name="llama3:latest",
                provider_id="p7",
                description="Self-hosted local privacy-focused model running via Ollama.",
                context_window=32768,
                max_output_tokens=2048,
                input_cost_per_1m=0.0,
                output_cost_per_1m=0.0,
                speed_rating="fast",
                recommended_use_cases=["Privacy Chat", "Spam Filtering"]
            )
        ]
        for m in defaults:
            self.register(m)
