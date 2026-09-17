# QA schedule

Trunk-based repository, `main` deploys staging. The schedule below is what QA runs and when. Each
item names the check, the evidence expected, and where a failure is recorded.

## A. On every commit to any branch (automated, must be green before review)

| Check                                | Evidence                            | Owner  |
| ------------------------------------ | ----------------------------------- | ------ |
| commitlint (conventional, scoped)    | husky `commit-msg` passes           | author |
| `pnpm turbo run lint typecheck`      | CI `verify` job, no WARNING lines   | CI     |
| `pnpm turbo run build`               | CI `verify` job                     | CI     |
| migrate + seed as non-superuser, e2e | CI `verify` job, Playwright summary | CI     |
| Trivy image scan, HIGH/CRITICAL      | CI `image scan` job green           | CI     |

Until P1-01 is closed the image-scan job is red on every commit; the review pass treats the
`verify` job as the gate and tracks the scan separately.

## B. On every pull request (QA review, before merge)

1. Base branch is `main` (P1-02); title is a conventional commit; body says what acceptance items
   it closes.
2. Diff read against `.docs/AGENTS.md` house rules: vocabulary, no `src/`, money as `bigint`,
   no `'use cache'` under `(app)`, `(portal)`, `(resident)`, Server Actions validate with a
   contract and rate-limit, `'use client'` only on leaves.
3. New copy: every figure labelled sample/illustrative/introductory; no fee, tier, SLA or partner
   that is not in `DECISIONS.md`; new assumptions in `QUESTIONS.md`.
4. New route: added to the smoke `routes` list; one `h1`; axe zero serious/critical.
5. New protected surface: a row in the auth matrix (`auth.spec.ts`) for every persona.
6. New env var: in `apps/web/.env.example`, `lib/env.ts`, `turbo.json` `env`, the Dockerfile
   if public, and the Helm values.
7. Migration: forward-only, RLS enabled and forced on every tenant table, policy per table,
   E3 matrix row added.
8. QA runs the review pass (see `README.md`) on the PR head and posts findings on the PR.

## C. Daily while a sprint is active

- `git fetch --all --prune`; note new branches and commits since the last pass.
- Read every CI run since the last pass; any new red on `main` is a P1 the same day.
- Re-run the review pass on the head of `main` if anything merged.
- Update the open findings table in the latest `reviews/*.md` (closed, still open, regressed).

## D. Weekly (Monday, after Renovate)

- Review Renovate PRs; merge patch/minor when CI is green; Next.js security releases within 7 days.
- `trivy fs pnpm-lock.yaml --severity HIGH,CRITICAL --ignore-unfixed` and record the count.
- Accessibility sweep with axe on every route in the smoke list, desktop and 390 px viewport.
- Docs consistency: every `ASSUMPTION` in code has a `Q-` row; every `P-` row is still true.
- Stale branches: anything fully contained in `main` is deleted.

## E. At sprint end (before the Builder's completion report is accepted)

- Every `[ ]` in `sprints/NNN/acceptance.md` is either checked with evidence or moved to the
  next sprint's requirements with a reason.
- `manual-test-plan.md` executed on staging with real keys; results attached to the review.
- Handoff items from the previous sprint that are still open are called out by name.

## F. Open findings tracker (from `reviews/2026-09-17-baseline.md`)

| ID    | Title                                            | Severity | Status | Closed by |
| ----- | ------------------------------------------------ | -------- | ------ | --------- |
| P1-01 | CI never green: Trivy image scan fails           | P1       | open   |           |
| P1-02 | Default branch is `claude/happy-cray-itei24`     | P1       | open   |           |
| P1-03 | Deploy installs a Helm library chart             | P1       | open   |           |
| P2-01 | Open redirect via backslash in `next`            | P2       | open   |           |
| P2-02 | No security response headers                     | P2       | open   |           |
| P2-03 | Rate limit trusts `X-Forwarded-For`, answers 200 | P2       | open   |           |
| P2-04 | Email linking without verification check         | P2       | open   |           |
| P2-05 | Missing fixtures-mirror test                     | P2       | open   |           |
| P2-06 | Two HIGH advisories via `prisma`                 | P2       | open   |           |
| P3-01 | Turbo output warnings                            | P3       | open   |           |
| P3-02 | Deprecated action majors                         | P3       | open   |           |
| P3-03 | Proxy CA not passed through turbo                | P3       | open   |           |
| P3-04 | No unit-test layer                               | P3       | open   |           |
| P3-05 | E3 tenancy harness is a README                   | P3       | open   |           |
| P3-06 | Demo seed has no production guard                | P3       | open   |           |
| P3-07 | Sprint 002 staging items open                    | P3       | open   |           |
| P3-08 | Renovate activity unverified                     | P3       | open   |           |

## G. Suggested order for the Builder

1. Prompts 2, 1, 3 (pipeline and repository hygiene, one day).
2. Prompts 4, 7, 5, 6 (security, half a day each with tests).
3. Prompts 8, 13, 14 (test layers, then the rest of P2/P3 ride on them).
4. Prompts 9, 10, 11, 12, 15 as small PRs.
5. Staging items in `manual-test-plan.md` once keys are available.
