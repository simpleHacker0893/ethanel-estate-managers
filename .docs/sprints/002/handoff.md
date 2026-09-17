# Sprint 002 — Handoff

## What Sprint 002 delivered

Brand lockup, image pipeline with illustration fallback, Solutions/About/Company/Careers/Press/
Design partners/Trust/Privacy/Terms pages, four-tier pricing, nationwide marketplace on 76 sample
listings with status, dates, map pins, WhatsApp enquiries and sign-in handoff, the book-a-demo
questionnaire, and the NVIDIA-backed assistant with voice and a demo mode. 55 smoke tests.

## Before staging sign-off

1. Set `UNSPLASH_ACCESS_KEY`; review every photo in `content/images.ts` (Q-25). Swap a
   `photoId` or `query` in the manifest; no code change needed.
2. Set `NVIDIA_API_KEY`; run the staging checks in `acceptance.md`; confirm or correct the
   function ids (Q-24). `ASSISTANT_DEMO_MODE=true` keeps the script if the key must stay off.
3. Confirm the introductory prices (Q-22), the founders' wording (Q-26) and the press contact
   (Q-27).
4. Default branch on GitHub → `main` (Settings → Branches); the sandbox could not change it.

## What Sprint 003 adds

Unchanged from the Sprint 001 handoff list: chassis, Helm, `identity-svc`, Clerk (`proxy.ts`,
honour `/sign-in?next=`), Prisma, RLS harness. Then `listing-svc` replaces `content/listings.ts`
behind the same `ListingSummary` contract, and `assistant-svc` can take over
`app/api/assistant/*` behind the same provider interfaces.

## Handoff prompt for the Builder (Sprint 003)

> Read `.docs/AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `RISKS.md`, `QUESTIONS.md`, then
> `sprints/002/{requirements,blueprint,acceptance,handoff}.md`. Close the staging items in
> `sprints/002/acceptance.md` first. Then implement `@ethanel/chassis` and `identity-svc` as the
> Sprint 001 handoff describes, and wire Clerk so that `/sign-in?next=` returns the visitor to
> the marketplace action they started.
