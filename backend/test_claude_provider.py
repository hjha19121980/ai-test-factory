import unittest

from claude_provider import ClaudeProvider, ClaudeProviderError


class FakeBlock:
    def __init__(self, block_type: str, text: str) -> None:
        self.type = block_type
        self.text = text


class FakeCompletions:
    def __init__(self) -> None:
        self.calls = []

    def create(self, **kwargs):
        self.calls.append(kwargs)
        choice = type("Choice", (), {"message": type("Message", (), {"content": " planner output "})()})()
        return type("Response", (), {"choices": [choice]})()


class FakeChat:
    def __init__(self) -> None:
        self.completions = FakeCompletions()


class FakeClient:
    def __init__(self) -> None:
        self.chat = FakeChat()


class ClaudeProviderTests(unittest.TestCase):
    def test_complete_sends_model_and_prompts(self) -> None:
        client = FakeClient()
        provider = ClaudeProvider(client=client, model="claude-sonnet-test")

        result = provider.complete("system", "user", max_tokens=123)

        self.assertEqual(result, "planner output")
        self.assertEqual(client.chat.completions.calls[0]["model"], "claude-sonnet-test")
        self.assertEqual(client.chat.completions.calls[0]["messages"][0]["content"], "system")
        self.assertEqual(client.chat.completions.calls[0]["messages"][1]["content"], "user")
        self.assertEqual(client.chat.completions.calls[0]["max_tokens"], 123)

    def test_missing_key_is_reported_before_sdk_use(self) -> None:
        with self.assertRaises(ClaudeProviderError):
            ClaudeProvider(api_key="")


if __name__ == "__main__":
    unittest.main()
