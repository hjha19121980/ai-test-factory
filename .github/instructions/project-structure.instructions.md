---
description: "Repository structure guideline for the Angular frontend, Python backend, custom agents, shared instructions, and generated tests."
applyTo: "**/*"
---
# Project Structure Guideline

- Preserve an existing repository structure when one is present. Before creating files, inspect the nearest package, module, test, and configuration directories and follow their conventions.
- For a new AI Test Factory repository, use this layout:

```text
frontend/                 Angular application
backend/                  Python API and orchestration service
 agents/                   Runtime agent contracts, prompts, and adapters
   planner/
   unit/
   integration/
   api/
   ui/
   performance/
   reviewer/
   executor/
 .github/skills/           Reusable on-demand workflow skills
shared/                   Cross-layer schemas, API contracts, and documentation
tests/                    Cross-service or end-to-end tests
  unit/
  integration/
  api/
  ui/
  performance/
docs/                     Architecture, workflow, and operational documentation
.github/agents/           VS Code custom agent definitions
.github/instructions/     Coding and structure instructions
```

- Keep Angular source, components, services, routes, and frontend tests under `frontend/`; keep Python modules, API routes, orchestration, and backend tests under `backend/`.
- Keep runtime agent implementation separate from VS Code custom-agent definitions. `.github/agents/*.agent.md` files configure development assistants; they are not runtime application code.
- Keep generated test artifacts in the target project test area or an explicitly configured artifact directory. Never mix generated output with production source.
- Keep shared contracts framework-neutral and versioned. Avoid imports from `frontend/` into `backend/` or the reverse.
- Use one canonical location for each module. Do not create duplicate `src`, `app`, `tests`, agent, or configuration trees without documenting the boundary.
- Put secrets, credentials, build output, caches, virtual environments, and local runtime data outside tracked source directories and exclude them from version control.
- If the repository already uses a different but coherent structure, document the mapping and follow it rather than moving files for cosmetic consistency.
