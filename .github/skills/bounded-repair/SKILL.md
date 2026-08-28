---
name: bounded-repair
description: "Use when repairing generated AI Test Factory tests, fixtures, selectors, setup, or test configuration after a failure. Apply only bounded, reviewable repairs within the approved retry limit."
user-invocable: false
---
# Bounded Test Repair

1. Confirm the failure is in generated test code, fixtures, selectors, setup, or approved test configuration.
2. Preserve the approved test intent and keep the repair in the canonical test or artifact location.
3. Never change product code automatically, suppress failures, weaken assertions, or delete failing tests.
4. Record the repair diff, retry number, reason, and validation command.
5. Rerun the affected check and stop when the configured retry limit is reached or evidence is inconclusive.
6. Report `passed`, `failed`, `blocked`, or `inconclusive` only when the evidence supports it.
