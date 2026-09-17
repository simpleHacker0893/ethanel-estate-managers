import type { MarketplaceSearch } from '@ethanel/contracts/marketplace-search';

import { budgetBandsByIntent } from '@/content/marketplace';
import { sampleListings, type SampleListing } from '@/content/listings';

/**
 * Pure filter + sort over the sample listings. listing-svc's /v1/listings takes the same
 * MarketplaceSearch and returns the same shape, so the page does not change when it arrives.
 */
export function searchListings(search: MarketplaceSearch): readonly SampleListing[] {
  const band = budgetBandsByIntent[search.intent].find((b) => b.value === search.budget);
  const typeFamily = search.type === 'any' ? null : search.type.split('-')[0];
  const area = search.area.trim().toLowerCase();

  const matches = sampleListings.filter((l) => {
    if (l.intent !== search.intent) return false;
    if (search.county !== 'anywhere' && l.county !== search.county) return false;
    if (area && !`${l.area} ${l.location}`.toLowerCase().includes(area)) return false;
    if (search.status !== 'any' && l.status !== search.status) return false;
    if (search.type !== 'any' && l.type !== search.type) {
      // A family match (unit/home/plot) is close enough for the "3+ bed" style buckets.
      if (!(typeFamily && l.type.startsWith(`${typeFamily}-`) && search.type.endsWith('-plus'))) {
        return false;
      }
    }
    if (band?.min !== null && band?.min !== undefined && l.priceKes < band.min) return false;
    if (band?.max !== null && band?.max !== undefined && l.priceKes >= band.max) return false;
    if (search.beds !== null && (l.beds === null || l.beds < search.beds)) return false;
    if (search.amenities.length > 0 && !search.amenities.every((a) => l.amenities.includes(a))) {
      return false;
    }
    return true;
  });

  const sorted = [...matches];
  switch (search.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.priceKes - b.priceKes);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceKes - a.priceKes);
      break;
    case 'newest':
    case 'nearest':
    default:
      // ISO dates compare as strings; newest first. "Nearest" needs a location (Q-13).
      sorted.sort((a, b) =>
        a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
      );
  }
  return sorted;
}

const kes = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });

export function formatKes(amount: number): string {
  return `KES ${kes.format(amount)}`;
}

const listed = new Intl.DateTimeFormat('en-KE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Africa/Nairobi',
});

/** "3 Sep 2026" from an ISO date. Deterministic: no clock involved. */
export function formatListedDate(isoDate: string): string {
  return listed.format(new Date(`${isoDate}T12:00:00Z`));
}
