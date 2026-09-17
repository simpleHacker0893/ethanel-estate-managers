# @ethanel/testing

- `e2e/smoke.spec.ts` — every route 200, one `h1`, axe on `/` and `/marketplace`, no console errors.
- `e2e/auth.spec.ts` — authentication, authorization and tenancy isolation across the six demo
  personas: anonymous redirects, forged sessions rejected, unknown people refused, owner vs
  staff vs caretaker vs landlord vs resident, organization A never sees organization B.
- `fixtures/` — the demo persona mirror and a **test-only** RSA key pair used to mint
  Clerk-shaped session tokens (`CLERK_JWT_KEY` verification, no network).
- `tenancy/` — cross-organization RLS harness scaffold (E3); the SQL matrix is exercised by the
  auth spec through the web app today.

Run locally against a seeded Postgres (see `packages/db/README.md`):

```
export DATABASE_URL=postgresql://ethanel:ethanel@127.0.0.1:5432/ethanel
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZXRoYW5lbC50ZXN0JA   # e2e placeholder, see playwright.config.ts
pnpm turbo build
pnpm --filter @ethanel/testing test
```

The build and the test server must share the placeholder publishable key; `next build` inlines
it. CI installs Chromium with `playwright install --with-deps chromium`; locally the config
honours `PLAYWRIGHT_CHROMIUM_EXECUTABLE` when set.
