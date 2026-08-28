---
name: repository-standards
description: "Use when inspecting or modifying an AI Test Factory repository. Preserve canonical frontend, backend, agent, shared, test, and documentation boundaries; identify the file language; and apply the matching workspace coding standard."
user-invocable: false
---
# Repository Standards

1. Read the repository structure guideline before planning or editing.
2. Preserve the existing coherent layout. For a new project, keep Angular under `frontend/`, Python under `backend/`, runtime agent code under `agents/`, shared contracts under `shared/`, generated tests under the configured test area, and documentation under `docs/`.
3. Keep VS Code customizations under `.github/agents/`, `.github/instructions/`, or `.github/skills/`; do not confuse them with runtime agent implementations.
4. Identify each target file's language and load the most specific applicable coding standard before editing.
5. Keep secrets, credentials, caches, virtual environments, generated build output, and local runtime data outside tracked source directories.
6. Treat structure or standard violations as explicit findings or planned work; do not silently broaden scope.
