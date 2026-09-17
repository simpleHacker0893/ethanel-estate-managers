import 'dotenv/config';

import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 CLI configuration for `@ethanel/db`.
 *
 * - `DATABASE_URL` is the pooled Neon string the application uses.
 * - `DATABASE_URL_UNPOOLED` (no `-pooler` in the host) is what `prisma migrate` needs; it falls
 *   back to `DATABASE_URL` for a local Postgres where both are the same.
 * - Migrations are forward-only SQL and include the RLS policies (see migrations/README.md).
 */
const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx seed.ts',
  },
  datasource: {
    url: migrationUrl,
  },
});
