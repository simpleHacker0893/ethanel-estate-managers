# Sprint 002 — Blueprint

Additions to the Sprint 001 layout. Server unless marked Client; Client components are leaves.

## Brand

- `content/site.ts` — `name: 'Ethanel Estate Managers'`, `wordmark: 'Ethanel'`, `wordmarkSub`.
- `components/site/logo.tsx` — two-line lockup (`tone` dark/light, `compact`); used by header,
  mobile nav, footer, press page, OG image. `public/brand/*.svg`, `app/icon.svg`.

## Images

```
content/images.ts                 manifest: ImageSlotId → { source: 'unsplash'|'illustration', photoId?, query, orientation, alt, fallback: SceneId }
lib/images/unsplash.ts            fetchUnsplashPhoto: GET /photos/:id or /search/photos, download trigger, attribution with UTM
lib/images/resolve.ts             resolveImage(slot): 'use cache' (days) when a key exists at build; else connection() then per-process backoff; illustration fallback
lib/images/loader.ts              next/image loader that appends w/q/auto/fit for images.unsplash.com
components/media/scene-illustration.tsx   inline SVG scenes (brand palette) per SceneId
components/media/scene-image.tsx  async Server: photo or illustration; variants hero|card|thumb|portrait|promo; attribution caption|sr-only|none
components/media/scene-image-slot.tsx      Suspense wrapper with the illustration as fallback
```

Nav thumbnails are illustration-only so the header stays static. Pages with photo slots become
partial prerenders (◐) when no key is present at build time; adding the key on staging shows the
photos without a rebuild.

## Pages

```
(marketing)/solutions/page.tsx, [role]/page.tsx     generateStaticParams over five roles; role-tabs (links, aria-current), role-panel (hero image, points, mock card)
(marketing)/about/page.tsx                          Tabs: story / kenya / team / launch; team cards with portrait slots (initials illustration)
(marketing)/company/page.tsx (+ #contact)           hero, partner card, six link cards, ContactForm (Client, useActionState) → actions/contact.ts
(marketing)/careers|press|design-partners|trust|privacy|terms/page.tsx   content/*.ts + _components/content-page.tsx
(marketing)/pricing/page.tsx                        content/pricing.ts: four tiers, matrix, FAQ; tier-grid, feature-matrix
(marketing)/demo/page.tsx                           content/demo.ts; DemoQuestionnaire (Client, react-hook-form + zodResolver) → actions/submit-demo-questionnaire.ts
(marketing)/sign-in/page.tsx                        Continuation reads ?next under Suspense; same-origin path check
```

## Marketplace

- `packages/contracts/marketplace-search.ts` — `county` (47 + `anywhere`), `area` (text ≤ 60),
  `status` filter; `where` removed. `listing.ts` — statuses, Kenya bounding box for coordinates.
- `content/listings.ts` — 76 original samples (`SampleListing`: intent, type, county, area,
  status, publishedAt, coordinates, priceKes, beds, amenities, agency, photo). `listingsAsOf`
  fixed date so cached renders never read the clock.
- `lib/listings.ts` — `searchListings` (intent, county, area substring, status, type, budget,
  beds, amenities; sort), `formatListedDate`. `lib/maps.ts` — Google Maps search URL.
- `components/marketplace/listing-card.tsx` — status chip (`data-status`), listed date, map link,
  WhatsApp enquiry, "Book a viewing" → `/sign-in?next=/marketplace?listing=<id>`, "Sample listing".
- Results: `cachedSearch` in `'use cache'`; cards rendered outside the cache scope because photo
  slots may call `connection()`.

## Leads

`lib/leads.ts` — one sink (`LogAndWebhookSink`) for demo requests, contact requests and
questionnaires; the log line never carries the email or phone; `DEMO_WEBHOOK_URL` receives the
full payload. Rate limits in `lib/rate-limit.ts`: contact 5, questionnaire 3, assistant chat 30,
assistant media 20 per IP per 10 minutes.

## Assistant

````
packages/contracts/assistant.ts     message, chat request, speak request, status, SSE event union, transcribe response
lib/assistant/providers.ts          ChatProvider / AsrProvider / TtsProvider / AssistantBackend
lib/assistant/nvidia.ts             NIM chat completions (SSE), Parakeet ASR (NVCF multipart), Magpie TTS (NVCF HTTP, null on failure)
lib/assistant/demo.ts               scripted replies from the same content; canned transcript; no TTS
lib/assistant/system-prompt.ts      facts from content/*.ts; instructs a closing ```search JSON block when a search is implied
lib/assistant/search-suggestion.ts  fence → validated partial search → /marketplace?… link with a label
lib/assistant/index.ts              getAssistant() (live when NVIDIA_API_KEY and not ASSISTANT_DEMO_MODE), runChat() holds back the fence
lib/assistant/sse.ts                text/event-stream response
app/api/assistant/{status,chat,transcribe,speak}/route.ts   await connection(); contract validation; per-IP limits
components/assistant/assistant-mount.tsx   Client; next/dynamic ssr:false
components/assistant/assistant-widget.tsx  Client leaf: launcher, dialog, log (role=log aria-live), SSE reader, suggestion chip, mic, speaker toggle, Escape/focus return
components/assistant/use-recorder.ts       MediaRecorder + analyser level meter
````

Mounted in `(marketing)` and `(marketplace)` layouts only.

## Environment

`UNSPLASH_ACCESS_KEY`, `NVIDIA_API_KEY`, `NVIDIA_CHAT_BASE_URL`, `NVIDIA_CHAT_MODEL`,
`NVIDIA_ASR_FUNCTION_ID`, `NVIDIA_TTS_FUNCTION_ID`, `NVIDIA_TTS_VOICE`, `ASSISTANT_DEMO_MODE`;
`NEXT_PUBLIC_WHATSAPP_NUMBER` defaults to `+254722000000`. All optional with safe fallbacks.
