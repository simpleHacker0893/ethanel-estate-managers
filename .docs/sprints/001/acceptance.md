# Sprint 001 — Acceptance

Every item is checked by a human or CI before the sprint is closed. "Done" means all pass.

## Build and tooling

- [ ] `pnpm install --frozen-lockfile` succeeds on Node 22.
- [ ] `pnpm turbo run lint typecheck build` passes with zero warnings.
- [ ] `next build` output lists `/` as static (○) and every placeholder route as static.
- [ ] `/api/health` returns `{ "ok": true, "sha": "<GIT_SHA>" }` from `next start`.
- [ ] Docker image builds from `apps/web/Dockerfile`, runs as non-root with read-only root FS and
      passes its `HEALTHCHECK` (CI `image-scan` job; not verifiable in the Sprint 001 sandbox).
- [ ] Trivy reports no HIGH/CRITICAL on the image.
- [ ] A commit with a non-conventional message is rejected by commitlint.
- [ ] Importing `apps/web` from `packages/contracts` fails ESLint (boundaries).
- [ ] A `number` type in `packages/chassis/money/example.money.ts` fails ESLint.

## Landing page (`/`)

- [ ] Every string and figure comes from `content/landing.ts`; grep finds no copy in JSX.
- [ ] Exactly one `<h1>`: "Rent in. Landlords paid. Every shilling accounted for."
- [ ] Sections present in order: hero, doors, how it works, what you get, marketplace preview,
      trust, pricing teaser, final CTA; each `<section aria-labelledby>`.
- [ ] Backgrounds: nav/hero/how/CTA `navy-950`, canvas `mist-50`, marketplace band `mist-100`,
      pricing `iris-50`, footer `ink`. No `#000`.
- [ ] Buttons 50px / radius 10 / Manrope 600 15px; primary iris-700, accent pink-500 with navy
      text, secondary white + mist-200 stroke, ghost transparent + lavender stroke; focus ring
      2px pink-500 offset 2.
- [ ] Cards radius 16, white, 1px mist-200, no shadow at rest, hover lift.
- [ ] Fraunces only on headings; every KES figure `tabular-nums`.
- [ ] Hero 7/5 split, copy left, `RentRunCard` and `WhatsAppBubble` never overlap; bubble hidden
      below 768px.
- [ ] Mega-menus open on hover and focus, close on Escape with focus returned to the trigger,
      `aria-expanded` toggles, panel has `role="menu"`.
- [ ] Below 1024px the Sheet nav opens from the right with 56px rows, accordions per group and
      "Book a demo" pinned at the bottom.
- [ ] Search bar: four segments, three Selects whose budget options follow the segment, Search
      navigates to `/marketplace?intent=…&where=…&type=…&budget=…`.
- [ ] Demo form: submitting an invalid email shows an inline error with `aria-live="polite"` and a
      coral stroke; a valid email replaces the form with the thank-you line; `aria-busy` during
      submission; the 6th submission from one IP within 10 minutes is rejected with a message.
- [ ] Skip link is the first focusable element and targets `#main`.
- [ ] `prefers-reduced-motion: reduce` disables the entrance animation.
- [ ] No emoji, no "tenant", no "Scroll to explore", no gradient text.

## Marketplace results (`/marketplace`)

- [ ] Reads `intent`, `where`, `type`, `budget`, `sort` from the URL via the contract parsers.
- [ ] Changing a segment or filter updates the URL and the result count without a full reload.
- [ ] Empty state renders the canvas copy with "Widen budget" and "Get WhatsApp alert".
- [ ] Every card is labelled sample; note "Prices and listings shown are samples for illustration."

## Tests (CI)

- [ ] Playwright: every listed route returns 200.
- [ ] Playwright: `/` has exactly one `h1`; no console errors on `/` or `/marketplace`.
- [ ] axe: zero serious or critical violations on `/` and `/marketplace`.

## Documentation

- [ ] `.docs/QUESTIONS.md` lists every assumption made; none appears as fact in copy.
- [ ] `.docs/sprints/001/handoff.md` names Sprint 002's scope.
