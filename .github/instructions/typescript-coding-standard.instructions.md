---
description: "TypeScript coding standard for frontend, backend, libraries, and typed test code."
applyTo: "**/*.ts,**/*.tsx"
---
# TypeScript Coding Standard

- Use the repository's TypeScript version, formatter, linter, module system, and strictness settings. Do not weaken compiler options to make code pass.
- Prefer precise types, discriminated unions, interfaces or type aliases for domain contracts, and `unknown` with narrowing at untrusted boundaries. Avoid `any`.
- Use descriptive names and small functions. Keep side effects at clear boundaries and make async behavior, cancellation, and error handling explicit.
- Prefer immutable data and `const`. Avoid mutation of shared objects, implicit coercion, non-null assertions, and type assertions unless they are locally proven and documented by code structure.
- Validate external input at the boundary, including API responses, environment variables, files, and user input. Do not trust compile-time types for runtime data.
- Use `async`/`await` consistently. Handle rejected promises and preserve error context without exposing secrets or internal details.
- Do not use floating promises, unsafe `void` callbacks, or unbounded retries. Define timeouts and retry policies for external operations.
- Keep imports explicit and ordered according to the repository linter. Avoid barrel imports when they create cycles or unnecessary bundle size.
- Tests must assert observable behavior, use stable fixtures, isolate state, and avoid arbitrary sleeps, implementation-detail assertions, and test ordering.
- Run formatting, lint, typecheck, build, and the narrowest relevant test suite before reporting completion.
