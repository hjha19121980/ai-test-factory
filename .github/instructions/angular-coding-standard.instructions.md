---
description: "Angular coding standard for components, templates, services, routes, and frontend tests."
applyTo: "**/*.component.ts,**/*.component.html,**/*.component.scss,**/*.service.ts,**/*.guard.ts,**/*.resolver.ts,**/*.pipe.ts,**/*.directive.ts,**/*.routes.ts,**/*.spec.ts"
---
# Angular Coding Standard

- Follow the existing Angular version, standalone or NgModule architecture, workspace formatter, ESLint rules, and test runner.
- Prefer standalone components when consistent with the application. Keep components focused on presentation and orchestration; move business logic and I/O into typed services.
- Use strict template checking and strict TypeScript settings. Define explicit interfaces for API data and component state; avoid `any`.
- Prefer signals and computed state for local reactive state when supported by the project. Dispose subscriptions correctly and avoid manual subscriptions when an async pipe or equivalent is appropriate.
- Use dependency injection through the framework. Keep providers intentional and avoid hidden global mutable state.
- Use semantic HTML, accessible labels, keyboard support, visible focus, correct heading structure, and meaningful loading, empty, and error states.
- Keep templates readable. Avoid complex expressions, side effects, duplicated markup, and index-based identity where a stable tracking key exists.
- Use stable accessible selectors or explicit test IDs for UI tests. Do not couple tests to CSS structure, generated classes, or arbitrary timing.
- Keep styles scoped and responsive. Avoid leaking global styles unless the design system requires it.
- Handle API errors without exposing sensitive details. Do not put credentials, tokens, or secrets in browser code or local storage.
- Run the project formatter, lint, typecheck/build, and the narrowest relevant unit or browser tests before reporting completion.
