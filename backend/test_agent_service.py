import unittest

from agent_service import AgentRequest, AgentService


class FakeProvider:
    def __init__(self) -> None:
        self.calls = []

    def complete(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        self.calls.append((system_prompt, user_prompt, max_tokens))
        return "agent response"


class AgentServiceTests(unittest.TestCase):
    def test_role_prompt_is_selected(self) -> None:
        provider = FakeProvider()
        service = AgentService(provider)

        result = service.run(AgentRequest("api", "Review the API contract", 1000))

        self.assertEqual(result, "agent response")
        self.assertIn("API Test agent", provider.calls[0][0])
        self.assertEqual(provider.calls[0][2], 1000)

    def test_unknown_role_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            AgentService(FakeProvider()).run(AgentRequest("unknown", "work"))


if __name__ == "__main__":
    unittest.main()
