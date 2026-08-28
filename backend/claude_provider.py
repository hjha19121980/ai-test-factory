"""Claude model adapter used by runtime QA agents."""

from __future__ import annotations

import os
from typing import Any, Protocol


class ClaudeProviderError(RuntimeError):
    """Raised when Claude cannot be configured or does not return text."""


class MessagesClient(Protocol):
    def create(self, **kwargs: Any) -> Any:
        ...


class ClaudeClient(Protocol):
    messages: MessagesClient


class ClaudeProvider:
    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        client: ClaudeClient | None = None,
    ) -> None:
        configured_key = api_key if api_key is not None else os.getenv("ANTHROPIC_API_KEY")
        self.model = model or os.getenv("CLAUDE_MODEL", "claude-sonnet-4-5")

        if client is not None:
            self.client = client
            return
        if not configured_key:
            raise ClaudeProviderError(
                "ANTHROPIC_API_KEY is not configured. Set it in the backend environment."
            )

        try:
            from anthropic import Anthropic
        except ImportError as error:
            raise ClaudeProviderError(
                "The Anthropic SDK is not installed. Run: pip install -r backend/requirements.txt"
            ) from error

        self.client = Anthropic(api_key=configured_key)

    def complete(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = "".join(
            block.text
            for block in getattr(response, "content", [])
            if getattr(block, "type", None) == "text"
        ).strip()
        if not text:
            raise ClaudeProviderError("Claude returned no text content")
        return text
