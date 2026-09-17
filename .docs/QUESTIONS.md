# QUESTIONS.md

Open questions and assumptions. An `ASSUMPTION:` item is something the build proceeds on and the
operator must confirm or correct. Nothing here appears in product copy as fact.

## Blocking for Sprint 002 (not for Sprint 001)

- **Q-01** Canonical decision list D-01 … D-53. `DECISIONS.md` holds a placeholder.
- **Q-02** Canonical site URL and public WhatsApp number.
  `// ASSUMPTION:` env `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`) and
  `NEXT_PUBLIC_WHATSAPP_NUMBER` (fallback masked `+254 7XX XXX XXX`, rendered visibly as a
  placeholder).

## Assumptions made in Sprint 001

- **Q-03** `// ASSUMPTION:` The marketplace "Lease" segment means **land leased by the year**
  (farmland and commercial plots), matching the results artboard's "Lease land", not a long-lease
  dwelling. "Short stay" means furnished, nightly or weekly, and is a fifth intent rather than a
  rental sub-type. The landing search bar shows four segments as specified; the results page shows
  five. Confirm the enum before `listing-svc` persists it.
- **Q-04** `// ASSUMPTION:` Demo SLA wording: "Thanks — we'll WhatsApp you within one working
  day." No SLA exists yet; this is copy, not a commitment. Confirm or change.
- **Q-05** `// ASSUMPTION:` "Launching in Nairobi, Kiambu, Kajiado and Machakos" is the launch
  footprint; Mombasa and Nakuru are shown as "(coming)". No dates promised.
- **Q-06** `// ASSUMPTION:` Sample organization names (Riverside Lettings, Savannah Land Co.,
  Kiambu Homes Agency, Ridgeways Property Care, Mavoko Homes, Nairobi Stays Co., Rongai Lettings)
  and the resident "Amina W." are fictional and labelled "sample" on screen. Replace only with
  real design partners who have consented.
- **Q-07** `// ASSUMPTION:` Rent run sample figures (KES 1,842,000 collected, 44 of 48 leases,
  KES 168,000 outstanding, remittance due 5 Oct) are illustrative and labelled "(sample)".
- **Q-08** `// ASSUMPTION:` Agency fee and net remittance are shown as `[per agreement]`, `[fee]`,
  `[net]` placeholders because fee structures are per management agreement and no default exists.
- **Q-09** `// ASSUMPTION:` Node pinned to the 22 line (`.nvmrc` = `22`) because that is what CI
  and the build container verified against. Move to 24 LTS when the Docker base image and
  `engines` are bumped together.
- **Q-10** `// ASSUMPTION:` `/sign-in` is a heading-only placeholder; Clerk's hosted page replaces
  it in Sprint 002.
- **Q-11** `// ASSUMPTION:` Rate limit for the demo action is 5 requests per IP per 10 minutes,
  in-memory. Valkey-backed limiter arrives with the gateway.
- **Q-12** `// ASSUMPTION:` Budget bands on the search bar (per month for To let, total for For
  sale and Land, per year for Lease, per night for Short stay) are the artboard's bands and carry
  no pricing claim.
- **Q-13** `// ASSUMPTION:` Marketplace results sort "Nearest" is a no-op in Sprint 001 (no
  geolocation); it falls back to "Newest" and is labelled as such in the empty-state helper.
- **Q-14** `// ASSUMPTION:` "Kiswahili (coming)" is shown in the footer; no translation timeline.
- **Q-19** `// ASSUMPTION:` Sample listing prices in `content/listings.ts` are whole-shilling
  `number`s used only to filter and display marketing samples. Ledger money stays `bigint` minor
  units; listing-svc will expose `priceMinor` as a string of minor units in its contract.
- **Q-21** `// ASSUMPTION:` The WhatsApp mock header uses the classic WhatsApp teal `#075E54`
  instead of the brief's `#128C7E`, because white 15px text on `#128C7E` is 4.13:1 and fails axe
  (serious). Chip text uses a new `teal-700` for the same reason; `teal` stays for dots and bars.
- **Q-20** `// ASSUMPTION:` The chassis and web use ESLint 9 (the last line `eslint-plugin-jsx-a11y`
  supports). Renovate will move the repo to ESLint 10 when that plugin publishes support.

## Assumptions made in Sprint 002

