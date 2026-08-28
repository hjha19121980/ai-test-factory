---
name: approved-plan
description: "Use when planning or generating AI Test Factory tests. Require an editable plan, explicit assumptions and risks, human approval, scoped artifacts, and auditable status before generation or execution."
user-invocable: false
---
# Approved Plan Gate

1. Normalize the source, repository, changed files, acceptance criteria, risks, dependencies, test data, and environment assumptions.
2. Assign concrete scenarios, artifacts, pass criteria, and priorities to each applicable test role.
3. Set plan status to `awaiting_approval` and expose uncertain or missing information.
4. Do not approve the plan yourself, start generation, or execute tests until the user explicitly approves it.
5. Permit edits or rejection and preserve an auditable record of those decisions.
6. Modify only files and test types included in the approved plan.
