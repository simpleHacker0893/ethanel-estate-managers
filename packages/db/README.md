# @ethanel/db

Conventions for data ownership. Empty of schema in Sprint 001.

## Rules (enforced by review and by the RLS harness in `@ethanel/testing`)

1. **One Postgres schema per service, one DB role per service**, all on one Neon project.
   `identity`, `property`, `listing`, `money`, `payments`, `messaging`, `ops`, `docs`, `billing`.
2. **No cross-schema joins or foreign keys.** A service that needs another service's data calls
   its `/v1` REST API. Denormalised copies are allowed when they carry `source_version`.
3. **Tenancy is `organization_id` + row-level security.** Every tenant table has
   `organization_id uuid not null`, an RLS policy comparing to
   `current_setting('app.organization_id', true)`, and the chassis sets that per transaction.
4. **Keys are UUIDv7** generated in application code (`@ethanel/chassis/ids`). No serials.
5. **Money columns are `bigint`** minor units (KES cents). Never `numeric`, never `float`.
6. **Postings are append-only.** Ledger tables have no `UPDATE`/`DELETE` grants for the service
   role; corrections are new postings that reference the original.
7. **Migrations are forward-only** and run by the migration runner in this package before the new
   image receives traffic (Helm pre-upgrade hook, Sprint 002).

## Layout (Sprint 002+)

```
packages/db/
├── prisma/<schema>/schema.prisma   # one Prisma schema per service schema
├── migrations/<schema>/            # SQL, forward-only, RLS policies included
├── seed/<schema>.ts                # deterministic fixtures for local and CI
└── runner.ts                       # applies pending migrations for one schema
```
