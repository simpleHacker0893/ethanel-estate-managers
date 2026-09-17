# ADR-001 — Clerk sessions, Neon + Prisma 7 and a data-access layer in `apps/web`

**Status:** accepted (Sprint 002, first slice) · **Date:** 2026-09-17

## Context

Sprint 002 needs sign-in, per-organization authorization and live figures before `identity-svc`
and the other services exist. `ARCHITECTURE.md` says `apps/web` never opens a database
connection; keeping to that today would mean shipping nothing that signs in.

## Decision

1. **Clerk** is the identity provider. `proxy.ts` (`clerkMiddleware`) gives an optimistic
   redirect for `/org`, `/landlord`, `/me`; **authorization is decided in the data layer**
   (`apps/web/lib/auth.ts` → `@ethanel/db`): a membership row for the organization, a landlord
   row, a lease row. Clerk organization roles are mirrored, not trusted, for authorization.
2. **`@ethanel/db`** owns Prisma 7 on Neon: one Postgres schema per service (`identity`,
   `property`, `money`), no cross-schema joins or FKs, `organization_id` + forced RLS on every
   tenant table, `withScope()` sets transaction-local settings, postings have no UPDATE/DELETE
   policy. The application connects as **`ethanel_web`** (`NOBYPASSRLS`); the Neon owner role
   bypasses RLS and is for migrations only.
3. **`apps/web` reads through `@ethanel/db`'s access functions for now.** This is a deliberate,
   temporary deviation from "web never opens a DB connection". The functions return narrow
   plain objects, so when `identity-svc`, `property-svc` and `money-svc` land, each function
   becomes a `/v1` call with the same shape and the routes do not change.
4. Marketing and marketplace stay free of Clerk (no provider, no script) so `/` still prerenders
   static. Sign-in/up live in an `(auth)` route group with their own provider.
5. Session verification in tests is networkless: `CLERK_JWT_KEY` + a test-only key pair mint
   Clerk-shaped tokens for the six demo personas.

## Consequences

- Status codes: under Cache Components the response streams before a layout guard resolves,
  so a refusal renders `app/forbidden.tsx` with HTTP 200 and none of the target's data; a
  signed-out visitor still gets a real 307 from `proxy.ts`. A real 403 would need the
  membership check in the proxy, i.e. a database read per request there; declined (Q-27).

- `QUESTIONS.md` Q-22 tracks the removal of direct DB access from `apps/web`.
- `DATABASE_URL` and the Clerk keys are runtime configuration of `web`; CI uses a placeholder
  production-format publishable key and a Postgres service container.
- A dedicated Neon role per service (`identity_svc`, …) replaces `ethanel_web` when services
  arrive; the RLS policies already assume no bypass.
