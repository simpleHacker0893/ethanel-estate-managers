import type { Route } from 'next';

import type { NavIconName } from '@/components/site/nav-icon';
import type { ImageSlotId } from '@/content/images';

/**
 * Mega-menu information architecture. Every label, description and href for the header, the
 * mobile Sheet and the footer lives here. Icons are referenced by name so this module is safe to
 * import from both Server and Client components.
 */
export interface NavItem {
  readonly label: string;
  readonly description?: string;
  readonly href: Route;
  readonly icon: NavIconName;
  /** Thumbnail scene shown instead of the icon badge in the desktop menu. */
  readonly image?: ImageSlotId;
  readonly badge?: 'coming';
}

export interface NavColumn {
  readonly eyebrow: string;
  readonly items: readonly NavItem[];
}

export interface NavPromo {
  readonly eyebrow: string;
  readonly title: string;
  readonly body?: string;
  readonly cta: string;
  readonly href: Route;
  readonly tone: 'pink' | 'iris';
  readonly image?: ImageSlotId;
}

export interface NavGroup {
  readonly id: 'marketplace' | 'products' | 'solutions' | 'company';
  readonly label: string;
  readonly columns: readonly NavColumn[];
  readonly promo?: NavPromo;
  /** Panel width at ≥1024px, in px, from the canvas. */
  readonly width: number;
}

