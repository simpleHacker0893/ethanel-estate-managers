import type { Route } from 'next';

import type { ImageSlotId } from '@/content/images';

/** Solutions by role. Copy from the canvas "Solutions / By role 1440"; figures are placeholders. */
export const roleIds = [
  'letting-firms',
  'land-selling-companies',
  'landlords',
  'caretakers',
  'residents',
] as const;
export type RoleId = (typeof roleIds)[number];

export interface RoleContent {
  readonly label: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly lede: string;
  readonly points: readonly { title: string; body: string }[];
  readonly cta: { label: string; href: Route };
  readonly mock: {
    readonly title: string;
    readonly head: string;
    readonly rows: readonly {
      label: string;
      value: string;
      tone: 'ink' | 'pink' | 'iris' | 'teal' | 'amber';
    }[];
    readonly note: string;
  };
  readonly livesIn: string;
  readonly image: ImageSlotId;
  readonly tone: 'iris' | 'pink' | 'plain';
  readonly metaDescription: string;
}

export const solutionsPage = {
  eyebrow: 'Solutions',
  title: 'Ethanel, by who you are.',
  lede: 'The same ledger, seen from five seats. Pick yours.',
  tabsLabel: 'Who you are',
  seeProducts: { label: 'See the products', href: '/products' as Route },
  whereTitle: 'Where this role lives',
  closing: {
    title: 'Five seats, one set of numbers.',
    body: "When the caretaker closes a work order, the landlord's statement already knows.",
    cta: { label: 'Book a demo', href: '/demo' as Route },
  },
} as const;

