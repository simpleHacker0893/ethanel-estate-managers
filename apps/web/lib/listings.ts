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

  const matches = sampleListings.filter((l) => {
    if (l.intent !== search.intent) return false;
    if (search.where !== 'anywhere' && l.where !== search.where) return false;
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
      sorted.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
  }
  return sorted;
}

const kes = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });

export function formatKes(amount: number): string {
  return `KES ${kes.format(amount)}`;
}
