# Sprint 002 — Acceptance

Checked in the sandbox unless marked **staging**. Automated items are in
`packages/testing/e2e/smoke.spec.ts` (55 tests, all passing on the final commit).

## Build and tooling

- [x] `pnpm turbo run lint typecheck build` passes with zero warnings.
- [x] `next build`: `/pricing`, `/demo`, `/trust`, `/privacy`, `/terms`, `/design-partners`
      static (○); `/`, `/marketplace`, `/sign-in`, `/solutions/*`, `/about`, `/company`,
      `/careers`, `/press` partial prerender (◐, photo slots); `/api/assistant/*` dynamic (ƒ).
- [x] No `middleware.ts`; no `export const dynamic|revalidate|fetchCache`.
- [x] Every new string lives in `content/*.ts`; figures carry `introductory` / `illustrative` /
      `sample` labels rendered on screen.

## Brand

- [x] Header, mobile nav, footer and OG image show "Ethanel" with "Estate Managers" beneath.
- [x] Copyright reads "© 2026 Ethanel Estate Managers · Nairobi, Kenya"; JSON-LD carries the
      legal name and `alternateName`.

## Images

- [x] Every scene renders an illustration without `UNSPLASH_ACCESS_KEY`; no broken images.
- [ ] **staging** With the key set, photos render with attribution and the manifest's
      `photoId`s are reviewed (list in QUESTIONS Q-25).

## Solutions, About, Company

- [x] `/solutions/<role>` for all five roles; the current tab has `aria-current="page"`.
- [x] `/about` names Loise Ndirangu, Racheal Wangui, Njuguna Njenga, 2024, Kiambu County and
      nothing beyond what the operator told us.
- [x] `/company` contact form validates with the contract, rate-limits, and shows a status on
      success; `/careers`, `/press` (illustrative tag on every case study), `/design-partners`,
      `/trust`, `/privacy`, `/terms` are complete pages.

## Marketplace

- [x] County select lists all 47 counties plus "Anywhere in Kenya"; area text filters;
      no "(coming)" labels remain.
- [x] 76 sample listings across rent, sale, land, lease, short-stay; a Kisumu rental search
      returns results; every card shows status, listed date, map link with coordinates,
      WhatsApp enquiry link with intro, "Sample listing", and "Book a viewing" → sign-in.
- [x] `/sign-in?next=…` accepts only same-origin paths and says what the visitor was doing.

## Pricing

- [x] Four tiers Free → Enterprise, introductory label visible, matrix and FAQ, CTAs to `/demo?tier=`.

## Demo questionnaire

- [x] Four screens validate before advancing; errors `aria-live`; the error line keeps its height
      so the pointer never lands on a moved control; success screen; lead logged without PII.

## Assistant

- [x] `/api/assistant/status` reports `demo` without a key; chat streams SSE with a suggestion
      link for "2-bedroom to rent in Kisumu"; transcribe returns the canned line; speak → 501.
- [x] Widget: opens from a labelled launcher, `role="dialog"`, log `aria-live`, demo banner,
      suggestion chip navigates, mic and speaker buttons labelled, Escape closes and focus
      returns. axe: zero serious/critical with the dialog open.
- [ ] **staging** With `NVIDIA_API_KEY`: `curl -N` the chat route streams Nemotron tokens; a
      recorded clip transcribes; speak returns audio or falls back to the browser voice.
      Correct any function id in QUESTIONS Q-24.

## Accessibility

- [x] axe zero serious/critical on `/`, `/marketplace`, `/about`, `/solutions/landlords`,
      `/pricing`, `/demo` and with the assistant open.
