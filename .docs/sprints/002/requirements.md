# Sprint 002 — Requirements (marketing pass)

**Goal.** Finish the public site around the Sprint 001 landing page and marketplace results:
real Company, About and Solutions pages with imagery, a four-tier pricing page, marketplace
behaviour that hands off to sign-in where an account is needed, a nationwide search on 50-plus
original sample listings, a book-a-demo questionnaire, and an assistant on NVIDIA Nemotron with
voice. Rename the public company name to "Ethanel Estate Managers" while keeping the "Ethanel"
wordmark. Everything else from Sprint 001 stays as it is.

The operator's brief (verbatim intent, in order):

1. Solutions sub-tabs get background and hero images (landlord managing property, caretaker with
   a work order, buyers at a plot, resident on WhatsApp, letting-firm desk).
2. Company pages completed: Contact, Careers, Press (stories of success reducing paperwork).
3. About: founded by two sisters, advocates, Loise Ndirangu and Racheal Wangui; CTO Njuguna
   Njenga; founded in Kiambu County; their experience in property and land transactions; images.
4. Solutions pages completed, with dropdown images and background images.
5. Marketplace: "Listing, search, Book viewing" → sign-in page; listing status (vacant, booked
   and so on); dropdown images; WhatsApp contact `+254722000000` opening WhatsApp with an intro
   message; published date; a location icon that opens Google Maps at the coordinates.
6. Pricing page with four subscription models, Free → Custom/Enterprise.
7. AI chatbot on Nemotron (NVIDIA free open models) with voice chat, microphone and transcription.
8. "Book a demo" → a questionnaire in the style of a business analyst's discovery.
9. Company name "Ethanel Estate Managers": keep the "Ethanel" wordmark, "Estate Managers" small
   beneath it.

Mid-sprint addition (operator): nationwide search across all 47 counties with free-text area,
"Anywhere in Kenya" default, no "(coming)" labels; 50-plus original sample listings across all
five intents and many counties written in the style of Kenyan property sites, every card
labelled sample, each with status, published date, coordinates, price, bedrooms, amenities, a
fictional managing organization and a photo slot; tests (a Kisumu rental search returns
results) and docs carried through.

## Decisions taken with the operator

| Topic        | Decision                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Photos       | Unsplash API at runtime keyed by a manifest (`content/images.ts`); brand SVG illustration fallback when no key or a fetch fails; verified on staging. |
| Assistant    | Full chat + voice on NVIDIA NIM (Nemotron chat, Parakeet ASR, Magpie TTS) with a scripted demo mode when `NVIDIA_API_KEY` is absent.                  |
| Pricing      | Four tiers with introductory KES prices drafted for review, labelled "Introductory pricing, subject to change" (Q-22).                                |
| Sign-in gate | Book a viewing, List your property, Saved searches & alerts → `/sign-in?next=…`. Searching stays open.                                                |
| About        | Founded 2024, Kiambu County, by Loise Ndirangu and Racheal Wangui (sisters, advocates); CTO Njuguna Njenga. No other claims (Q-26).                   |
| Press        | Story-led case studies with every figure labelled illustrative (Q-27).                                                                                |
| Maps         | Location link opens Google Maps at the listing coordinates; no Maps key.                                                                              |
| WhatsApp     | `+254722000000` as the env default; `wa.me` links carry a prefilled intro per context.                                                                |

## Out of scope (unchanged from the Sprint 001 handoff)

Chassis, Helm, `identity-svc`, Clerk, Prisma, RLS harness. `/sign-in` remains a page that
explains the handoff until Clerk lands; the `next` parameter is validated and displayed now so
Clerk only has to honour it.