export const roles: Record<RoleId, RoleContent> = {
  'letting-firms': {
    label: 'Letting firms',
    eyebrow: 'Letting & property management firms',
    heading: 'Run 50 to 500 units without the spreadsheet chaos.',
    lede: 'One organization for your residents, landlords and caretakers. Rent runs over M-Pesa, statements from the ledger, remittances on the day the agreement says.',
    cta: { label: 'See how it works for agencies', href: '/products' },
    points: [
      {
        title: 'Portfolio in one place',
        body: 'Properties, units, leases, landlords and management agreements.',
      },
      {
        title: 'Rent runs that allocate themselves',
        body: 'M-Pesa receipts matched to leases; unmatched ones queue for a tap.',
      },
      { title: 'Statements you can stand behind', body: 'Every landlord line links to a posting.' },
    ],
    mock: {
      title: 'Organization · Riverside Lettings (sample)',
      head: 'September at a glance',
      rows: [
        { label: 'Properties · units', value: '6 · 214', tone: 'ink' },
        { label: 'Rent collected', value: '[amount]', tone: 'ink' },
        { label: 'Outstanding', value: '[amount]', tone: 'pink' },
        { label: 'Remittances due 5 Oct', value: '6 landlords', tone: 'iris' },
      ],
      note: 'Numbers are placeholders, never invented.',
    },
    livesIn: 'Web dashboard for the office; WhatsApp for everyone else.',
    image: 'solutions-letting-firms',
    tone: 'iris',
    metaDescription:
      'Ethanel for letting and property management firms: one organization, M-Pesa rent runs, landlord statements from the ledger.',
  },
  'land-selling-companies': {
    label: 'Land-selling companies',
    eyebrow: 'Land-selling companies',
    heading: 'Market plots, book site visits, track every deposit.',
    lede: 'List plots by size and county on the marketplace, take viewing bookings on WhatsApp, and keep deposits and balances on a ledger buyers can trust.',
    cta: { label: 'List your plots', href: '/sign-in?next=%2Forg' },
    points: [
      {
        title: 'Plots on the marketplace',
        body: 'Size, title status and location, from the company that sells them.',
      },
      {
        title: 'Site visits on WhatsApp',
        body: 'Buyers book a Saturday visit; your team gets the list.',
      },
      {
        title: 'Deposits on the ledger',
        body: 'Instalments post against the plot, with a receipt each time.',
      },
    ],
    mock: {
      title: 'Project · Kitengela Phase 2 (sample)',
      head: 'Plots and buyers',
      rows: [
        { label: 'Plots listed', value: '48', tone: 'ink' },
        { label: 'Viewings this Saturday', value: '[n] buyers', tone: 'ink' },
        { label: 'Deposits received', value: '[amount]', tone: 'ink' },
        { label: 'Balances outstanding', value: '[amount]', tone: 'pink' },
      ],
      note: 'Title deed status shown only when confirmed.',
    },
    livesIn: 'Marketplace listings; WhatsApp bookings; web ledger for the sales office.',
    image: 'solutions-land-selling-companies',
    tone: 'pink',
    metaDescription:
      'Ethanel for land-selling companies: plots on the marketplace, site visits on WhatsApp, deposits on a ledger.',
  },
  landlords: {
    label: 'Landlords',
    eyebrow: 'Landlords',
    heading: 'A statement you can read, and money that arrives on time.',
    lede: 'You see what came in, what was deducted under your agreement, and what was sent. Every line links to the posting behind it.',
    cta: { label: 'Ask your agency about Ethanel', href: '/company#contact' },
    points: [
      {
        title: 'Monthly statement, PDF and Excel',
        body: 'Rent collected, agency fee, approved repairs, remittance.',
      },
      {
        title: 'Approve repairs from your phone',
        body: 'A WhatsApp message, one tap, and the cost lands on the statement.',
      },
      {
        title: 'Remittance on the agreed day',
        body: 'Over M-Pesa B2C or bank, with the reference.',
      },
    ],
    mock: {
      title: 'Statement · Mr. Kamau, Riverside Court (sample)',
      head: 'September remittance',
      rows: [
        { label: 'Rent collected', value: '1,842,000', tone: 'ink' },
        { label: 'Agency fee (per agreement)', value: '[fee]', tone: 'ink' },
        { label: 'Approved repairs', value: '[cost]', tone: 'ink' },
        { label: 'Sent 5 Oct', value: '[net]', tone: 'iris' },
      ],
      note: 'Sent on WhatsApp and email the day it is paid.',
    },
    livesIn: 'WhatsApp for statements and approvals; a read-only web view when you want detail.',
    image: 'solutions-landlords',
    tone: 'iris',
    metaDescription:
      'Ethanel for landlords: a monthly statement you can read and a remittance that arrives on the agreed day.',
  },
  caretakers: {
    label: 'Caretakers & field staff',
    eyebrow: 'Caretakers & field staff',
    heading: 'Work orders and rent chasing on a phone. No laptop.',
    lede: 'Repairs arrive as work orders with a time window. Rent reminders go out without you knocking on doors. Mark it done and everyone knows.',
    cta: { label: 'See repair requests', href: '/products' },
    points: [
      {
        title: 'Today, on WhatsApp',
        body: 'Your work orders for the day, in order, with the unit and the resident.',
      },
      {
        title: 'Close with a photo',
        body: 'A photo and a tap closes the work order; the landlord sees the cost.',
      },
      {
        title: 'Who has paid',
        body: 'A list, not a ledger; you chase only the ones still outstanding.',
      },
    ],
    mock: {
      title: 'Today · James M., Riverside Court (sample)',
      head: '3 work orders, 4 residents to remind',
      rows: [
        { label: '#WO-218 · Kitchen tap, B4', value: '14:00–16:00', tone: 'ink' },
        { label: '#WO-219 · Gate light', value: 'After 16:00', tone: 'ink' },
        { label: '#WO-215 · Blocked drain, A2', value: 'Done', tone: 'teal' },
        { label: 'Reminders queued', value: '4 residents', tone: 'iris' },
      ],
      note: 'Everything above is a WhatsApp message, not an app screen.',
    },
    livesIn: 'WhatsApp only.',
    image: 'solutions-caretakers',
    tone: 'plain',
    metaDescription:
      'Ethanel for caretakers and field staff: work orders and rent reminders on WhatsApp, no laptop needed.',
  },
  residents: {
    label: 'Residents',
    eyebrow: 'Residents',
    heading: 'Pay rent, raise a repair, find your next home — from your phone.',
    lede: 'Reply PAY for an M-Pesa prompt and get your receipt back in the same chat. Send a photo when something breaks. Browse what the same agencies have to let.',
    cta: { label: 'Browse homes and plots', href: '/marketplace' },
    points: [
      {
        title: 'Rent in two taps',
        body: 'Reply PAY, confirm on M-Pesa, receipt arrives on WhatsApp.',
      },
      { title: 'Repairs with a photo', body: 'You see who is coming and when.' },
      {
        title: 'Your next place',
        body: 'Units and homes listed by the agencies that manage them.',
      },
    ],
    mock: {
      title: 'Chat · Amina W., Unit B4 (sample)',
      head: 'This month',
      rows: [
        { label: 'Rent due 1 Oct', value: '45,000', tone: 'ink' },
        { label: 'Paid 3 Sep · receipt RJ3K7…', value: '45,000', tone: 'teal' },
        { label: 'Repair #WO-218', value: 'In progress', tone: 'amber' },
        { label: 'Lease ends', value: '31 Mar 2027', tone: 'ink' },
      ],
      note: 'No app to install; WhatsApp does it all.',
    },
    livesIn: 'WhatsApp, and the marketplace on the web.',
    image: 'solutions-residents',
    tone: 'pink',
    metaDescription:
      'Ethanel for residents: pay rent with PAY on WhatsApp, raise repairs with a photo, find your next home.',
  },
};

export function isRoleId(value: string): value is RoleId {
  return (roleIds as readonly string[]).includes(value);
}
