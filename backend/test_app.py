import unittest

from app import RunStore, resolve_cors_origin


class RunStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = RunStore()
        self.run = self.store.create({"sourceType": "jira", "sourceValue": "PAY-482"})

    def test_new_run_waits_for_approval(self) -> None:
        self.assertEqual(self.run.state, "awaiting_approval")

    def test_approval_is_recorded(self) -> None:
        self.run.transition("approved", "qa-user")
        self.assertEqual(self.run.state, "approved")
        self.assertEqual(self.run.approval_history[-1]["actor"], "qa-user")

    def test_generation_cannot_start_before_approval(self) -> None:
        with self.assertRaises(ValueError):
            self.run.transition("generating")

    def test_cors_allows_localhost_and_127_origin(self) -> None:
        self.assertEqual(resolve_cors_origin("http://localhost:4200"), "http://localhost:4200")
        self.assertEqual(resolve_cors_origin("http://127.0.0.1:4200"), "http://127.0.0.1:4200")
        self.assertEqual(resolve_cors_origin("https://example.com"), "http://localhost:4200")


if __name__ == "__main__":
    unittest.main()
