import 'dotenv/config';

import { createDb } from './client';
import { fixtureRows, rowToSql } from './fixtures';
import { withScope } from './scope';

/**
 * Writes the deterministic fixtures into the database at `DATABASE_URL`. Idempotent.
 * Global rows (organizations, users) go first; every tenant row is written inside the
 * organization's RLS scope, exactly as the application would.
 *
 *   pnpm --filter @ethanel/db seed
 */
async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const db = createDb(url);
  const rows = fixtureRows();

  const byOrganization = new Map<string | null, string[]>();
  for (const row of rows) {
    const list = byOrganization.get(row.organizationId) ?? [];
    list.push(rowToSql(row));
    byOrganization.set(row.organizationId, list);
  }

  let written = 0;
  for (const [organizationId, statements] of byOrganization) {
    const scope = organizationId ? { organizationId } : {};
    await withScope(db, scope, async (tx) => {
      for (const sql of statements) written += await tx.$executeRawUnsafe(sql);
    });
  }
  console.warn(JSON.stringify({ level: 'info', event: 'db_seed', rows: rows.length, written }));
  await db.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
