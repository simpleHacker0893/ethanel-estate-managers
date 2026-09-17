# Sprint 001 — Requirements

**Goal.** Lay the monorepo foundation for the whole Ethanel platform and ship the marketing
landing page and the marketplace results page inside it, such that nothing laid down now moves
when the dashboard, the ledger or the marketplace services arrive.

## In scope

1. **Monorepo skeleton**: pnpm + Turborepo; `apps/web`, `apps/gateway` (placeholder); nine
   `services/*` and four `workers/*` placeholders with the service contract README; packages
   `contracts`, `chassis` (stubbed surface), `ui`, `config`, `db`, `testing`; `charts/service`
   library chart; `infra/*` OpenTofu module folders; CI, staging and production workflows;
   Renovate; Husky + lint-staged + commitlint; `.docs/` Operating Pack.
2. **House rules in tooling**: strict TS flags; `@/*` alias to app root; ESLint boundaries; money
   `bigint` rule; conventional commits.
3. **Design system**: `packages/ui/theme.css` tokens (colours, fonts, radii), shadcn-style
   `Button`, `Sheet`, `Select`, `Accordion` on the Ethanel theme.
4. **Landing page** at `/`: header with mega-menus and mobile Sheet, hero with `RentRunCard` and
   `WhatsAppBubble`, dual door, how it works, bento, marketplace preview with `MarketplaceSearchBar`
   and three `ListingCard`s, trust with `LedgerIllustration`, pricing teaser, final CTA with
   `DemoForm` and Server Action, footer. Copy verbatim from `content/landing.ts`. Matches the
   canvas artboard "Landing / Desktop 1440".
5. **Marketplace results** at `/marketplace`: segments, filters, sort, sample listings filtered by
   URL params (nuqs parsers from `@ethanel/contracts`), empty state, alerts band. Matches the
   artboard "Marketplace / Results 1440".
6. **Placeholder routes** (heading only): `/products`, `/solutions`, `/company`, `/about`,
   `/pricing`, `/demo`, `/careers`, `/press`, `/trust`, `/privacy`, `/terms`, `/sign-in`, plus
   layouts for `(app)/org/[orgSlug]`, `(portal)/landlord`, `(resident)/me`.
7. **Operability**: `/api/health` → `{ ok, sha }`; `instrumentation.ts` OTel stub; multi-stage
   Dockerfile, non-root, read-only FS, `HEALTHCHECK`.
8. **SEO/a11y**: `generateMetadata`, `opengraph-image.tsx`, JSON-LD `Organization` +
   `SoftwareApplication`; skip link, landmarks, one `<h1>`, `aria-labelledby` per section.
9. **Tests**: Playwright + axe smoke suite in `@ethanel/testing`, run in CI.

## Out of scope (queued in `handoff.md`)

Clerk, Prisma 7, TanStack Query, AG Grid, MapLibre, Serwist, chassis implementation, Helm
consuming charts, `identity-svc`, the RLS harness implementation, the designed sub-pages.

## Constraints

- Next.js 16.x, React 19, `cacheComponents: true`, Turbopack, no `webpack` key, no
  `export const dynamic|revalidate|fetchCache`, `proxy.ts` not `middleware.ts` (neither this sprint).
- Only client components: `mobile-nav.tsx`, `demo-form.tsx`, `marketplace-search-bar.tsx`, and
  the results-page filter panel (`marketplace-filters.tsx`) added when results came into scope.
- `/` prerenders static; the demo Server Action must not make it dynamic.
- No fabricated fees, tiers, SLAs, customer counts or "verified" claims; assumptions go to
  `.docs/QUESTIONS.md`.
