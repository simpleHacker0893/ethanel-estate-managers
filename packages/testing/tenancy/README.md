# Tenancy harness (E3) — scaffold

Sprint 002 implements this against `identity-svc`. The harness proves, for every service, that:

1. A request scoped to organization A can never read, count or mutate a row of organization B,
   through the API, through Prisma, and through raw SQL under the service role.
2. A transaction with no `app.organization_id` set returns zero tenant rows.
3. Every tenant table in the service schema has RLS enabled and forced (`FORCE ROW LEVEL SECURITY`).

Shape:

```
tenancy/
├── harness.ts        # spins two organizations, seeds one row each, runs the matrix
├── matrix.ts         # table × operation × scope → expected outcome
└── <service>.spec.ts # one spec per service, generated from the service's Prisma schema
```
