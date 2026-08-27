---
description: "Java coding standard for application code, services, APIs, and tests."
applyTo: "**/*.java"
---
# Java Coding Standard

- Use the repository formatter, linter, build tool, and Java version; do not introduce competing conventions.
- Prefer clear, small classes and methods with single responsibilities. Keep public APIs intentional and document non-obvious invariants.
- Use descriptive names. Avoid one-letter variables except conventional short-lived loop indexes where clarity is preserved.
- Prefer immutable data, `final` fields and parameters where practical, records for simple immutable data, and dependency injection over service locators or static global state.
- Use `Optional` for return values when absence is expected; do not use it for fields or parameters unless the local framework standard requires it. Never call `Optional.get()` without a proven value.
- Validate inputs at boundaries. Preserve meaningful exception context, avoid empty catches, and do not expose stack traces, secrets, or internal details in API responses.
- Use parameterized logging. Never log passwords, tokens, personal data, or full request bodies without an approved redaction policy.
- Use try-with-resources for closeable resources. Make thread-safety, timeouts, retries, transaction boundaries, and ownership explicit.
- Avoid raw types, unchecked casts, reflection, and wildcard imports. Suppress warnings only with a narrow justification.
- Tests must be deterministic, isolated, readable, and behavior-focused. Use stable fixtures, explicit assertions, and independent setup/teardown; avoid sleeps and test ordering.
- Run formatting, static analysis, compilation, and the narrowest relevant test suite before reporting completion.