export const navGroups: readonly NavGroup[] = [
  {
    id: 'marketplace',
    label: 'Marketplace',
    width: 820,
    columns: [
      {
        eyebrow: 'Find',
        items: [
          {
            label: 'Rentals',
            description: 'Units and homes to let by the month, plus furnished short stays',
            href: '/marketplace?intent=rent',
            icon: 'home',
            image: 'nav-rentals',
          },
          {
            label: 'For sale',
            description: 'Houses, maisonettes, townhouses and apartments to buy',
            href: '/marketplace?intent=sale',
            icon: 'building',
            image: 'nav-for-sale',
          },
          {
            label: 'Land',
            description: 'Plots by size and county, from the companies that sell them',
            href: '/marketplace?intent=land',
            icon: 'map',
            image: 'nav-land',
          },
          {
            label: 'Lease land',
            description: 'Farmland and commercial plots leased by the year',
            href: '/marketplace?intent=lease',
            icon: 'sprout',
            image: 'nav-lease-land',
          },
        ],
      },
      {
        eyebrow: 'List',
        items: [
          {
            label: 'List your property',
            description:
              'For agencies and landlords — vacant units list themselves from your portfolio',
            href: '/sign-in?next=%2Forg',
            icon: 'plus',
          },
          {
            label: 'Saved searches & WhatsApp alerts',
            description: 'Hear the moment a match lists — on WhatsApp, not email',
            href: '/sign-in?next=%2Fmarketplace%23alerts',
            icon: 'bell',
          },
          {
            label: 'Book a viewing',
            description: 'How viewings work and what to bring',
            href: '/sign-in?next=%2Fmarketplace',
            icon: 'calendar',
          },
        ],
      },
    ],
    promo: {
      eyebrow: 'This week',
      title: 'Search Kilimani, Kitengela and Ruiru',
      cta: 'Browse all listings',
      href: '/marketplace',
      tone: 'pink',
      image: 'nav-marketplace-promo',
    },
  },
  {
    id: 'products',
    label: 'Products',
    width: 1000,
    columns: [
      {
        eyebrow: 'Money',
        items: [
          {
            label: 'Rent collection over M-Pesa',
            description: 'Prompts, Paybill and till payments posted to the right lease',
            href: '/products',
            icon: 'wallet',
          },
          {
            label: 'Landlord statements & remittances',
            description: 'Fees per management agreement, remitted on the day',
            href: '/products',
            icon: 'file-text',
          },
        ],
      },
      {
        eyebrow: 'Residents',
        items: [
          {
            label: 'Leases & residents',
            description: 'One organization for residents, landlords and caretakers',
            href: '/products',
            icon: 'users',
          },
          {
            label: 'Repair requests & work orders',
            description: 'From a WhatsApp photo to a closed work order',
            href: '/products',
            icon: 'wrench',
          },
          {
            label: 'WhatsApp customer channel',
            description: 'Reminders, receipts and viewings where residents already are',
            href: '/products',
            icon: 'message-circle',
          },
        ],
      },
      {
        eyebrow: 'Reporting',
        items: [
          {
            label: 'Reports & Excel exports',
            description: 'Arrears, occupancy, collections that tie to every posting',
            href: '/products',
            icon: 'bar-chart',
          },
          {
            label: 'Marketplace listings & viewings',
            description: 'Vacant units list themselves; viewings book on WhatsApp',
            href: '/marketplace',
            icon: 'home',
          },
          {
            label: 'Public API',
            description: 'Build on your own ledger data',
            href: '/products',
            icon: 'code',
            badge: 'coming',
          },
        ],
      },
    ],
  },
  {
    id: 'solutions',
    label: 'Solutions',
    width: 760,
    columns: [
      {
        eyebrow: 'By who you are',
        items: [
          {
            label: 'Letting & property management firms',
            description: '50 to 500 units without spreadsheet chaos',
            href: '/solutions/letting-firms',
            icon: 'building',
            image: 'nav-letting-firms',
          },
          {
            label: 'Land-selling companies',
            description: 'Market plots, book site visits, track deposits',
            href: '/solutions/land-selling-companies',
            icon: 'map',
            image: 'nav-land-selling',
          },
          {
            label: 'Landlords',
            description: 'A statement you can read and money that arrives on time',
            href: '/solutions/landlords',
            icon: 'key',
            image: 'nav-landlords',
          },
          {
            label: 'Caretakers & field staff',
            description: 'Work orders and rent chasing on a phone, no laptop',
            href: '/solutions/caretakers',
            icon: 'hard-hat',
            image: 'nav-caretakers',
          },
          {
            label: 'Residents',
            description: 'Pay rent, raise repairs and find your next home',
            href: '/solutions/residents',
            icon: 'user',
            image: 'nav-residents',
          },
        ],
      },
    ],
    promo: {
      eyebrow: 'Design partners',
      title: 'Built with design partners in Nairobi',
      body: 'A small group of letting firms shape what we build next, and go live first.',
      cta: 'Become a design partner',
      href: '/design-partners',
      tone: 'iris',
      image: 'nav-design-partners-promo',
    },
  },
  {
    id: 'company',
    label: 'Company',
    width: 720,
    columns: [
      {
        eyebrow: 'Company',
        items: [
          {
            label: 'Design partners',
            description: 'Shape the product, go live first',
            href: '/design-partners',
            icon: 'handshake',
          },
          {
            label: 'Pricing',
            description: 'By the units you manage and the features you switch on',
            href: '/pricing',
            icon: 'tag',
          },
          {
            label: 'Careers',
            description: "Build a ledger for Kenya's rent",
            href: '/careers',
            icon: 'briefcase',
          },
        ],
      },
      {
        eyebrow: 'Reach us',
        items: [
          {
            label: 'Press & brand',
            description: 'Logos, colours and who to talk to',
            href: '/press',
            icon: 'newspaper',
          },
          {
            label: 'Contact / WhatsApp us',
            description: 'A person replies, on the channel you prefer',
            href: '/company',
            icon: 'message-circle',
          },
          {
            label: 'Trust & security',
            description: 'How the ledger and your data are protected',
            href: '/trust',
            icon: 'shield-check',
          },
        ],
      },
    ],
  },
];

export const topLevelLinks: readonly { label: string; href: Route }[] = [
  { label: 'About', href: '/about' },
];

export const headerActions = {
  signIn: { label: 'Sign in', href: '/sign-in' as Route },
  demo: { label: 'Book a demo', href: '/demo' as Route },
} as const;
