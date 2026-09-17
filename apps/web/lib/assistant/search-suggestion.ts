import { assistantSuggestionSchema, type AssistantEvent } from '@ethanel/contracts/assistant';
import {
  kenyaCounties,
  serializeMarketplaceSearch,
  type MarketplaceSearchInput,
} from '@ethanel/contracts/marketplace-search';

import { countyLabels } from '@/content/marketplace';

const fence = /```search\s*([\s\S]*?)```/;

const intentLabels: Record<NonNullable<MarketplaceSearchInput['intent']>, string> = {
  rent: 'rentals',
  sale: 'homes for sale',
  land: 'plots and land',
  lease: 'land to lease',
  'short-stay': 'short stays',
};

/** Splits a finished reply into the visible text and, when present, a marketplace suggestion. */
export function extractSuggestion(reply: string): {
  text: string;
  suggestion: Extract<AssistantEvent, { type: 'suggestion' }> | null;
} {
  const match = fence.exec(reply);
  if (!match) return { text: reply.trim(), suggestion: null };
  const text = reply.replace(fence, '').trim();
  let raw: unknown;
  try {
    raw = JSON.parse(match[1] ?? '{}');
  } catch {
    return { text, suggestion: null };
  }
  const parsed = assistantSuggestionSchema.safeParse(raw);
  if (!parsed.success) return { text, suggestion: null };

  const search: MarketplaceSearchInput = {};
  const values: NonNullable<Parameters<typeof serializeMarketplaceSearch>[1]> = {};
  if (parsed.data.intent) search.intent = values.intent = parsed.data.intent;
  if (parsed.data.county && parsed.data.county !== 'anywhere') {
    search.county = values.county = parsed.data.county;
  }
  if (parsed.data.area) search.area = values.area = parsed.data.area;
  if (typeof parsed.data.beds === 'number') search.beds = values.beds = parsed.data.beds;
  if (parsed.data.type) search.type = values.type = parsed.data.type;
  if (parsed.data.budget) search.budget = values.budget = parsed.data.budget;

  const href = serializeMarketplaceSearch('/marketplace', values);
  const where =
    search.area && search.area.length > 0
      ? search.area
      : search.county && search.county !== 'anywhere'
        ? countyLabels[search.county]
        : 'Kenya';
  const beds = typeof search.beds === 'number' ? `${String(search.beds)}-bed ` : '';
  const label = `See ${beds}${intentLabels[search.intent ?? 'rent']} in ${where}`;
  return { text, suggestion: { type: 'suggestion', label, href, search } };
}

/** Finds a county named in free text (used by demo mode). */
export function detectCounty(text: string): (typeof kenyaCounties)[number] | null {
  const lower = text.toLowerCase();
  for (const slug of kenyaCounties) {
    if (lower.includes(countyLabels[slug].toLowerCase())) return slug;
  }
  return null;
}
