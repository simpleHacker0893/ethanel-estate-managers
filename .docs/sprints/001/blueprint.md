# Sprint 001 — Blueprint

## Repository layout

See `.docs/ARCHITECTURE.md` for the topology and the master layout. Sprint 001 creates every
folder with at least a README so later sprints add code without moving anything.

## `apps/web`

```
apps/web/
├── app/
│   ├── globals.css                    @import "tailwindcss"; @import "@ethanel/ui/theme.css"; preset
│   ├── layout.tsx                     Server. html lang, Fraunces/Manrope, NextIntlClientProvider, NuqsAdapter, skip link
│   ├── not-found.tsx error.tsx global-error.tsx   error.tsx / global-error.tsx are Client (Next requires it)
│   ├── (marketing)/
│   │   ├── layout.tsx                 Server. <Header/> <main id="main"> <Footer/>
│   │   ├── page.tsx                   Server. Composes _sections in order; generateMetadata; JSON-LD
│   │   ├── opengraph-image.tsx        Server. ImageResponse 1200×630
│   │   ├── _sections/                 Server: hero, doors, how-it-works, what-you-get, marketplace-preview, trust, pricing-teaser, final-cta
│   │   ├── _components/               Server: rent-run-card, whatsapp-bubble, listing-card, ledger-illustration, eyebrow, section
│   │   │                              Client: demo-form.tsx, marketplace-search-bar.tsx
│   │   ├── actions/request-demo.ts    'use server'
│   │   └── products|solutions|company|about|pricing|demo|careers|press|trust|privacy|terms|sign-in/page.tsx   Server placeholders
│   ├── (marketplace)/marketplace/
│   │   ├── page.tsx                   Server. Awaits searchParams inside <Suspense>; passes parsed params to cached results
│   │   ├── _components/               Server: results-grid, listing-card (reused), empty-state, alerts-band
│   │   │                              Client: marketplace-filters.tsx (nuqs), sort-select.tsx (inside filters)
│   │   └── loading.tsx                Server. Skeleton grid
│   ├── (app)/org/[orgSlug]/layout.tsx page.tsx   Server placeholders (live reads later)
│   ├── (portal)/landlord/layout.tsx page.tsx     Server placeholders
│   ├── (resident)/me/layout.tsx page.tsx         Server placeholders
│   └── api/health/route.ts            GET → { ok: true, sha }
├── components/
│   ├── site/                          Server: header.tsx, mega-menu.tsx, footer.tsx, logo.tsx  · Client: mobile-nav.tsx
│   └── motion/reveal.tsx              Server wrapper emitting CSS-only entrance classes (no JS)
├── content/landing.ts nav.ts listings.ts   typed copy and sample data
├── lib/env.ts rate-limit.ts demo-requests.ts analytics.ts i18n/request.ts jsonld.ts
├── messages/en.json
├── instrumentation.ts
├── next.config.ts  Dockerfile  .env.example  eslint.config.js  tsconfig.json  postcss.config.mjs
```

## Server / Client boundary

Client files (exactly): `components/site/mobile-nav.tsx`, `(marketing)/_components/demo-form.tsx`,
`(marketing)/_components/marketplace-search-bar.tsx`, `(marketplace)/marketplace/_components/marketplace-filters.tsx`,
plus `app/error.tsx` and `app/global-error.tsx` (framework requirement). Everything else is a
Server Component. Hover mega-menus are CSS `:hover`/`:focus-within` with a tiny inline script for
Escape and focus return (no React state).

## Caching

- `/`: no request API, prerenders static. The Server Action is imported by a client component and
  does not affect prerendering.
- `/marketplace`: `page.tsx` awaits `searchParams` inside a `<Suspense>` boundary; `ResultsGrid`
  is `'use cache'` keyed by the parsed, normalised params with `cacheLife('hours')` and
  `cacheTag('listings')`.

## Contracts

- `packages/contracts/marketplace-search.ts`: nuqs parsers (`nuqs/server`) for
  `intent | where | type | budget | sort | beds | plot | amenities`, `loadMarketplaceSearch`
  loader, and a zod schema mirroring them.
- `packages/contracts/demo-request.ts`: `{ email }` zod schema; error map with user-facing text.

## Demo action

`request-demo.ts` → parse with contract → `rateLimit(ip)` from `headers()` → `demoRequests.save()`
(interface: `LogAndWebhookSink` now, `billing-svc` later) → `{ ok: true } | { ok: false; error }`.
No `redirect()`.

## Motion

CSS-only. `.reveal` elements start `opacity:0; translateY(12px)` and animate on first view using
`animation-timeline: view()` where supported, with a `@supports not` fallback that renders them
visible. Cards stagger via `--i` custom property × 60ms. `prefers-reduced-motion` disables all.

## Testing

`packages/testing/e2e/smoke.spec.ts`: all listed routes 200; `/` has exactly one `h1`; axe on `/`
and `/marketplace` with zero serious/critical; no console errors. `playwright.config.ts` starts
`next start` from `apps/web` on port 3100.
