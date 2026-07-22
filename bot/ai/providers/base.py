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

"""Base class for AI providers."""

from __future__ import annotations
from typing import Any, Dict, List, Optional, AsyncIterator
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import time
import logging

logger = logging.getLogger("ai.providers")


@dataclass
class AIRequest:
    """A unified AI request that any provider can handle."""
    messages: List[Dict[str, str]]
    model: str
    temperature: float = 1.0
    max_tokens: Optional[int] = None
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    stop: Optional[List[str]] = None
    stream: bool = False
    system_prompt: Optional[str] = None
    images: Optional[List[bytes]] = None  # For vision models
    tools: Optional[List[Dict]] = None
    extra_params: Dict[str, Any] = field(default_factory=dict)


@dataclass
class AIResponse:
    """A unified AI response."""
    content: str
    model: str
    provider: str
    usage: Dict[str, int] = field(default_factory=dict)
    finish_reason: Optional[str] = None
    latency_ms: float = 0.0
    cost: float = 0.0
    raw: Any = None


@dataclass
class AIStreamChunk:
    """A streaming chunk from an AI provider."""
    content: str
    delta: str
    finish_reason: Optional[str] = None
    usage: Optional[Dict[str, int]] = None


class BaseProvider(ABC):
    """
    Base class for all AI providers.
    All provider implementations should inherit from this class.
    """

    # Provider metadata
    name: str = "base"
    display_name: str = "Base Provider"
    description: str = "Base AI provider"
    icon: str = "bot"
    
    # Capabilities
    supports_vision: bool = False
    supports_image_generation: bool = False
    supports_audio: bool = False
    supports_streaming: bool = True
    supports_tools: bool = False
    supports_embeddings: bool = False

    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the provider with its configuration.
        
        Args:
            config: A dictionary containing provider-specific configuration:
                - api_key: The API key
                - endpoint: The base URL
                - model: Default model name
                - organization: Optional organization ID
                - api_version: Optional API version
                - headers: Custom headers
                - timeout: Request timeout
                - max_retries: Max retry attempts
                - rate_limit: Rate limit (requests per minute)
        """
        self.config = config
        self.api_key = config.get("api_key", "")
        self.endpoint = config.get("endpoint", "")
        self.default_model = config.get("default_model") or config.get("model") or ""
        self.organization = config.get("organization")
        self.api_version = config.get("api_version")
        self.custom_headers = config.get("headers", {})
        self.timeout = config.get("timeout", 30)
        self.max_retries = config.get("max_retries", 3)
        self.rate_limit = config.get("rate_limit", 60)

    @abstractmethod
    async def chat(self, request: AIRequest) -> AIResponse:
        """Send a chat completion request and return the response."""
        raise NotImplementedError

    @abstractmethod
    async def stream_chat(self, request: AIRequest) -> AsyncIterator[AIStreamChunk]:
        """Stream a chat completion."""
        raise NotImplementedError
    
    async def test_connection(self) -> Dict[str, Any]:
        """Test the provider connection. Returns status info."""
        try:
            test_req = AIRequest(
                messages=[{"role": "user", "content": "ping"}],
                model=self.default_model,
                max_tokens=10
            )
            start = time.time()
            response = await self.chat(test_req)
            latency = (time.time() - start) * 1000
            return {
                "status": "ok",
                "latency_ms": round(latency, 2),
                "model": response.model,
                "response": response.content[:100] if response.content else None
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

    def calculate_cost(self, usage: Dict[str, int], model: str) -> float:
        """
        Calculate the cost of a request. Override in subclasses for accurate pricing.
        Default returns 0 (free/unknown).
        """
        return 0.0

    async def close(self):
        """Clean up provider resources (e.g. aiohttp sessions). Override in subclasses."""
        pass

    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation (4 chars ≈ 1 token)."""
        return max(1, len(text) // 4)
