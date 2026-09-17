# Manual test plan — staging

Run by a person on the staging deployment with real Clerk, Neon, Unsplash and NVIDIA keys. Each
case has an ID, preconditions, steps, expected result and a box. Record the build SHA from
`/api/health` at the top of every run.

Build SHA: `________` · Date: `________` · Tester: `________`

## M-AUTH — sign-in and routing (Clerk, real instance)

| ID       | Steps                                                                                       | Expected                                                                                 | Pass |
| -------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---- |
| M-AUTH-1 | Sign in as `demo.admin@ethanel.co.ke` with the landing-page password.                       | Lands on `/org/riverside-lettings`; header shows the organization name and `UserButton`. | [ ]  |
| M-AUTH-2 | As admin open `/org/riverside-lettings/settings`.                                           | People list with six rows; roles shown; caretaker email present.                         | [ ]  |
| M-AUTH-3 | Sign in as `demo.staff@…`, then `demo.caretaker@…`.                                         | Dashboard renders; no Settings link; typing `/settings` shows the forbidden page.        | [ ]  |
| M-AUTH-4 | Sign in as `demo.landlord@…`.                                                               | `/landlord`: statement for Grace Wanjiru, KES 238,280 collected; no Ridgeways Villas.    | [ ]  |
| M-AUTH-5 | Sign in as `demo.resident@…`.                                                               | `/me`: Riverside Court · B4, receipts, "Kitchen tap leaking" repair; no other unit.      | [ ]  |
| M-AUTH-6 | Sign in as `demo.savannah@…`; open `/org/riverside-lettings`.                               | Own dashboard ok; the other organization shows the forbidden page and none of its names. | [ ]  |
| M-AUTH-7 | Sign up with a brand-new email that is not seeded.                                          | `/after-sign-in` shows the "no access" explanation, never a dashboard.                   | [ ]  |
| M-AUTH-8 | Sign up with `demo.admin@ethanel.co.ke` on a second Clerk account (if the instance allows). | Refused: the seeded row is already linked; no dashboard. (P2-04)                         | [ ]  |
| M-AUTH-9 | Sign out from the `UserButton`; press back.                                                 | Protected page redirects to `/sign-in`; nothing cached.                                  | [ ]  |

## M-NEXT — marketplace hand-off

| ID       | Steps                                                          | Expected                                                                   | Pass |
| -------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | ---- |
| M-NEXT-1 | On `/marketplace` click "Book a viewing" on any card, sign in. | Returned to the same listing (`/marketplace?listing=…`).                   | [ ]  |
| M-NEXT-2 | Open `/sign-in?next=%2F%5Cevil.com` and sign in.               | Stays on the site (after P2-01 fix); before the fix, record where it goes. | [ ]  |
| M-NEXT-3 | Open `/sign-in?next=https%3A%2F%2Fevil.com`.                   | No "Sign in to …" banner; sign-in lands on `/after-sign-in` routing.       | [ ]  |

## M-MONEY — figures on live screens

| ID        | Steps                                                                                   | Expected                                                                                | Pass |
| --------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---- |
| M-MONEY-1 | Admin dashboard, rent run tiles.                                                        | Collected KES 474,000; outstanding = expected − collected; leases paid ≤ leases billed. | [ ]  |
| M-MONEY-2 | Insert one `payment` posting for a Riverside lease in Neon (SQL, inside the org scope). | Reload shows the new figure immediately (no cache); ledger tail lists it first.         | [ ]  |
| M-MONEY-3 | Insert a `reversal` referencing an `agency_fee` posting for landlord Grace.             | `/landlord` fees drop by that amount; the reversal line shows the original reference.   | [ ]  |
| M-MONEY-4 | Every KES figure on `/org/*`, `/landlord`, `/me`.                                       | Thousands separators, cents only when non-zero, `tabular-nums` alignment in tables.     | [ ]  |

## M-ASSIST — assistant with `NVIDIA_API_KEY`

| ID         | Steps                                                           | Expected                                                                                   | Pass |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---- |
| M-ASSIST-1 | `GET /api/assistant/status`.                                    | `mode: live`, model name as configured.                                                    | [ ]  |
| M-ASSIST-2 | `curl -N` the chat route with "2-bedroom to rent in Kisumu".    | Tokens stream; final `suggestion` event links to `/marketplace?intent=rent&county=kisumu`. | [ ]  |
| M-ASSIST-3 | Ask "What does Ethanel charge?" and "Which firms use Ethanel?". | No fee, tier or partner invented; points to pricing page / demo. (R-13)                    | [ ]  |
| M-ASSIST-4 | Record a 5-second clip in the widget.                           | Transcript appears; or a clear fallback message. Correct Q-24 if the id is wrong.          | [ ]  |
| M-ASSIST-5 | Press the speaker on a reply.                                   | Server audio plays, or the browser voice is used without an error toast.                   | [ ]  |
| M-ASSIST-6 | Send 31 messages quickly.                                       | 31st refused with the "too many messages" line; recovers after 10 minutes.                 | [ ]  |

## M-IMG — photos with `UNSPLASH_ACCESS_KEY`

| ID      | Steps                                                   | Expected                                                                                                    | Pass |
| ------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---- |
| M-IMG-1 | Open `/`, `/about`, each `/solutions/<role>`, `/press`. | Every scene shows a photo with attribution; none off-brand (R-11); note ids to swap in `content/images.ts`. | [ ]  |
| M-IMG-2 | Remove the key, redeploy.                               | Every slot shows the illustration; no broken image; no console error.                                       | [ ]  |

## M-LEAD — forms

| ID       | Steps                                                               | Expected                                                                   | Pass |
| -------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---- |
| M-LEAD-1 | Landing demo form, invalid then valid email.                        | Inline error; success line; webhook (if set) receives JSON without the IP. | [ ]  |
| M-LEAD-2 | `/company` contact form, fill the hidden `website` field.           | Silently accepted as success, nothing logged as a lead (honeypot).         | [ ]  |
| M-LEAD-3 | `/demo?tier=growth` questionnaire, all four screens, keyboard only. | Errors `aria-live`; focus never lands on a moved control; success screen.  | [ ]  |
| M-LEAD-4 | Submit the demo form 6 times in 10 minutes.                         | 6th refused with the wait time; WhatsApp link offered.                     | [ ]  |

## M-A11Y and responsive

| ID       | Steps                                                                          | Expected                                                                          | Pass |
| -------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ---- |
| M-A11Y-1 | axe DevTools on `/`, `/marketplace`, `/pricing`, `/org/…`, `/landlord`, `/me`. | Zero serious/critical.                                                            | [ ]  |
| M-A11Y-2 | 390 px viewport: mobile nav, marketplace filters, dashboard tables.            | No horizontal scroll except tables in their own scroll box.                       | [ ]  |
| M-A11Y-3 | Keyboard only through header → search bar → results → assistant.               | Visible focus everywhere; Escape closes the assistant, focus returns to launcher. | [ ]  |

## M-OPS

| ID      | Steps                               | Expected                                                                   | Pass |
| ------- | ----------------------------------- | -------------------------------------------------------------------------- | ---- |
| M-OPS-1 | `curl -I https://<staging>/`        | HSTS, nosniff, referrer-policy, frame-ancestors present (after P2-02).     | [ ]  |
| M-OPS-2 | `curl https://<staging>/api/health` | `{ ok: true, sha }` equals the deployed commit; `cache-control: no-store`. | [ ]  |
| M-OPS-3 | Kill one web pod.                   | PDB keeps one available; traffic unaffected; startup probe passes.         | [ ]  |
