import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * Placeholder production-format publishable key (`clerk.ethanel.test$`). A production-shaped key
 * keeps Clerk's proxy from bouncing anonymous requests through the development handshake, and
 * the matching CLERK_JWT_KEY lets the server verify the test sessions minted in auth.spec.ts
 * without calling Clerk. The build must be made with the same publishable key.
 */
export const E2E_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuZXRoYW5lbC50ZXN0JA';
const jwtPublicKey = readFileSync(
  resolve(import.meta.dirname, 'fixtures/clerk-jwt-test-key.pub.pem'),
  'utf8',
);

/**
 * Runs against the production build of apps/web (`next start`). `pnpm turbo test` depends on
 * `build`, so `.next` exists by the time this starts. Needs DATABASE_URL (a seeded Postgres).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // A sandbox with a preinstalled Chromium sets this; CI installs the matching build instead.
        ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
          ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } }
          : {}),
      },
    },
  ],
  webServer: {
    command: `pnpm --filter web exec next start --port ${PORT}`,
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      GIT_SHA: process.env.GIT_SHA ?? 'local',
      DATABASE_URL: process.env.DATABASE_URL ?? '',
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: E2E_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? 'sk_live_e2e_placeholder_never_used',
      CLERK_JWT_KEY: jwtPublicKey,
    },
  },
});
