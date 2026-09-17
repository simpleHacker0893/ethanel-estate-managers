import type {
  MarketplaceBudget,
  MarketplaceIntent,
  MarketplaceSort,
  MarketplaceType,
  MarketplaceWhere,
} from '@ethanel/contracts/marketplace-search';

/**
 * Labels for the marketplace search contract, shared by the landing search bar and the results
 * page. Option values are the contract enums; only the words live here.
 */
export const intentSegments: readonly {
  id: MarketplaceIntent;
  landingLabel: string;
  resultsLabel: string;
  heading: string;
  hint: string;
  per: string;
  priceUnit: string;
}[] = [
  {
    id: 'rent',
    landingLabel: 'To let',
    resultsLabel: 'Rentals',
    heading: 'Homes and units to let',
    hint: 'Monthly rentals — units and homes, paid by the month',
    per: '/ month',
    priceUnit: 'KES / month',
  },
  {
    id: 'sale',
    landingLabel: 'For sale',
    resultsLabel: 'For sale',
    heading: 'Homes for sale',
    hint: 'Houses, maisonettes, townhouses and apartments to buy',
    per: '',
    priceUnit: 'KES total',
  },
  {
    id: 'land',
    landingLabel: 'Land',
    resultsLabel: 'Land',
    heading: 'Plots and land for sale',
    hint: 'Residential, commercial and agricultural plots with ready title',
    per: '',
    priceUnit: 'KES total',
  },
  {
    id: 'lease',
    landingLabel: 'Lease',
    resultsLabel: 'Lease land',
    heading: 'Land to lease',
    hint: 'Farmland and commercial plots leased by the year',
    per: '/ year',
    priceUnit: 'KES / year',
  },
  {
    id: 'short-stay',
    landingLabel: 'Short stay',
    resultsLabel: 'Short stay',
    heading: 'Furnished short stays',
    hint: 'Short stay covers furnished and Airbnb-style homes by the night or week',
    per: '/ night',
    priceUnit: 'KES / night',
  },
];

/** The four segments on the landing bar, per the canvas. */
export const landingIntentIds: readonly MarketplaceIntent[] = [
  'rent',
  'sale',
  'lease',
  'short-stay',
];

export const whereOptions: readonly { value: MarketplaceWhere; label: string; coming?: true }[] = [
  { value: 'anywhere', label: 'Anywhere in Kenya' },
  { value: 'nairobi-kilimani', label: 'Nairobi — Kilimani' },
  { value: 'nairobi-westlands', label: 'Nairobi — Westlands' },
  { value: 'nairobi-ruaka', label: 'Nairobi — Ruaka' },
  { value: 'kiambu-ruiru', label: 'Kiambu — Ruiru' },
  { value: 'kiambu-thika', label: 'Kiambu — Thika' },
  { value: 'kiambu-juja', label: 'Kiambu — Juja' },
  { value: 'kajiado-kitengela', label: 'Kajiado — Kitengela' },
  { value: 'kajiado-isinya', label: 'Kajiado — Isinya' },
  { value: 'kajiado-ongata-rongai', label: 'Kajiado — Ongata Rongai' },
  { value: 'machakos-syokimau', label: 'Machakos — Syokimau' },
  { value: 'machakos-athi-river', label: 'Machakos — Athi River' },
  { value: 'machakos-kangundo-road', label: 'Machakos — Kangundo Road' },
  { value: 'mombasa', label: 'Mombasa (coming)', coming: true },
  { value: 'nakuru', label: 'Nakuru (coming)', coming: true },
];

export const typeOptions: readonly { value: MarketplaceType; label: string }[] = [
  { value: 'any', label: 'Any property type' },
  { value: 'unit-bedsitter', label: 'Unit — bedsitter' },
  { value: 'unit-1bed', label: 'Unit — 1 bedroom' },
  { value: 'unit-2bed', label: 'Unit — 2 bedroom' },
  { value: 'unit-3bed-plus', label: 'Unit — 3+ bedroom' },
  { value: 'home-standalone', label: 'Home — standalone' },
  { value: 'home-maisonette', label: 'Home — maisonette / townhouse' },
  { value: 'plot-residential', label: 'Plot — residential' },
  { value: 'plot-commercial', label: 'Plot — commercial' },
  { value: 'plot-agricultural', label: 'Plot — agricultural' },
];

