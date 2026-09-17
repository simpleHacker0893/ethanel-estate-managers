# ARCHITECTURE.md

## Topology: 11 services, 15 Deployments, one repository

```
                     ┌────────────────────────────┐
  residents /        │  Cloudflare (DNS, WAF, RL) │
  landlords /        └──────────┬───────────┬─────┘
  buyers / staff                │           │
                        ┌───────▼──────┐ ┌──▼───────────────┐
                        │ apps/web     │ │ apps/gateway     │  ← ALL inbound webhooks
                        │ Next.js 16   │ │ Fastify, /v1,    │    (M-Pesa, WhatsApp, Clerk)
                        │ BFF, Server  │ │ API keys, inbox  │    + public REST
                        │ Actions only │ └──┬───────────────┘
                        └──────┬───────┘    │ internal JWT, /v1 REST
                               │            │
   ┌───────────┬───────────┬───▼────────┬───▼───────┬────────────┬──────────┬──────────┬───────────┐
   │identity   │property   │listing     │money      │payments    │messaging │ops       │docs       │billing
   │-svc       │-svc       │-svc        │-svc       │-svc        │-svc      │-svc      │-svc       │-svc
   └─────┬─────┴─────┬─────┴─────┬──────┴─────┬─────┴─────┬──────┴────┬─────┴────┬─────┴─────┬─────┴──────
         │           │           │      money-worker payments-worker messaging-worker docs-worker
         │           │           │            │           │            │           │
   ┌─────▼───────────▼───────────▼────────────▼───────────▼────────────▼───────────▼───────────────┐
   │  Neon Postgres — ONE project per environment, ONE SCHEMA + ONE ROLE PER SERVICE, RLS on every  │
   │  tenant table keyed by organization_id. No cross-schema joins or FKs.                          │
   └───────────────────────────────────────────────────────────────────────────────────────────────┘
                                   Valkey: cache only (rate limits, sessions hints). Never a source of truth.
```

Deployables (15): `web`, `gateway`, nine `*-svc`, four `*-worker`. Each is a Deployment from the
Helm library chart in `charts/service` on EKS Auto Mode.

## Boundaries

- **`apps/web`** is a backend-for-frontend. Server Components read from services over `/v1`;
  Server Actions validate with `@ethanel/contracts` and call services. It never opens a DB
  connection and holds no domain logic. Route groups: `(marketing)` static, `(marketplace)`
  cached, `(app)/org/[orgSlug]` live, `(portal)/landlord` live, `(resident)/me` live PWA.
- **`apps/gateway`** owns every inbound webhook and every API key. Webhooks are verified, written
  to an inbox table, acknowledged, then relayed to the owning service. This keeps M-Pesa's and
  WhatsApp's retry semantics out of domain services.
- **Services** are Fastify apps on `@ethanel/chassis`. Each owns one schema, one role, its own
  pg-boss queue, and publishes side effects through a transactional outbox. Cross-service reads
  are `/v1` REST with an internal JWT carrying `organization_id`. There is no shared bus.
- **Workers** share a schema with their service and drain that service's queue only.
- **`packages/contracts`** is the single source of truth for request shapes: zod schemas used by
  React Hook Form, Server Actions, Fastify route validation and the OpenAPI document.

## Tenancy

`organization_id` on every tenant table. RLS policies compare against
`current_setting('app.organization_id', true)`. `@ethanel/chassis/db.withOrganization()` sets it
with `SET LOCAL` at the start of every transaction. The E3 harness in `@ethanel/testing` proves
per service that organization A cannot see organization B through API, ORM or raw SQL.

## Money

Append-only ledger in `money-svc`. Postings are never updated or deleted; corrections are new
postings that reference the original. Amounts are `bigint` minor units (KES cents). Agency fees
are computed per management agreement at posting time. Landlord statements are built from
postings, never typed.

## Caching

- Marketing and marketplace: `cacheComponents: true`, `'use cache'` with `cacheLife` profiles
  and `cacheTag` per listing/organization, invalidated by `listing-svc` via a revalidation
  endpoint on `web`.
- Dashboard, ledger, landlord portal: live reads, no `'use cache'`, streamed under `<Suspense>`.
- Valkey holds rate-limit counters and short-lived caches only.

## Delivery

Trunk-based. `main` builds images, scans with Trivy (HIGH/CRITICAL block), deploys to the staging
namespace with Helm. Production is a manual promotion of an already-built SHA behind a GitHub
Environment approval. Renovate runs weekly; Next.js security releases are applied within 7 days.

## Observability

OpenTelemetry from the chassis (services) and `instrumentation.ts` (web) to an OTLP collector.
Every log line carries `service`, `organization_id` and `trace_id`. `/api/health` on web and
`/healthz` on services return `{ ok, sha }`.
