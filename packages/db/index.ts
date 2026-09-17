/**
 * @ethanel/db — Prisma 7 client, RLS scope helper, deterministic fixtures and the data-access
 * layer the web BFF reads through. One Postgres schema per service (`identity`, `property`,
 * `money`), no cross-schema joins, tenancy by `organization_id` + row-level security.
 */
export { createDb, db, type Db } from './client';
export { withScope, type Scope, type ScopedTx } from './scope';
export * from './access';
export {
  DEMO_PASSWORD,
  demoMemberships,
  demoOrganizations,
  demoUsers,
  ids as fixtureIds,
  type DemoMembership,
  type DemoOrganization,
  type DemoUser,
  type Persona,
} from './fixtures';
