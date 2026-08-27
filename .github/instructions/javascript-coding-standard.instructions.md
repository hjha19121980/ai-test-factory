---
description: "JavaScript coding standard for runtime code, scripts, configuration, and untyped tests."
applyTo: "**/*.js,**/*.jsx,**/*.mjs,**/*.cjs"
---
# JavaScript Coding Standard

- Follow the repository's runtime version, module system, formatter, linter, and package conventions.
- Use `const` by default and `let` only when reassignment is required. Do not use `var`.
- Prefer small pure functions, descriptive names, explicit data flow, and early validation at system boundaries.
- Use strict equality, avoid implicit coercion, and handle `null` and `undefined` intentionally. Do not hide errors with empty catches or broad silent fallbacks.
- Handle promises explicitly with `async`/`await` or a returned promise. Do not leave floating promises; define timeouts and bounded retries for external work.
- Validate and sanitize user, file, network, and environment input. Never use `eval`, dynamic code generation, or unsafe command construction.
- Keep secrets out of source, logs, browser bundles, and committed configuration. Redact sensitive values in diagnostics.
- Prefer named exports and explicit imports when consistent with the repository. Avoid circular dependencies and unnecessary global state.
- Tests must be deterministic and behavior-focused. Use stable selectors and fixtures; avoid arbitrary sleeps, order dependence, and assertions tied to implementation details.
- Run formatting, lint, syntax/type checks where available, and the narrowest relevant test suite before reporting completion.
