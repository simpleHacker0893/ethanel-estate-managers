import type { Route } from 'next';

/**
 * Pricing tiers. ASSUMPTION (QUESTIONS.md Q-22): the KES amounts are introductory placeholders
 * drafted for review and labelled as such on the page. Change them here only.
 */
export type TierId = 'free' | 'starter' | 'growth' | 'enterprise';

export interface PricingTier {
  readonly id: TierId;
  readonly name: string;
  readonly priceKesMonthly: number | null;
  readonly priceLabel: string;
  readonly unitsLabel: string;
  readonly blurb: string;
  readonly highlights: readonly string[];
  readonly cta: { label: string; href: Route };
  readonly featured?: true;
}

export const pricing = {
  eyebrow: 'Pricing',
  title: 'Four plans, from a single landlord to a portfolio of hundreds.',
  lede: 'Priced by the units and properties you manage, and the features you switch on. Land-selling companies pay for what they market, not for a rent roll they don’t run.',
  introductory: 'Introductory pricing, subject to change. Confirmed in your agreement.',
  perMonth: '/ month',
  tiers: [
    {
      id: 'free',
      name: 'Free',
      priceKesMonthly: 0,
      priceLabel: 'KES 0',
      unitsLabel: 'Up to 5 units',
      blurb: 'For a landlord with a few units who wants reminders and receipts on WhatsApp.',
      highlights: [
        'WhatsApp rent reminders and receipts',
        'Lease and resident records',
        'One listing on the marketplace',
      ],
      cta: { label: 'Start free', href: '/demo?tier=free' },
    },
    {
      id: 'starter',
      name: 'Starter',
      priceKesMonthly: 2_500,
      priceLabel: 'KES 2,500',
      unitsLabel: 'Up to 50 units',
      blurb: 'For a small letting firm moving off the spreadsheet.',
      highlights: [
        'Everything in Free',
        'Rent collection over M-Pesa, allocated to leases',
        'Landlord statements and remittances',
        'Marketplace listings for vacant units',
      ],
      cta: { label: 'Book a demo', href: '/demo?tier=starter' },
    },
    {
      id: 'growth',
      name: 'Growth',
      priceKesMonthly: 9_500,
      priceLabel: 'KES 9,500',
      unitsLabel: 'Up to 300 units',
      blurb: 'For firms running several properties with caretakers in the field.',
      highlights: [
        'Everything in Starter',
        'Repair requests to work orders',
        'Reports and Excel exports',
        'Landlord portal',
        'Priority WhatsApp support',
      ],
      cta: { label: 'Book a demo', href: '/demo?tier=growth' },
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceKesMonthly: null,
      priceLabel: 'Custom',
      unitsLabel: '300+ units, or land-selling companies',
      blurb: 'For large portfolios and companies marketing plots at scale.',
      highlights: [
        'Everything in Growth',
        'Plots, site visits and deposit ledgers',
        'Public API (coming)',
        'Support terms by agreement',
        'Data migration done by us',
      ],
      cta: { label: 'Talk to us', href: '/company?interest=pricing#contact' },
    },
  ] as readonly PricingTier[],
  matrixTitle: 'What each plan includes',
  matrix: [
    {
      feature: 'Units included',
      values: { free: '5', starter: '50', growth: '300', enterprise: 'Custom' },
    },
    {
      feature: 'WhatsApp reminders and receipts',
      values: { free: true, starter: true, growth: true, enterprise: true },
    },
    {
      feature: 'Leases and residents',
      values: { free: true, starter: true, growth: true, enterprise: true },
    },
    {
      feature: 'Rent collection over M-Pesa',
      values: { free: false, starter: true, growth: true, enterprise: true },
    },
    {
      feature: 'Landlord statements and remittances',
      values: { free: false, starter: true, growth: true, enterprise: true },
    },
    {
      feature: 'Marketplace listings',
      values: {
        free: '1',
        starter: 'Vacant units',
        growth: 'Vacant units',
        enterprise: 'Units and plots',
      },
    },
    {
      feature: 'Repair requests and work orders',
      values: { free: false, starter: false, growth: true, enterprise: true },
    },
    {
      feature: 'Reports and Excel exports',
      values: { free: false, starter: false, growth: true, enterprise: true },
    },
    {
      feature: 'Landlord portal',
      values: { free: false, starter: false, growth: true, enterprise: true },
    },
    {
      feature: 'Plots, site visits and deposit ledgers',
      values: { free: false, starter: false, growth: false, enterprise: true },
    },
    {
      feature: 'Public API',
      values: { free: false, starter: false, growth: false, enterprise: 'Coming' },
    },
    {
      feature: 'Support',
      values: {
        free: 'Help centre',
        starter: 'WhatsApp',
        growth: 'Priority WhatsApp',
        enterprise: 'By agreement',
      },
    },
  ] as readonly { feature: string; values: Record<TierId, boolean | string> }[],
  faqTitle: 'Questions people ask before the call',
  faq: [
    {
      q: 'Is there a free trial?',
      a: 'We load your real rent roll during the demo and run one month with you. Whether that month is charged is agreed up front — it depends on portfolio size.',
    },
    {
      q: 'Do residents or landlords pay anything?',
      a: 'No. Residents pay their normal M-Pesa transaction fee to Safaricom; Ethanel charges the organization that manages the property.',
    },
    {
      q: 'What about M-Pesa fees?',
      a: "Paybill and B2C charges are Safaricom's and pass through at cost. They appear as their own postings on the ledger so they are never hidden inside a fee.",
    },
    {
      q: 'Can we start with one property?',
      a: 'Yes. Most firms start with one property and one landlord, then load the rest once the first rent run closes.',
    },
    {
      q: 'Is the marketplace included?',
      a: 'Listing vacant units from your portfolio is part of Starter and above. Land-selling companies who only use the marketplace pay for listings and viewings, not the ledger.',
    },
  ],
  closing: {
    title: 'Bring your rent roll to the call.',
    body: "We'll load it, run a month, and confirm the plan that fits.",
    cta: { label: 'Book a demo', href: '/demo' as Route },
  },
} as const;
