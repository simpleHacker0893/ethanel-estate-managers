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

## Product questions for later sprints

- **Q-15** Which Clerk organization roles map to owner / staff / caretaker, and can a caretaker
  belong to more than one organization?
- **Q-16** Notice period and lease termination rules per county, for the leases domain.
- **Q-17** Does a land-selling company ever run a rent roll (mixed organization), and does that
  change pricing?
- **Q-18** M-Pesa integration path: Daraja STK Push + C2B on an Ethanel Paybill, or per-organization
  Paybills?
