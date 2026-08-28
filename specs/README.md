# Versioned QA Specifications

Each product change should have a versioned QA specification before test generation:

```text
specs/<requirement-id>/
  requirement.md
  qa-spec.json
  test-plan.json
```

`qa-spec.json` is the source of truth for acceptance criteria, risks, and test strategy. `test-plan.json` maps those criteria to specialist test tasks and must remain `awaiting_approval` until a human approves it. Schemas are maintained under `shared/schemas/`.

A specification change increments its version and invalidates affected test results. Generated tests must carry the specification ID, acceptance-criteria ID, and evidence reference in their traceability record.
