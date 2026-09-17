/**
 * Scene image manifest. Each slot is either a photo resolved through the Unsplash API at request
 * time (pinned `photoId` when we have one, else the `query`) with a brand illustration as the
 * fallback, or an illustration only. Real people (founders, CTO) are never stock photos.
 *
 * ASSUMPTION (QUESTIONS.md Q-25): photo choices are verified on staging; this sandbox cannot load
 * them. Attribution renders under every photo per the Unsplash API guidelines.
 */
export type SceneId =
  | 'letting-office'
  | 'land-site-visit'
  | 'landlord'
  | 'caretaker'
  | 'residents'
  | 'kiambu-hills'
  | 'founders'
  | 'portrait'
  | 'press'
  | 'careers'
  | 'rentals'
  | 'for-sale'
  | 'land'
  | 'lease-land';

export interface ImageSlot {
  readonly source: 'unsplash' | 'illustration';
  /** Fallback search when there is no pinned photo. */
  readonly query: string;
  /** Pinned Unsplash photo id (slug) for a stable choice. */
  readonly photoId?: string;
  readonly orientation: 'landscape' | 'portrait' | 'squarish';
  /** Written by us; never Unsplash's alt text. */
  readonly alt: string;
  readonly fallback: SceneId;
  /** Initials for portrait illustrations. */
  readonly initials?: string;
}

