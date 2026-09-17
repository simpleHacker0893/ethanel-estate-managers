# @ethanel/db

Prisma 7 on Neon. One Postgres schema per service, one role per service, RLS on every tenant
table. Sprint 002 ships `identity`, `property` and `money` with the data-access functions the web
BFF reads through (temporary, see `.docs/adr/ADR-001-clerk-neon-prisma-in-web.md`).

## Rules (enforced by the migration and by `packages/testing/e2e/auth.spec.ts`)

1. **One Postgres schema per service, one DB role per service**, all on one Neon project.
   `identity`, `property`, `listing`, `money`, `payments`, `messaging`, `ops`, `docs`, `billing`.
2. **No cross-schema joins or foreign keys.** A service that needs another service's data calls
   its `/v1` REST API. Denormalised copies are allowed (`units.landlord_id`, `leases.property_id`,
   `postings.lease_id`) so every RLS policy reads its own table only.
3. **Tenancy is `organization_id` + row-level security**, `ENABLE` and `FORCE` on every tenant
   table. Policies compare against transaction-local settings that `withScope()` sets:
   `app.organization_id`, `app.user_id`, `app.landlord_ids`, `app.lease_ids`, `app.unit_ids`,
   `app.property_ids`. A transaction outside `withScope()` sees zero tenant rows.
4. **The application never connects as the Neon owner.** `neondb_owner` has `BYPASSRLS`; the
   app uses `ethanel_web` (`NOBYPASSRLS`, table grants only). Migrations use the owner.
5. **Keys are UUIDv7** generated in application code. No serials.
6. **Money columns are `bigint`** minor units (KES cents). Never `numeric`, never `float`.
7. **Postings are append-only.** `money.postings` has SELECT and INSERT policies only; with
   forced RLS there is no way to UPDATE or DELETE a posting from the application role.
8. **Migrations are forward-only** SQL under `prisma/migrations`, applied with
   `prisma migrate deploy` over the direct (non-pooled) connection.

## Layout

```
packages/db/
├── prisma.config.ts               # Prisma 7 CLI config (reads DATABASE_URL / DATABASE_URL_UNPOOLED)
├── prisma/schema.prisma           # three schemas via @@schema
├── prisma/migrations/             # SQL, forward-only, RLS policies included
├── prisma/generated/              # `pnpm build` (prisma generate); gitignored
├── client.ts                      # createDb(): Neon serverless adapter or node-pg by host
├── scope.ts                       # withScope(): transaction-local RLS settings
├── access.ts                      # data-access functions returning narrow plain objects
├── fixtures.ts                    # deterministic demo data (six personas, two organizations)
├── seed.ts                        # writes the fixtures inside each organization's scope
└── scripts/seed-sql.ts, seed-clerk.ts
```

## Commands

```
pnpm --filter @ethanel/db build            # prisma generate
pnpm --filter @ethanel/db migrate:deploy   # DATABASE_URL_UNPOOLED (direct endpoint)
pnpm --filter @ethanel/db seed             # DATABASE_URL, idempotent
pnpm --filter @ethanel/db seed:sql         # same rows as SQL (psql, Neon console, Neon MCP)
pnpm --filter @ethanel/db seed:clerk       # CLERK_SECRET_KEY: demo users + organizations in Clerk, ids linked
```

Local Postgres for development and CI: role `ethanel` (non-superuser), database `ethanel`,
`DATABASE_URL=postgresql://ethanel:ethanel@127.0.0.1:5432/ethanel`.
