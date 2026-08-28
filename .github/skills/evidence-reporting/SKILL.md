---
name: evidence-reporting
description: "Use when executing, reviewing, or reporting AI Test Factory work. Capture commands, exit codes, logs, reports, traces, screenshots, timing, and environment facts; distinguish verified results from assumptions."
user-invocable: false
---
# Evidence Reporting

- Never claim a test passed without execution evidence.
- Record the command, exit code, relevant logs, reports, traces, screenshots, timing, and environment metadata.
- Classify outcomes as product defect, test defect, environment failure, blocked, or inconclusive where applicable.
- For reviews, report findings first, ordered by `critical`, `high`, `medium`, and `low`, with file reference, impact, evidence, and recommendation.
- Trace generated tests and results back to the approved plan.
- Report residual gaps, assumptions, and limitations plainly; do not suppress failures or turn infrastructure failures into passes.
