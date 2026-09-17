import type { Route } from 'next';

/** Site-wide copy: brand, footer, public contact. Landing copy lives in landing.ts. */
export const site = {
  /** Legal and public name. The wordmark stays "Ethanel" with the descriptor beneath it. */
  name: 'Ethanel Estate Managers',
  wordmark: 'Ethanel',
  wordmarkSub: 'Estate Managers',
  shortName: 'Ethanel',
  title: 'Ethanel Estate Managers — Property management for Kenya',
  description:
    'Ethanel runs your letting business end to end — leases, M-Pesa rent collection, repair requests and landlord remittances — on WhatsApp, the channel your residents already use.',
  tagline:
    "Property management and a marketplace for Kenya's letting firms, landlords, residents and buyers.",
  locality: 'Nairobi, Kenya',
  whatsappUs: 'WhatsApp us',
  copyright: '© 2026 Ethanel Estate Managers · Nairobi, Kenya',
  languages: 'English · Kiswahili (coming)',
} as const;

export interface FooterColumn {
  readonly heading: string;
  readonly links: readonly { label: string; href: Route }[];
}

export const footerColumns: readonly FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Rent collection', href: '/products' },
      { label: 'Leases & residents', href: '/products' },
      { label: 'Remittances', href: '/products' },
      { label: 'Repairs', href: '/products' },
      { label: 'Reports', href: '/products' },
      { label: 'Marketplace', href: '/marketplace' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Letting firms', href: '/solutions' },
      { label: 'Land-selling companies', href: '/solutions' },
      { label: 'Landlords', href: '/solutions' },
      { label: 'Caretakers', href: '/solutions' },
      { label: 'Residents', href: '/solutions' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Design partners', href: '/design-partners' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & brand', href: '/press' },
      { label: 'Contact', href: '/company' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Trust & security', href: '/trust' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];
