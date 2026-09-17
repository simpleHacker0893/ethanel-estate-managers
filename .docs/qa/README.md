# QA — how quality is checked in this repository

The QA function reviews every branch and every commit that lands on GitHub, runs the repository's
own checks, probes the running build, and writes findings here. Nothing in this folder changes
product behaviour; every fix is handed to the Builder as a prompt.

## Files

| File                      | What it is                                                                |
| ------------------------- | ------------------------------------------------------------------------- |
| `schedule.md`             | The recurring QA schedule: per commit, per PR, daily, weekly, per sprint. |
| `manual-test-plan.md`     | Manual test cases for staging, run by a person with real keys.            |
| `reviews/YYYY-MM-DD-*.md` | One review per pass: what was checked, evidence, findings, prompts.       |

## Severity

- **P1** — blocks release or breaks the delivery pipeline. Fix before anything else merges.
- **P2** — security, data or correctness defect. Fix this sprint.
- **P3** — hygiene, coverage, tooling. Schedule.

## How a review pass runs

1. `git fetch --all --prune`; list every branch and its diff against `main`.
2. Read `.docs/AGENTS.md`, `DECISIONS.md`, the latest `sprints/NNN/acceptance.md`.
3. `pnpm install --frozen-lockfile && pnpm turbo run lint typecheck build` (warnings are failures).
4. Migrate and seed a local Postgres as a non-superuser role, then `pnpm turbo run test`.
5. Probe the production build (`next start`): auth matrix, redirects, headers, limits.
6. Read the GitHub Actions runs for the head of `main` and every open PR.
7. Write `reviews/<date>-<topic>.md` with evidence and prompts; update `schedule.md`.

A finding is only closed when the fix is on `main`, CI is green on that commit and the check
that caught it (automated or manual) passes again.