- **Q-22** `// ASSUMPTION:` Pricing tiers and KES amounts in `content/pricing.ts` (Free KES 0 up
  to 5 units; Starter KES 2,500/month up to 50; Growth KES 9,500/month up to 300; Enterprise
  custom) are introductory placeholders drafted for review and labelled "Introductory pricing,
  subject to change" on the page. Confirm or replace before any agreement quotes them.
- **Q-23** `// ASSUMPTION:` Scene photos are hotlinked from Unsplash through the API under the
  Unsplash licence (attribution with UTM links, download endpoint triggered on render, no
  redistribution). If the licence terms or hotlinking are not acceptable, switch the manifest
  entries to `source: 'illustration'` or to owned photos in `public/`.
- **Q-24** `// ASSUMPTION:` NVIDIA endpoints: chat `POST {NVIDIA_CHAT_BASE_URL}/chat/completions`
  with model `nvidia/nemotron-3-super-120b-a12b`; Parakeet ASR via NVCF function
  `1598d209-5e27-4d3c-8079-4751568b1081` at `/v1/audio/transcriptions`; Magpie TTS via NVCF
  function `877104f7-e885-42b9-8de8-f6e4c6303969` at `/v1/audio/speech` (the hosted Magpie API
  is documented as gRPC, so the HTTP call may return non-audio; the widget then uses the
  browser voice). None could be called from the build sandbox. Verify on build.nvidia.com and
  correct the env defaults.
- **Q-25** `// ASSUMPTION:` Photo choices in `content/images.ts` are unverified in the sandbox
  (photo hosts unreachable). Review on staging with `UNSPLASH_ACCESS_KEY` set: `about-story`
  `ZY0u6We7rDE`, `about-kenya` `jTyDovBPQ4k`, `about-launch` `e-oZ4yQelik`,
  `solutions-letting-firms` `1Uwcoo-ttjY`; every other slot resolves by search query
  (solutions-_, company/careers/press heroes, press-story-_, the 16 `listing-*` slots keyed by
  property type and setting). Portraits are illustration-only with initials until real photos
  are supplied.
- **Q-26** `// ASSUMPTION:` About page facts as told by the operator: founded 2024 in Kiambu
  County by Loise Ndirangu and Racheal Wangui (sisters, advocates) with Njuguna Njenga as Chief
  Technology Officer; the story is limited to their property and land-transaction experience.
  Nothing else about the team is claimed. Confirm spellings and titles.
- **Q-27** `// ASSUMPTION:` Press case studies are illustrative: fictional organizations
  (Kiambu letting firm, Kajiado land-selling company, a landlord) with example figures, each
  carrying the "Illustrative — example figures, not customer data" tag. Press contact
  (`press@ethanel.example`) and spokesperson are placeholders.
- **Q-28** `// ASSUMPTION:` Sample listing coordinates are approximate town or estate centres,
  good enough to open Google Maps in the right neighbourhood, never a parcel. `listing-svc`
  will carry surveyed coordinates per listing.
- **Q-29** `// ASSUMPTION:` Search is nationwide across all 47 counties with a free-text area
  (Q-05's "(coming)" labels are withdrawn). The 76 sample listings in `content/listings.ts` are
  original, written after a reference pass over Kenyan property sites for style only; no
  advert, description, address or photo was copied; managing organizations are fictional and
  labelled "Sample listing" on every card. Replace with `listing-svc` data, never with scraped
  adverts.
- **Q-30** `// ASSUMPTION:` "Sign in to …" gating (viewings, listing a property, alerts) is a
  page that validates and displays `next` until Clerk lands; the marketplace search stays
  public. Clerk's `afterSignInUrl` must honour the same-origin `next` path.
- **Q-31** `// ASSUMPTION:` Assistant rate limits are 30 chat turns and 20 media calls per IP
  per 10 minutes, in-memory (same caveat as Q-11). Conversations are not stored anywhere.

## Product questions for later sprints

- **Q-15** Which Clerk organization roles map to owner / staff / caretaker, and can a caretaker
  belong to more than one organization?
- **Q-16** Notice period and lease termination rules per county, for the leases domain.
- **Q-17** Does a land-selling company ever run a rent roll (mixed organization), and does that
  change pricing?
- **Q-18** M-Pesa integration path: Daraja STK Push + C2B on an Ethanel Paybill, or per-organization
  Paybills?
