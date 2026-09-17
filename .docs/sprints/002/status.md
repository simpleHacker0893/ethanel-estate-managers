# Sprint 002 — status (first slice, 2026-09-17)

## Delivered

- **Neon + Prisma 7** in `@ethanel/db`: schemas `identity`, `property`, `money`; migration
  `20260917090000_init` with forced RLS and join-free policies; `withScope()`; deterministic
  fixtures; `seed`, `seed:sql`, `seed:clerk` scripts; data-access functions for the dashboard,
  landlord portal and resident surface. Applied and seeded on Neon project `ethanel-estates`
  (`silent-snow-01657425`, database `neondb`). Application role `ethanel_web` (`NOBYPASSRLS`).
- **Clerk** in `apps/web`: `proxy.ts`, `(auth)` route group (`/sign-in`, `/sign-up`,
  `/after-sign-in`), `lib/auth.ts` guards, `app/forbidden.tsx` (403), `UserButton` in the app
  header, sign-in and create-account links in the marketing header and mobile nav.
- **Surfaces on live data**: `/org/[orgSlug]` (rent run, properties, ledger tail, repairs),
  `/org/[orgSlug]/settings` (owner/admin), `/landlord`, `/me`.
- **Demo accounts** section on the landing page, derived from the fixtures.
- **Tests**: `packages/testing/e2e/auth.spec.ts` (authentication, persona authorization,
  tenancy isolation) on networkless Clerk session verification; CI runs it against a Postgres
  service container.

## Not done in this slice

- `clerk auth login` / `clerk init` could not run in the build sandbox (Clerk's API and OAuth
  callback are blocked by the sandbox egress policy). The integration was written by hand to the
  same result; run `clerk doctor` locally to confirm.
- `pnpm --filter @ethanel/db seed:clerk` (creates the six demo users and two organizations in
  Clerk and links their ids) must be run from a machine that can reach `api.clerk.com`.
- Chassis implementation, Helm chart, `identity-svc`, RLS harness (E3) as a separate package,
  Clerk webhook sync through the gateway.

## Runbook

```
# 1. env
cp apps/web/.env.example apps/web/.env.local     # fill Clerk keys + DATABASE_URL (ethanel_web role)
cp packages/db/.env.example packages/db/.env     # DATABASE_URL, DATABASE_URL_UNPOOLED, CLERK_SECRET_KEY

# 2. database (already applied on Neon; for a fresh branch or local Postgres)
pnpm --filter @ethanel/db migrate:deploy
pnpm --filter @ethanel/db seed

# 3. Clerk demo accounts (dashboard: enable Email+Password and Organizations first)
pnpm --filter @ethanel/db seed:clerk

# 4. run
pnpm --filter web dev
```
