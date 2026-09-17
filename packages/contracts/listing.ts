import { z } from 'zod';

import { marketplaceIntents } from './marketplace-search';

/** Listing lifecycle as shown on marketplace cards. listing-svc owns transitions later. */
export const listingStatuses = [
  'vacant',
  'booked',
  'let',
  'under-offer',
  'sold',
  'coming-soon',
] as const;
export type ListingStatus = (typeof listingStatuses)[number];

/** Kenya bounding box, so a typo in coordinates fails validation instead of pointing at the sea. */
export const listingCoordinatesSchema = z.object({
  lat: z.number().min(-5).max(5.5),
  lng: z.number().min(33.5).max(42),
});
export type ListingCoordinates = z.output<typeof listingCoordinatesSchema>;

/** The shape /v1/listings returns per row and the marketplace card consumes. */
export const listingSummarySchema = z.object({
  id: z.string().min(1),
  intent: z.enum(marketplaceIntents),
  status: z.enum(listingStatuses),
  /** ISO date (YYYY-MM-DD), Africa/Nairobi. */
  publishedAt: z.iso.date(),
  coordinates: listingCoordinatesSchema,
  title: z.string().min(1),
  location: z.string().min(1),
  agency: z.string().min(1),
});
export type ListingSummary = z.output<typeof listingSummarySchema>;