export const imageSlots = {
  'solutions-letting-firms': {
    source: 'unsplash',
    query: 'Nairobi apartment building Kenya',
    photoId: '1Uwcoo-ttjY',
    orientation: 'landscape',
    alt: 'An apartment block in Nairobi, the kind of property a letting firm manages for several landlords.',
    fallback: 'letting-office',
  },
  'solutions-land-selling-companies': {
    source: 'unsplash',
    query: 'Kenya plot of land fence savanna',
    orientation: 'landscape',
    alt: 'Open land with a beacon and fence line, ready for a site visit.',
    fallback: 'land-site-visit',
  },
  'solutions-landlords': {
    source: 'unsplash',
    query: 'Kenyan man reading documents at home',
    orientation: 'landscape',
    alt: 'A landlord going through a monthly statement for his property.',
    fallback: 'landlord',
  },
  'solutions-caretakers': {
    source: 'unsplash',
    query: 'African maintenance worker phone building',
    orientation: 'landscape',
    alt: 'A caretaker checking a work order on his phone outside a building.',
    fallback: 'caretaker',
  },
  'solutions-residents': {
    source: 'unsplash',
    query: 'young Kenyan woman smartphone apartment',
    orientation: 'landscape',
    alt: 'A resident replying to a rent reminder on WhatsApp.',
    fallback: 'residents',
  },
  'about-story': {
    source: 'unsplash',
    query: 'Kiambu Kenya tea farm green hills',
    photoId: 'ZY0u6We7rDE',
    orientation: 'landscape',
    alt: 'Green fields and houses in Kiambu County, where Ethanel was founded.',
    fallback: 'kiambu-hills',
  },
  'about-kenya': {
    source: 'unsplash',
    query: 'Nairobi skyline Kenya',
    photoId: 'jTyDovBPQ4k',
    orientation: 'landscape',
    alt: 'The Nairobi skyline.',
    fallback: 'letting-office',
  },
  'about-launch': {
    source: 'unsplash',
    query: 'Nairobi residential estate aerial',
    photoId: 'e-oZ4yQelik',
    orientation: 'landscape',
    alt: 'A residential building with palm trees in Nairobi.',
    fallback: 'residents',
  },
  'founder-loise': {
    source: 'illustration',
    query: '',
    orientation: 'portrait',
    alt: 'Loise Ndirangu, co-founder',
    fallback: 'portrait',
    initials: 'LN',
  },
  'founder-racheal': {
    source: 'illustration',
    query: '',
    orientation: 'portrait',
    alt: 'Racheal Wangui, co-founder',
    fallback: 'portrait',
    initials: 'RW',
  },
  'cto-njuguna': {
    source: 'illustration',
    query: '',
    orientation: 'portrait',
    alt: 'Njuguna Njenga, Chief Technology Officer',
    fallback: 'portrait',
    initials: 'NN',
  },
  'company-hero': {
    source: 'unsplash',
    query: 'Nairobi office team meeting Kenya',
    orientation: 'landscape',
    alt: 'A small team at work in a Nairobi office.',
    fallback: 'careers',
  },
  'careers-hero': {
    source: 'unsplash',
    query: 'Kenya developers laptop office',
    orientation: 'landscape',
    alt: 'Engineers working together at a shared desk.',
    fallback: 'careers',
  },
  'press-hero': {
    source: 'illustration',
    query: '',
    orientation: 'landscape',
    alt: 'Ethanel brand mark and colours.',
    fallback: 'press',
  },
  'press-story-letting': {
    source: 'unsplash',
    query: 'Kiambu town buildings Kenya',
    orientation: 'landscape',
    alt: 'A letting firm office street in Kiambu.',
    fallback: 'letting-office',
  },
  'press-story-land': {
    source: 'unsplash',
    query: 'Kitengela Kajiado plots Kenya',
    orientation: 'landscape',
    alt: 'Plots marked out on the Kajiado plains.',
    fallback: 'land-site-visit',
  },
  'press-story-landlord': {
    source: 'unsplash',
    query: 'Kenyan landlord house keys',
    orientation: 'landscape',
    alt: 'A landlord receiving a remittance statement.',
    fallback: 'landlord',
  },
  // Listing photo slots, keyed by property type and setting. Verified on staging (Q-25).
  'listing-nairobi-apartment': {
    source: 'unsplash',
    query: 'Nairobi apartment building Kenya',
    orientation: 'landscape',
    alt: 'Apartment building in Nairobi',
    fallback: 'rentals',
  },
  'listing-apartment-coast': {
    source: 'unsplash',
    query: 'Mombasa apartment building palm trees',
    orientation: 'landscape',
    alt: 'Apartment building on the Kenyan coast',
    fallback: 'rentals',
  },
  'listing-apartment-town': {
    source: 'unsplash',
    query: 'Kenya town apartment block',
    orientation: 'landscape',
    alt: 'Apartment block in a Kenyan town',
    fallback: 'rentals',
  },
  'listing-bedsitter': {
    source: 'unsplash',
    query: 'small studio apartment interior Kenya',
    orientation: 'landscape',
    alt: 'Compact studio interior',
    fallback: 'rentals',
  },
  'listing-furnished': {
    source: 'unsplash',
    query: 'furnished serviced apartment living room Kenya',
    orientation: 'landscape',
    alt: 'Furnished serviced apartment',
    fallback: 'residents',
  },
  'listing-maisonette-gated': {
    source: 'unsplash',
    query: 'maisonette gated court Kenya',
    orientation: 'landscape',
    alt: 'Maisonette in a gated court',
    fallback: 'for-sale',
  },
  'listing-townhouse': {
    source: 'unsplash',
    query: 'townhouse Kenya estate',
    orientation: 'landscape',
    alt: 'Townhouse in an estate',
    fallback: 'for-sale',
  },
  'listing-standalone-home': {
    source: 'unsplash',
    query: 'standalone house garden Kenya',
    orientation: 'landscape',
    alt: 'Standalone house with a garden',
    fallback: 'for-sale',
  },
  'listing-bungalow-upcountry': {
    source: 'unsplash',
    query: 'bungalow house Kenya highlands',
    orientation: 'landscape',
    alt: 'Bungalow in the Kenyan highlands',
    fallback: 'for-sale',
  },
  'listing-plot-tarmac': {
    source: 'unsplash',
    query: 'plot tarmac access Kenya',
    orientation: 'landscape',
    alt: 'Residential plot beside a tarmac road',
    fallback: 'land',
  },
  'listing-plot-estate': {
    source: 'unsplash',
    query: 'controlled estate plots Kenya',
    orientation: 'landscape',
    alt: 'Plots in a controlled estate',
    fallback: 'land',
  },
  'listing-beach-plot': {
    source: 'unsplash',
    query: 'Kilifi beach plot ocean Kenya',
    orientation: 'landscape',
    alt: 'Plot near the beach on the Kenyan coast',
    fallback: 'land',
  },
  'listing-lakeside': {
    source: 'unsplash',
    query: 'Kisumu Lake Victoria shore',
    orientation: 'landscape',
    alt: 'Lake Victoria shoreline near Kisumu',
    fallback: 'kiambu-hills',
  },
  'listing-farmland': {
    source: 'unsplash',
    query: 'farmland Kenya green fields',
    orientation: 'landscape',
    alt: 'Farmland with green fields',
    fallback: 'lease-land',
  },
  'listing-commercial-plot': {
    source: 'unsplash',
    query: 'commercial plot highway Kenya',
    orientation: 'landscape',
    alt: 'Commercial plot beside a highway',
    fallback: 'lease-land',
  },
  'listing-nanyuki-view': {
    source: 'unsplash',
    query: 'Nanyuki Mount Kenya view land',
    orientation: 'landscape',
    alt: 'Land with a view of Mount Kenya',
    fallback: 'kiambu-hills',
  },
  'nav-rentals': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'rentals',
  },
  'nav-for-sale': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'for-sale',
  },
  'nav-land': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'land',
  },
  'nav-lease-land': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'lease-land',
  },
  'nav-letting-firms': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'letting-office',
  },
  'nav-land-selling': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'land-site-visit',
  },
  'nav-landlords': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'landlord',
  },
  'nav-caretakers': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'caretaker',
  },
  'nav-residents': {
    source: 'illustration',
    query: '',
    orientation: 'squarish',
    alt: '',
    fallback: 'residents',
  },
  'nav-marketplace-promo': {
    source: 'illustration',
    query: '',
    orientation: 'landscape',
    alt: '',
    fallback: 'rentals',
  },
  'nav-design-partners-promo': {
    source: 'illustration',
    query: '',
    orientation: 'landscape',
    alt: '',
    fallback: 'founders',
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotId = keyof typeof imageSlots;

export type ResolvedImage =
  | {
      kind: 'photo';
      /** Unsplash `urls.raw`; the loader appends width/quality/format. */
      src: string;
      width: number;
      height: number;
      alt: string;
      color: string;
      attribution: { name: string; profileUrl: string; photoUrl: string };
    }
  | { kind: 'illustration'; scene: SceneId; alt: string; initials?: string };
