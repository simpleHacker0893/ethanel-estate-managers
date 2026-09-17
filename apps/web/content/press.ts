import type { Route } from 'next';

import type { ImageSlotId } from '@/content/images';

/**
 * Press & brand. Boilerplate and brand rules from the canvas; the stories are illustrative
 * case studies (ASSUMPTION Q-27): fictional organizations, figures marked as examples.
 */
export const press = {
  eyebrow: 'Press & brand',
  title: 'Ethanel Estate Managers, in one paragraph and two colours.',
  lede: "Everything a journalist, partner or designer needs to describe us correctly. Use the assets as they are; don't recolour the mark or put white text on pink.",
  image: 'press-hero' as ImageSlotId,
  boilerplate: {
    title: 'Boilerplate',
    short: 'Ethanel Estate Managers is property-management software and a marketplace for Kenya.',
    long: 'It runs a letting firm’s business end to end — leases, M-Pesa rent collection, repair requests and landlord remittances — on WhatsApp, the channel residents already use. Its marketplace lists units, homes and plots directly from the organizations that manage them. Ethanel Estate Managers was founded in 2024 in Kiambu County by advocates Loise Ndirangu and Racheal Wangui, with Njuguna Njenga as Chief Technology Officer, and launches first in Kiambu, Nairobi, Kajiado and Machakos.',
    vocabulary:
      'Say "resident", not "tenant". Say "organization" for a letting firm on the platform.',
  },
  contact: {
    title: 'Press contact',
    // ASSUMPTION (QUESTIONS.md Q-27): press mailbox and contact name pending.
    name: 'Press desk',
    email: 'press@ethanel.example',
    note: 'Replace with the real mailbox before publishing.',
  },
  facts: {
    title: 'Facts you may state',
    items: [
      'Founded 2024 in Kiambu County',
      'Founders: Loise Ndirangu and Racheal Wangui (advocates); CTO Njuguna Njenga',
      'Launch counties: Kiambu, Nairobi, Kajiado, Machakos',
      'Payments: M-Pesa · Channel: WhatsApp',
    ],
    notPublished: 'Customer counts, revenue and funding are not published.',
  },
  storiesTitle: 'Stories',
  storiesLede:
    'Three illustrative accounts of what changes on the first of the month. The organizations and figures are examples that stand in for real design partners until they choose to be named.',
  illustrativeTag: 'Illustrative — example figures, not customer data',
  stories: [
    {
      id: 'kiambu-letting-firm',
      image: 'press-story-letting' as ImageSlotId,
      eyebrow: 'Letting firm · Kiambu',
      title: 'A Sunday of M-Pesa statements becomes a Monday morning report.',
      body: 'A firm managing units across several landlords used to match a month of M-Pesa lines to leases by hand. On Ethanel every receipt posts to its lease as it lands, unmatched ones queue for a tap, and each landlord statement is built from the postings instead of typed.',
      metrics: [
        { label: 'Hours of matching per month', before: 'A weekend', after: 'Under an hour' },
        { label: 'Landlord statements', before: 'Typed', after: 'Built from postings' },
        {
          label: 'Paper receipts issued',
          before: 'Every payment',
          after: 'None; receipts arrive on WhatsApp',
        },
      ],
    },
    {
      id: 'kajiado-land-seller',
      image: 'press-story-land' as ImageSlotId,
      eyebrow: 'Land-selling company · Kajiado',
      title: 'Site visits booked on WhatsApp, deposits on a ledger buyers can check.',
      body: 'A company marketing plots on the Kajiado plains listed them on the marketplace with size and title status, took Saturday viewings by WhatsApp reply, and posted every instalment against the plot with a receipt. Balances stopped living in three notebooks.',
      metrics: [
        { label: 'Booking a site visit', before: 'Phone calls', after: 'One WhatsApp reply' },
        { label: 'Deposit records', before: 'Notebooks and Excel', after: 'One ledger per plot' },
        { label: 'Buyer balance queries', before: 'Office visit', after: 'Answered in the chat' },
      ],
    },
    {
      id: 'landlord-remittance',
      image: 'press-story-landlord' as ImageSlotId,
      eyebrow: 'Landlord · Nairobi',
      title: 'A statement that reads like a bank statement, paid on the agreed day.',
      body: 'A landlord with a block managed by a letting firm approves repairs with one tap on WhatsApp and receives a statement where every line links to the posting behind it. The remittance goes out on the day the management agreement says, with the reference.',
      metrics: [
        {
          label: 'Repair approvals',
          before: 'Calls and forwarded photos',
          after: 'One tap on WhatsApp',
        },
        { label: 'Statement questions', before: 'Frequent', after: 'Every line traceable' },
        { label: 'Remittance day', before: 'Varies', after: 'Per agreement, with reference' },
      ],
    },
  ],
  logo: {
    title: 'Logo',
    rule: 'Clear space around the mark equals the height of the "E". Minimum size 24px. Never white text on pink, never a gradient, never a drop shadow.',
    downloads: [
      { label: 'Mark (SVG)', href: '/brand/ethanel-mark.svg' },
      { label: 'Logo on dark (SVG)', href: '/brand/ethanel-logo-dark.svg' },
      { label: 'Logo on light (SVG)', href: '/brand/ethanel-logo-light.svg' },
    ],
    fontNote:
      'SVG wordmarks reference Fraunces and Manrope; they fall back to Georgia and Arial when those fonts are not installed.',
  },
  colour: {
    title: 'Colour',
    swatches: [
      { name: 'Midnight Navy', hex: '#0B1026', className: 'bg-navy-950' },
      { name: 'Iris 700', hex: '#5A48B8', className: 'bg-iris-700' },
      { name: 'Bougainvillea', hex: '#EA5D9B', className: 'bg-pink-500' },
      { name: 'Mist 50', hex: '#F7F6FB', className: 'bg-mist-50' },
      { name: 'Ink', hex: '#14122B', className: 'bg-ink' },
      { name: 'Teal', hex: '#2E9E74', className: 'bg-teal' },
    ],
  },
  type: {
    title: 'Type',
    display: {
      name: 'Fraunces 600',
      note: 'Headlines on marketing pages only. Never inside the product.',
    },
    body: { name: 'Manrope', note: 'Everything else. Tabular numerals for every KES figure.' },
  },
  closing: {
    title: 'Need something not here?',
    body: 'Photos of the team, a founder quote, or a partner to speak to.',
    cta: { label: 'Contact press', href: '/company?interest=press#contact' as Route },
  },
} as const;
