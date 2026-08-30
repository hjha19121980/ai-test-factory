"""OpenAI-compatible provider adapter used by runtime QA agents."""

from __future__ import annotations

import os
from typing import Any, Protocol


class ClaudeProviderError(RuntimeError):
    """Raised when the configured model provider cannot be reached or does not return text."""


class ChatCompletionsClient(Protocol):
    def create(self, **kwargs: Any) -> Any:
        ...


class OpenAIClient(Protocol):
    chat: "ChatCompletionsNamespace"


class ChatCompletionsNamespace(Protocol):
    create: Any


class ClaudeProvider:
    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        client: OpenAIClient | None = None,
        base_url: str | None = None,
    ) -> None:
        configured_key = api_key if api_key is not None else os.getenv("OPENAI_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
        self.model = model or os.getenv("CLAUDE_MODEL", "anthropic.claude-3-5-sonnet-20241022-v2:0")
        self.base_url = base_url or os.getenv("OPENAI_BASE_URL", "https://openai.generative.engine.capgemini.com/v1")

        if client is not None:
            self.client = client
            return
        if not configured_key:
            raise ClaudeProviderError(
                "OPENAI_API_KEY is not configured. Set it in the backend environment."
            )

        try:
            from openai import OpenAI
        except ImportError as error:
            raise ClaudeProviderError(
                "The OpenAI SDK is not installed. Run: pip install -r backend/requirements.txt"
            ) from error

        self.client = OpenAI(api_key=configured_key, base_url=self.base_url)

    def complete(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=0.7,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        content = getattr(getattr(response.choices[0], "message", None), "content", "")
        if isinstance(content, list):
            text = "".join(
                part.get("text", "") if isinstance(part, dict) else getattr(part, "text", "")
                for part in content
            ).strip()
        elif isinstance(content, str):
            text = content.strip()
        else:
            text = str(content or "").strip()

        if not text:
            raise ClaudeProviderError("The model returned no text content")
        return text
