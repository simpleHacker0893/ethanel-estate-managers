# @ethanel/testing

- `e2e/` — Playwright smoke and accessibility specs against the built web app (`next start`).
- `tenancy/` — cross-organization RLS harness scaffold (E3), implemented in Sprint 002.
- `fixtures/` — deterministic data shared by both.

Run locally after `pnpm turbo build`:

```
pnpm --filter @ethanel/testing test
```

CI installs Chromium with `playwright install --with-deps chromium`; locally the config honours
`PLAYWRIGHT_BROWSERS_PATH` when set.