/**
 * Budget bands per intent. Values are the contract's band ids; the KES ranges are labels only
 * (ASSUMPTION Q-12) and carry no pricing claim. Bounds are used to filter sample listings.
 */
export interface BudgetBand {
  value: MarketplaceBudget;
  label: string;
  /** Inclusive lower bound in whole KES, or null for "any". */
  min: number | null;
  /** Exclusive upper bound in whole KES, or null for open-ended. */
  max: number | null;
}

const monthly: readonly BudgetBand[] = [
  { value: 'any', label: 'Any budget', min: null, max: null },
  { value: 'b1', label: 'Under KES 15,000 / month', min: null, max: 15_000 },
  { value: 'b2', label: 'KES 15,000 – 30,000 / month', min: 15_000, max: 30_000 },
  { value: 'b3', label: 'KES 30,000 – 60,000 / month', min: 30_000, max: 60_000 },
  { value: 'b4', label: 'KES 60,000 – 120,000 / month', min: 60_000, max: 120_000 },
  { value: 'b5', label: 'Over KES 120,000 / month', min: 120_000, max: null },
];
const total: readonly BudgetBand[] = [
  { value: 'any', label: 'Any budget', min: null, max: null },
  { value: 'b1', label: 'Under KES 2M', min: null, max: 2_000_000 },
  { value: 'b2', label: 'KES 2M – 5M', min: 2_000_000, max: 5_000_000 },
  { value: 'b3', label: 'KES 5M – 10M', min: 5_000_000, max: 10_000_000 },
  { value: 'b4', label: 'KES 10M – 20M', min: 10_000_000, max: 20_000_000 },
  { value: 'b5', label: 'Over KES 20M', min: 20_000_000, max: null },
];
const yearly: readonly BudgetBand[] = [
  { value: 'any', label: 'Any budget', min: null, max: null },
  { value: 'b1', label: 'Under KES 50,000 / year', min: null, max: 50_000 },
  { value: 'b2', label: 'KES 50,000 – 150,000 / year', min: 50_000, max: 150_000 },
  { value: 'b3', label: 'KES 150,000 – 400,000 / year', min: 150_000, max: 400_000 },
  { value: 'b4', label: 'KES 400,000 – 1M / year', min: 400_000, max: 1_000_000 },
  { value: 'b5', label: 'Over KES 1M / year', min: 1_000_000, max: null },
];
const nightly: readonly BudgetBand[] = [
  { value: 'any', label: 'Any budget', min: null, max: null },
  { value: 'b1', label: 'Under KES 3,000 / night', min: null, max: 3_000 },
  { value: 'b2', label: 'KES 3,000 – 6,000 / night', min: 3_000, max: 6_000 },
  { value: 'b3', label: 'KES 6,000 – 12,000 / night', min: 6_000, max: 12_000 },
  { value: 'b4', label: 'KES 12,000 – 25,000 / night', min: 12_000, max: 25_000 },
  { value: 'b5', label: 'Over KES 25,000 / night', min: 25_000, max: null },
];

export const budgetBandsByIntent: Record<MarketplaceIntent, readonly BudgetBand[]> = {
  rent: monthly,
  sale: total,
  land: total,
  lease: yearly,
  'short-stay': nightly,
};

export const sortOptions: readonly { value: MarketplaceSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
  { value: 'nearest', label: 'Nearest' },
];

export const searchBarCopy = {
  segmentsLabel: 'What are you looking for?',
  where: 'Where',
  lookingFor: 'Looking for',
  budget: 'Budget',
  search: 'Search',
} as const;
