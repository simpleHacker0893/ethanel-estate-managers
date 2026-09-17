import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './prisma/generated/client';

export type Db = PrismaClient;

/**
 * Prisma 7 runs on a driver adapter. Neon hosts get the serverless driver (WebSocket pool via
 * the `-pooler` endpoint); anything else (local Postgres, CI service container) gets node-pg.
 */
export function createDb(connectionString: string): Db {
  const isNeon = /\.neon\.tech(:|\/|$)/.test(connectionString);
  const adapter = isNeon
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

let cached: Db | undefined;

/**
 * Process-wide client for the web BFF and scripts. Reads `DATABASE_URL` lazily so a static
 * prerender that never touches data never needs the variable.
 */
export function db(): Db {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example and point it at Neon or a local Postgres.',
    );
  }
  cached = createDb(url);
  return cached;
}
