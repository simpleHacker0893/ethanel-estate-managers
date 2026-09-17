import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server';
import { z } from 'zod';

/** Listing status filter on the results page; `any` shows everything. */
export const listingStatusFilters = [
  'any',
  'vacant',
  'booked',
  'let',
  'under-offer',
  'sold',
  'coming-soon',
] as const;
export type ListingStatusFilter = (typeof listingStatusFilters)[number];

/**
 * Marketplace search contract. The nuqs parsers are the single definition of the URL shape
 * (`/marketplace?intent&county&area&type&budget&sort…`), shared by the landing search bar, the
 * results page loader and, later, listing-svc's /v1/listings query validation.
 *
 * ASSUMPTION (QUESTIONS.md Q-03): `lease` means land leased by the year; `short-stay` is
 * furnished, nightly or weekly, and is its own intent rather than a rental sub-type.
 */
export const marketplaceIntents = ['rent', 'sale', 'land', 'lease', 'short-stay'] as const;
export type MarketplaceIntent = (typeof marketplaceIntents)[number];

export const marketplaceSorts = ['newest', 'price-asc', 'price-desc', 'nearest'] as const;
export type MarketplaceSort = (typeof marketplaceSorts)[number];

/** All 47 counties, so the search is nationwide from day one. `anywhere` is the default. */
export const kenyaCounties = [
  'baringo',
  'bomet',
  'bungoma',
  'busia',
  'elgeyo-marakwet',
  'embu',
  'garissa',
  'homa-bay',
  'isiolo',
  'kajiado',
  'kakamega',
  'kericho',
  'kiambu',
  'kilifi',
  'kirinyaga',
  'kisii',
  'kisumu',
  'kitui',
  'kwale',
  'laikipia',
  'lamu',
  'machakos',
  'makueni',
  'mandera',
  'marsabit',
  'meru',
  'migori',
  'mombasa',
  'muranga',
  'nairobi',
  'nakuru',
  'nandi',
  'narok',
  'nyamira',
  'nyandarua',
  'nyeri',
  'samburu',
  'siaya',
  'taita-taveta',
  'tana-river',
  'tharaka-nithi',
  'trans-nzoia',
  'turkana',
  'uasin-gishu',
  'vihiga',
  'wajir',
  'west-pokot',
] as const;
export type KenyaCounty = (typeof kenyaCounties)[number];

export const marketplaceCounties = ['anywhere', ...kenyaCounties] as const;
export type MarketplaceCounty = (typeof marketplaceCounties)[number];

export const marketplaceTypes = [
  'any',
  'unit-bedsitter',
  'unit-1bed',
  'unit-2bed',
  'unit-3bed-plus',
  'home-standalone',
  'home-maisonette',
  'plot-residential',
  'plot-commercial',
  'plot-agricultural',
] as const;
export type MarketplaceType = (typeof marketplaceTypes)[number];

/** Budget band ids. The label and the unit (per month / total / per year / per night) follow the intent. */
export const marketplaceBudgets = ['any', 'b1', 'b2', 'b3', 'b4', 'b5'] as const;
export type MarketplaceBudget = (typeof marketplaceBudgets)[number];

export const marketplaceAmenities = [
  'water',
  'parking',
  'power',
  'gated',
  'tarmac',
  'matatu',
  'lift',
  'gym',
  'pool',
] as const;
export type MarketplaceAmenity = (typeof marketplaceAmenities)[number];

export const marketplaceSearchParsers = {
  intent: parseAsStringLiteral(marketplaceIntents).withDefault('rent'),
  county: parseAsStringLiteral(marketplaceCounties).withDefault('anywhere'),
  /** Free-text town, estate or road, matched case-insensitively against a listing's area. */
  area: parseAsString.withDefault(''),
  status: parseAsStringLiteral(listingStatusFilters).withDefault('any'),
  type: parseAsStringLiteral(marketplaceTypes).withDefault('any'),
  budget: parseAsStringLiteral(marketplaceBudgets).withDefault('any'),
  sort: parseAsStringLiteral(marketplaceSorts).withDefault('newest'),
  beds: parseAsInteger,
  amenities: parseAsArrayOf(parseAsStringLiteral(marketplaceAmenities)).withDefault([]),
  listing: parseAsString,
};

/** Server-side loader: `await loadMarketplaceSearch(searchParams)` in a page or route. */
export const loadMarketplaceSearch = createLoader(marketplaceSearchParsers);

/** Builds `/marketplace?…` from a partial set of values (used by the landing search bar). */
export const serializeMarketplaceSearch = createSerializer(marketplaceSearchParsers);

export type MarketplaceSearch = Awaited<ReturnType<typeof loadMarketplaceSearch>>;

/** zod mirror for form validation, Fastify routes and the OpenAPI document. */
export const marketplaceSearchSchema = z.object({
  intent: z.enum(marketplaceIntents).default('rent'),
  county: z.enum(marketplaceCounties).default('anywhere'),
  area: z.string().trim().max(60).default(''),
  status: z.enum(listingStatusFilters).default('any'),
  type: z.enum(marketplaceTypes).default('any'),
  budget: z.enum(marketplaceBudgets).default('any'),
  sort: z.enum(marketplaceSorts).default('newest'),
  beds: z.number().int().min(1).max(10).nullable().default(null),
  amenities: z.array(z.enum(marketplaceAmenities)).default([]),
  listing: z.string().min(1).nullable().default(null),
});
export type MarketplaceSearchInput = z.input<typeof marketplaceSearchSchema>;
