import { seedSql } from '../fixtures';

/** Prints the seed as plain SQL: `pnpm --filter @ethanel/db seed:sql > seed.sql`. */
process.stdout.write(`${seedSql()}\n`);
