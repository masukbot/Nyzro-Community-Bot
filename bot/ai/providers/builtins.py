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
Built-in AI Provider Adapters — real HTTP implementations for 23+ provider types.
"""

from __future__ import annotations
import time
import json
import asyncio
import logging
from typing import Dict, Any, AsyncIterator, Optional, List
import aiohttp
from ai.providers.base import BaseProvider, AIRequest, AIResponse, AIStreamChunk

logger = logging.getLogger("ai.providers")


class UniversalRESTProvider(BaseProvider):
    """
    Universal HTTP REST provider handling OpenAI-compatible endpoints,
    Anthropic API, Gemini REST, Groq, Ollama, DeepSeek, OpenRouter, and Custom Endpoints.
    Uses real HTTP calls — no simulation.
    """

    OPENAI_COMPATIBLE = {
        "openai", "groq", "openrouter", "opencode", "deepseek", "xai",
        "together", "mistral", "fireworks", "perplexity", "cerebras",
        "minimax", "zhipu", "sambanova", "nvidia_nim", "lm_studio",
        "ollama", "custom"
    }

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.name = config.get("name", "Custom Provider")
        self.provider_type = config.get("provider_type", "custom")
        self.icon = config.get("icon", "bot")
        self._session: Optional[aiohttp.ClientSession] = None

    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session

    def _build_messages(self, request: AIRequest) -> List[Dict[str, str]]:
        messages = []
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})
        messages.extend(request.messages)
        return messages

    def _build_request_payload(self, request: AIRequest) -> Dict[str, Any]:
        ptype = self.provider_type
        messages = self._build_messages(request)

        if ptype == "anthropic":
            system = None
            cleaned = []
            for m in messages:
                if m["role"] == "system":
                    system = m["content"]
                else:
                    cleaned.append(m)
            payload = {
                "model": request.model or self.default_model or "claude-3-5-sonnet-20241022",
                "max_tokens": request.max_tokens or 4096,
                "messages": cleaned,
            }
            if system:
                payload["system"] = system
            if request.temperature != 1.0:
                payload["temperature"] = request.temperature
            return payload

        if ptype == "gemini":
            contents = []
            for m in messages:
                if m["role"] == "system":
                    continue
                contents.append({"role": "user" if m["role"] in ("user", "assistant") else "user", "parts": [{"text": m["content"]}]})
            payload = {
                "contents": contents,
                "generationConfig": {
                    "maxOutputTokens": request.max_tokens or 4096,
                    "temperature": request.temperature,
                }
            }
            if request.system_prompt:
                payload["systemInstruction"] = {"parts": [{"text": request.system_prompt}]}
            return payload

        if ptype == "cohere":
            cleaned = [m for m in messages if m["role"] != "system"]
            payload = {
                "model": request.model or self.default_model or "command-r-plus",
                "message": cleaned[-1]["content"] if cleaned else "",
                "max_tokens": request.max_tokens or 4096,
            }
            if len(cleaned) > 1:
                payload["chat_history"] = cleaned[:-1]
            return payload

        # OpenAI-compatible (default)
        payload = {
            "model": request.model or self.default_model or "gpt-4o",
            "messages": messages,
            "max_tokens": request.max_tokens or 4096,
            "temperature": request.temperature,
            "top_p": request.top_p,
        }
        if ptype in ("ollama", "lm_studio"):
            payload.pop("top_p", None)
        return payload

    def _build_headers(self) -> Dict[str, str]:
        ptype = self.provider_type
        headers = {"Content-Type": "application/json"}

        if ptype == "anthropic":
            if self.api_key:
                headers["x-api-key"] = self.api_key
                headers["anthropic-version"] = "2023-06-01"
        elif ptype == "gemini":
            pass  # API key goes in URL
        elif ptype == "cohere":
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
        else:
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"

        headers.update(self.custom_headers)
        return headers

    def _build_url(self, request: AIRequest) -> str:
        ptype = self.provider_type
        base = self.endpoint

        if ptype == "anthropic":
            ep = base or "https://api.anthropic.com/v1"
            return f"{ep.rstrip('/')}/messages"

        if ptype == "gemini":
            ep = base or "https://generativelanguage.googleapis.com"
            model = request.model or self.default_model or "gemini-2.5-flash"
            url = f"{ep.rstrip('/')}/v1beta/models/{model}:generateContent"
            if self.api_key:
                url += f"?key={self.api_key}"
            return url

        if ptype == "cohere":
            ep = base or "https://api.cohere.com/v2"
            return f"{ep.rstrip('/')}/chat"

        # OpenAI-compatible
        ep = base or "https://api.openai.com/v1"
        url = f"{ep.rstrip('/')}/chat/completions"
        return url

    async def _parse_response(self, data: Any, ptype: str, model_name: str, start_time: float) -> AIResponse:
        latency = (time.time() - start_time) * 1000.0

        if ptype == "anthropic":
            content = ""
            for block in data.get("content", []):
                if block.get("type") == "text":
                    content += block.get("text", "")
            usage = data.get("usage", {})
            return AIResponse(
                content=content,
                model=data.get("model", model_name),
                provider=self.name,
                usage={"prompt_tokens": usage.get("input_tokens", 0), "completion_tokens": usage.get("output_tokens", 0)},
                finish_reason="stop",
                latency_ms=round(latency, 2),
                raw=data
            )

        if ptype == "gemini":
            content = ""
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                for part in parts:
                    content += part.get("text", "")
            usage = data.get("usageMetadata", {})
            return AIResponse(
                content=content,
                model=model_name,
                provider=self.name,
                usage={"prompt_tokens": usage.get("promptTokenCount", 0), "completion_tokens": usage.get("candidatesTokenCount", 0)},
                finish_reason="stop",
                latency_ms=round(latency, 2),
                raw=data
            )

        if ptype == "cohere":
            content = data.get("text", data.get("message", {}).get("content", [{}])[0].get("text", ""))
            usage = data.get("usage", {})
            return AIResponse(
                content=content,
                model=data.get("model", model_name),
                provider=self.name,
                usage={"prompt_tokens": usage.get("input_tokens", 0), "completion_tokens": usage.get("output_tokens", 0)},
                finish_reason="stop",
                latency_ms=round(latency, 2),
                raw=data
            )

        # OpenAI-compatible (default)
        choice = data.get("choices", [{}])[0]
        content = choice.get("message", {}).get("content", "") or choice.get("delta", {}).get("content", "") or ""
        finish_reason = choice.get("finish_reason", "stop")
        usage = data.get("usage", {})
        return AIResponse(
            content=content,
            model=data.get("model", model_name),
            provider=self.name,
            usage={"prompt_tokens": usage.get("prompt_tokens", 0), "completion_tokens": usage.get("completion_tokens", 0)},
            finish_reason=finish_reason,
            latency_ms=round(latency, 2),
            raw=data
        )

    async def chat(self, request: AIRequest) -> AIResponse:
        """Execute real chat completion via HTTP."""
        start_time = time.time()
        model_name = request.model or self.default_model or "gpt-4o"
        ptype = self.provider_type

        payload = self._build_request_payload(request)
        headers = self._build_headers()
        url = self._build_url(request)

        logger.info(f"[{self.name}] POST {url} | model={model_name} | type={ptype}")

        try:
            session = await self._get_session()
            async with session.post(url, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=self.timeout or 30)) as resp:
                body = await resp.text()
                if resp.status != 200:
                    logger.error(f"[{self.name}] HTTP {resp.status}: {body[:300]}")
                    raise RuntimeError(f"Provider {self.name} returned HTTP {resp.status}: {body[:200]}")

                data = json.loads(body)
                result = await self._parse_response(data, ptype, model_name, start_time)
                result.cost = self.calculate_cost(result.usage, model_name)
                return result

        except asyncio.TimeoutError:
            raise RuntimeError(f"Provider {self.name} timed out after {self.timeout}s")
        except aiohttp.ClientError as e:
            raise RuntimeError(f"Provider {self.name} connection error: {e}")

    async def stream_chat(self, request: AIRequest) -> AsyncIterator[AIStreamChunk]:
        """Stream response chunks via real HTTP streaming."""
        model_name = request.model or self.default_model or "gpt-4o"
        ptype = self.provider_type
        payload = self._build_request_payload(request)
        payload["stream"] = True
        headers = self._build_headers()
        url = self._build_url(request)

        session = await self._get_session()
        try:
            async with session.post(url, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=self.timeout or 60)) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    raise RuntimeError(f"Stream HTTP {resp.status}: {body[:200]}")

                accumulated = ""
                async for line in resp.content:
                    line = line.decode("utf-8", errors="replace").strip()
                    if not line or line.startswith(":"):
                        continue
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str == "[DONE]":
                            yield AIStreamChunk(content=accumulated, delta="", finish_reason="stop")
                            return
                        try:
                            data = json.loads(data_str)
                            delta = data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                            if delta:
                                accumulated += delta
                                yield AIStreamChunk(content=accumulated, delta=delta, finish_reason=None)
                        except json.JSONDecodeError:
                            continue
        except Exception as e:
            logger.error(f"[{self.name}] Stream error: {e}")
            raise

    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()


PROVIDERS: Dict[str, type] = {
    "openai": UniversalRESTProvider,
    "anthropic": UniversalRESTProvider,
    "gemini": UniversalRESTProvider,
    "groq": UniversalRESTProvider,
    "openrouter": UniversalRESTProvider,
    "opencode": UniversalRESTProvider,
    "deepseek": UniversalRESTProvider,
    "xai": UniversalRESTProvider,
    "cohere": UniversalRESTProvider,
    "mistral": UniversalRESTProvider,
    "together": UniversalRESTProvider,
    "azure_openai": UniversalRESTProvider,
    "aws_bedrock": UniversalRESTProvider,
    "ollama": UniversalRESTProvider,
    "lm_studio": UniversalRESTProvider,
    "huggingface": UniversalRESTProvider,
    "fireworks": UniversalRESTProvider,
    "perplexity": UniversalRESTProvider,
    "cerebras": UniversalRESTProvider,
    "minimax": UniversalRESTProvider,
    "zhipu": UniversalRESTProvider,
    "sambanova": UniversalRESTProvider,
    "nvidia_nim": UniversalRESTProvider,
    "custom": UniversalRESTProvider,
}


def get_provider_class(provider_type: str) -> type:
    """Get provider implementation class by type key."""
    return PROVIDERS.get(provider_type.lower(), UniversalRESTProvider)


def list_providers() -> Dict[str, type]:
    """List all registered provider classes."""
    return PROVIDERS
