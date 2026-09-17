import type { AssistantMessage } from '@ethanel/contracts/assistant';
import type { MarketplaceIntent } from '@ethanel/contracts/marketplace-search';

import { countyLabels } from '@/content/marketplace';
import { pricing } from '@/content/pricing';

import type { AsrProvider, ChatProvider, TtsProvider } from './providers';
import { detectCounty } from './search-suggestion';

/**
 * Scripted assistant for environments without an NVIDIA key. Replies are built from the same
 * content files as the live prompt and end with the same `search` block, so the widget, the
 * suggestion parser and the tests exercise the real path.
 */
function intentFrom(text: string): MarketplaceIntent | null {
  if (/\b(short[- ]?stay|airbnb|furnished|nightly|weekly)\b/.test(text)) return 'short-stay';
  if (/\b(lease|leasing)\b/.test(text)) return 'lease';
  if (/\b(plot|plots|land|acre|acres|shamba)\b/.test(text)) return 'land';
  if (/\b(buy|buying|for sale|purchase|own a home|mortgage)\b/.test(text)) return 'sale';
  if (/\b(rent|renting|to let|bedsit|bedsitter|apartment|flat|house|bedroom|bed)\b/.test(text))
    return 'rent';
  return null;
}

function bedsFrom(text: string): number | null {
  const m =
    /(\d)\s*-?\s*(?:bed|bedroom|br)\b/.exec(text) ??
    /\b(one|two|three|four)\s*-?\s*(?:bed|bedroom)/.exec(text);
  if (!m?.[1]) return null;
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4 };
  const n = words[m[1]] ?? Number(m[1]);
  return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null;
}

export function demoReply(messages: readonly AssistantMessage[]): string {
  const last = messages.at(-1)?.content.toLowerCase() ?? '';
  const intent = intentFrom(last);
  const county = detectCounty(last);
  const beds = bedsFrom(last);

  if (intent) {
    const where = county ? countyLabels[county] : 'anywhere in Kenya';
    const what =
      intent === 'rent'
        ? `${beds ? `${String(beds)}-bedroom ` : ''}rentals`
        : intent === 'sale'
          ? 'homes for sale'
          : intent === 'land'
            ? 'plots and land'
            : intent === 'lease'
              ? 'land to lease'
              : 'short stays';
    const search: Record<string, string | number> = { intent };
    if (county) search.county = county;
    if (beds && intent === 'rent') search.beds = beds;
    return `Here is a search for ${what} in ${where}. Every listing shows its status, the date it was listed, a map pin and a WhatsApp button, and you can filter by budget, type and amenities. Booking a viewing needs a quick sign-in.\n\n\`\`\`search\n${JSON.stringify(search)}\n\`\`\``;
  }
  if (/\b(price|pricing|cost|plan|plans|subscription|how much)\b/.test(last)) {
    const tiers = pricing.tiers
      .map((t) => `${t.name} (${t.priceLabel}, ${t.unitsLabel.toLowerCase()})`)
      .join(', ');
    return `There are four plans: ${tiers}. ${pricing.introductory} Full details are on /pricing, and a demo is the quickest way to see which fits.`;
  }
  if (/\b(m-?pesa|paybill|till|collect|collection|arrears)\b/.test(last)) {
    return 'Rent is collected on M-Pesa against your own Paybill or Till. Each payment is matched to the lease automatically, the resident gets a WhatsApp receipt, and landlord statements and remittances come out of the same ledger. Book a demo at /demo to see it with your own rent roll.';
  }
  if (/\b(whatsapp|message|chat)\b/.test(last)) {
    return 'WhatsApp is the resident channel: reminders, receipts, repair requests and notices go there, and your staff work from a phone. Land-selling companies use it for site visits and deposit updates too.';
  }
  if (/\b(demo|book|call|talk|sales)\b/.test(last)) {
    return 'Book a demo at /demo. Four short screens tell us about your properties, then a 30-minute walkthrough on a call or in person in Kiambu or Nairobi.';
  }
  if (/\b(land[- ]selling|site visit|deposit|beacon|title)\b/.test(last)) {
    return 'For land-selling companies Ethanel markets plots, books site visits and tracks every deposit and instalment per plot, with WhatsApp updates to buyers. See /solutions/land-selling-companies or book a demo.';
  }
  return 'I can help with rent collection, land sales, plans and pricing, or find you a place: try "2-bedroom to rent in Kisumu" or "plots in Kajiado". I\'m in demo mode, so my answers are scripted for now.';
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const demoChat: ChatProvider = {
  async *stream({ messages }) {
    const reply = demoReply(messages);
    for (const chunk of reply.split(/(?<=\s)/)) {
      yield chunk;
      await delay(12);
    }
  },
};

export const demoAsr: AsrProvider = {
  transcribe: () => Promise.resolve('Find a two bedroom to rent in Kisumu'),
};

export const demoTts: TtsProvider = {
  synthesize: () => Promise.resolve(null),
};
