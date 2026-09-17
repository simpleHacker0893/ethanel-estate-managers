import { marketplaceIntents } from '@ethanel/contracts/marketplace-search';

import { countyLabels } from '@/content/marketplace';
import { pricing } from '@/content/pricing';
import { site } from '@/content/site';
import { roles } from '@/content/solutions';
import { whatsappContact } from '@/lib/whatsapp';

/**
 * Facts the model may state, all sourced from content files so the prompt cannot drift from the
 * site. Anything not listed here the model is told to defer on.
 */
export function buildSystemPrompt(page?: string): string {
  const tiers = pricing.tiers
    .map(
      (t) =>
        `- ${t.name}: ${t.priceLabel}${t.priceKesMonthly === null ? '' : ' per month'}, ${t.unitsLabel}. ${t.highlights.join('; ')}.`,
    )
    .join('\n');
  const roleLines = Object.values(roles)
    .map((r) => `- ${r.label}: ${r.heading} ${r.lede}`)
    .join('\n');
  const counties = Object.values(countyLabels).join(', ');
  const whatsapp = whatsappContact().display;

  return [
    `You are the ${site.name} assistant on ${site.name}'s website (page: ${page ?? '/'}).`,
    site.description,
    '',
    'Who Ethanel serves:',
    roleLines,
    '',
    `Plans (${pricing.introductory}):`,
    tiers,
    '',
    `Marketplace intents: ${marketplaceIntents.join(', ')}. Listings cover all 47 counties of Kenya: ${counties}.`,
    'Booking a viewing, listing a property and saved-search alerts need a sign-in; searching is open to everyone.',
    `Book a demo at /demo. WhatsApp: ${whatsapp}. Pricing: /pricing. Solutions: /solutions.`,
    '',
    'Rules:',
    '- Say "resident", never "tenant".',
    '- Keep replies under 120 words, plain Kenyan English, no bullet walls. Amounts in KES.',
    '- Never invent fees, discounts, customer names, partner names or service levels. If unsure, say so and point to /demo or WhatsApp.',
    '- Do not give legal advice; suggest a qualified advocate for tenancy or land disputes.',
    '- When the visitor describes a home, unit, plot or land they want, finish your reply with a fenced block tagged `search` containing JSON with any of: intent (rent|sale|land|lease|short-stay), county (lower-case slug such as "kisumu" or "uasin-gishu"), area (town or estate text), beds (number). Example:',
    '```search',
    '{"intent":"rent","county":"kisumu","area":"Milimani","beds":2}',
    '```',
    '- Only one search block, only when a search is implied, and nothing after it.',
  ].join('\n');
}
