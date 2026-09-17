# Sprint 001 — Handoff

## What Sprint 001 delivered

Monorepo foundation, Operating Pack, design tokens, the landing page, the marketplace results page
on sample data, health route, Dockerfile, CI skeletons, Playwright + axe smoke tests.
Verification record: see the final report in the pull request for `claude/happy-cray-itei24`.

## Sprint 002 progress

First slice delivered 2026-09-17: items 3 (data model only), 4 and 5 below, as ADR-001 records.
See `sprints/002/status.md`.

## What Sprint 002 adds (in this order)

1. **`@ethanel/chassis` implementation**: config, pino logger, OpenTelemetry, probes, graceful
   shutdown, error envelope, internal JWT, pg-boss, Prisma base client with `withOrganization()`.
2. **Helm**: first consuming chart (`identity-svc`) on `charts/service`; `helm lint` +
   `kubeconform` in CI; `apps/web/helm/values.{staging,production}.yaml`.
3. **`identity-svc`**: organizations, memberships, roles; Clerk webhook sync through the gateway.
4. **Clerk** in `apps/web`: `proxy.ts` (never `middleware.ts`) for optimistic redirects,
   authorization in the data layer, `(app)/org/[orgSlug]` layout resolving the organization.
5. **Prisma 7** in `@ethanel/db`: `identity` schema, forward-only migrations, RLS policy
   template, seed fixtures.
6. **RLS harness (E3)** in `@ethanel/testing/tenancy`, run against `identity-svc` in CI.
7. **Dependencies to install then** (deliberately absent now): `@clerk/nextjs`, `prisma`,
   `@prisma/client`, `@tanstack/react-query`, `ag-grid-react`, `maplibre-gl`, `@serwist/next`.

## Queued from the canvas (not in Sprint 001)

Designed artboards for `/about`, `/pricing` (quote builder), `/products`, `/solutions`,
`/company`, `/careers`, `/press`, `/trust`, `/privacy`, `/terms`, `/design-partners`. Each has a
heading-only placeholder route now.

## Open items carried forward

`.docs/QUESTIONS.md` Q-01 … Q-18. Q-01 (canonical decisions) and Q-02 (site URL, WhatsApp
number) should be closed before Sprint 002 starts.

## Handoff prompt for the Builder (Sprint 002)

> Read `.docs/AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `RISKS.md`, `QUESTIONS.md`, then
> `sprints/002/{requirements,blueprint,acceptance}.md`. Implement `@ethanel/chassis` first and
> prove it with `identity-svc` booting under the Helm chart in the staging namespace. Do not touch
> `apps/web/(marketing)` except to add `proxy.ts` and the Clerk provider.
