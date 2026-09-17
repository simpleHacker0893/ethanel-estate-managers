# DECISIONS.md

Decisions are house rules. Inherit them; do not re-litigate. To change one, add a superseding row
and an ADR under `adr/`.

> **Placeholder.** The canonical list D-01 … D-53 will be pasted by the operator. Rows below are
> the decisions the Sprint 001 master prompt fixes, numbered provisionally with a `P-` prefix so
> they can be renumbered without breaking references. When the canonical list lands, map each
> `P-` row to its `D-` number or mark it superseded.

| ID   | Decision                                                                                                                      | Rationale                                                                  | Source        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------- |
| D-01 | _pending canonical list_                                                                                                      |                                                                            | operator      |
| …    |                                                                                                                               |                                                                            |               |
| D-53 | _pending canonical list_                                                                                                      |                                                                            | operator      |
| P-01 | Single pnpm + Turborepo monorepo; no `src/` folder anywhere.                                                                  | One place for contracts, one CI, one release train.                        | master prompt |
| P-02 | `apps/web` is Next.js 16 App Router, `cacheComponents: true`, Turbopack, ESLint flat config direct.                           | Current Active line; PPR-style static shells for marketing/marketplace.    | master prompt |
| P-03 | Marketing and marketplace may use `'use cache'`. Dashboard, ledger, landlord portal never do.                                 | A stale figure costs money.                                                | master prompt |
| P-04 | `proxy.ts` (not `middleware.ts`) when Clerk route protection lands; none in Sprint 001.                                       | Next 16 convention; marketing routes are public.                           | master prompt |
| P-05 | Money is `bigint` minor units (KES cents) end to end; ESLint bans `number` in money files.                                    | Floats lose shillings.                                                     | master prompt |
| P-06 | Keys are UUIDv7 generated in application code.                                                                                | Time-ordered, no DB round-trip for ids, safe to expose.                    | master prompt |
| P-07 | One Postgres schema and one role per service on one Neon project; no cross-schema joins/FKs.                                  | Service ownership without the cost of separate databases.                  | master prompt |
| P-08 | Tenancy is `organization_id` + RLS; chassis sets `app.organization_id` per transaction.                                       | Defence in depth beyond the WHERE clause.                                  | master prompt |
| P-09 | Gateway owns all inbound webhooks (M-Pesa, WhatsApp, Clerk) and API keys.                                                     | Retry semantics stay out of domain services.                               | master prompt |
| P-10 | Side effects via transactional outbox → pg-boss; Valkey is cache only.                                                        | Exactly-once effects without a message broker.                             | master prompt |
| P-11 | `packages/contracts` (zod) is the single source of truth for request shapes and OpenAPI.                                      | One schema for forms, actions, routes and docs.                            | master prompt |
| P-12 | Design tokens in `packages/ui/theme.css`; Fraunces for marketing headings only, Manrope body.                                 | Storefronts and dashboard share tokens; dashboard never uses display type. | master prompt |
| P-13 | Sprint 001 client components: `mobile-nav`, `demo-form`, `marketplace-search-bar` only (+ results-page filters).              | Landing prerenders static.                                                 | master prompt |
| P-14 | Demo requests: Server Action → structured log + optional `DEMO_WEBHOOK_URL` POST, behind an interface `billing-svc` replaces. | No lead lost before billing-svc exists.                                    | interview     |
| P-15 | Marketplace results in Sprint 001 read typed sample listings filtered by URL params inside `'use cache'`.                     | Proves the search round-trip without `listing-svc`.                        | interview     |
| P-16 | Public facts (site URL, WhatsApp number) come from zod-validated env with safe fallbacks.                                     | Nothing hard-coded that will change.                                       | interview     |
| P-17 | Sprint 001 acceptance adds Playwright + axe smoke tests in CI (routes 200, one h1, zero serious/critical a11y).               | Static and a11y regressions caught before review.                          | interview     |
| P-18 | Sub-pages beyond landing and marketplace results are heading-only placeholders in Sprint 001.                                 | Scope; canvas designs are queued in `sprints/001/handoff.md`.              | interview     |
| P-19 | Conventional commits enforced by commitlint; trunk-based; `main` deploys to staging; production is manual promotion by SHA.   | Small reviewable history; no rebuilds for production.                      | master prompt |
| P-20 | Renovate weekly; Next.js security releases within 7 days as a high-priority group.                                            | Framework CVEs are the most likely exposure.                               | master prompt |
| P-21 | Marketplace intent enum is `rent                                                                                              | sale                                                                       | land          | lease | short-stay`. Landing bar shows four (To let, For sale, Lease, Short stay); results page shows all five. | Landing and results artboards disagree; one contract serves both. | ASSUMPTION, see QUESTIONS Q-03 |
