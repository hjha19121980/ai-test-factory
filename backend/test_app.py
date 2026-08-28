import unittest

from app import RunStore


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


if __name__ == "__main__":
    unittest.main()
