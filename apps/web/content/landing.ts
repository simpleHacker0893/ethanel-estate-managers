import type { Route } from 'next';

/**
 * Every word and every sample number on the landing page, in one typed object.
 * Nothing here is live data. Figures are labelled "(sample)" where they render.
 * Vocabulary: organization, resident, landlord, caretaker, unit, plot, lease, repair request,
 * work order, management agreement. Never "tenant".
 */
export const landing = {
  hero: {
    eyebrow: 'Property management for Kenya',
    title: 'Rent in. Landlords paid. Every shilling accounted for.',
    subtitle:
      'Ethanel runs your letting business end to end — leases, M-Pesa rent collection, repair requests and landlord remittances — on WhatsApp, the channel your residents already use.',
    primaryCta: { label: 'Book a demo', href: '/demo' as Route },
    secondaryCta: { label: 'Find a home or plot', href: '/marketplace' as Route },
    launchLine: 'Launching in Nairobi, Kiambu, Kajiado and Machakos',
    chips: [
      { label: 'M-Pesa', dot: 'mpesa' },
      { label: 'WhatsApp', dot: 'whatsapp' },
      { label: 'KES ledger', dot: 'pink' },
      { label: 'Clerk sign-in', dot: 'iris' },
    ] as const,
    rentRun: {
      title: 'Rent run · September 2026 (sample)',
      property: 'Riverside Court, 48 units',
      status: 'Running',
      collected: 'KES 1,842,000',
      collectedNote: 'collected via M-Pesa · allocated to 44 of 48 leases',
      progressPercent: 91,
      progressLabel: '91% of expected rent collected',
      rows: [
        { label: 'Outstanding', value: 'KES 168,000', tone: 'pink' },
        { label: 'Agency fee (per management agreement)', value: '[per agreement]', tone: 'muted' },
        { label: 'Landlord remittance', value: 'Due 5 Oct', tone: 'iris' },
      ] as const,
    },
    whatsapp: {
      avatar: 'RL',
      name: 'Riverside Lettings',
      subtitle: 'Business account',
      dayPill: 'Today',
      incoming: {
        sender: 'Riverside Lettings',
        text: "Hi Amina, rent for Unit B4 is due on 1 Oct. Reply PAY and we'll send an M-Pesa prompt to this number. Your receipt arrives here the moment it lands.",
        time: '09:12',
      },
      outgoing: { text: 'PAY', time: '09:14' },
    },
  },

  doors: {
    firms: {
      eyebrow: 'For letting & property management firms',
      title: 'Run 50 to 500 units without the spreadsheet chaos.',
      bullets: [
        'Leases, residents, landlords and caretakers in one organization',
        'Rent runs over M-Pesa, every payment allocated to the right lease',
        'Landlord statements and remittances on the day the agreement says',
      ],
      cta: { label: 'See how it works for agencies', href: '/solutions/letting-firms' as Route },
    },
    residents: {
      eyebrow: 'For residents and buyers',
      title: 'Find a unit, a home or a plot — and book a viewing today.',
      bullets: [
        'Listings straight from the agencies that manage them',
        'Book viewings and get answers on WhatsApp',
        'Pay rent and raise repair requests from your phone',
      ],
      cta: { label: 'Browse homes and plots', href: '/marketplace' as Route },
    },
  },

  how: {
    eyebrow: 'How it works',
    title: 'From signed lease to landlord remittance, in three moves.',
    lede: 'Load what you already manage, collect over the rail your residents use, and close the month with statements you can stand behind.',
    steps: [
      {
        number: '01',
        title: 'Load your portfolio',
        body: 'Import properties, units, leases and landlords from your spreadsheet. Caretakers and residents join over WhatsApp with a link.',
      },
      {
        number: '02',
        title: 'Run rent over M-Pesa',
        body: 'Reminders go out, residents reply PAY, and every payment posts to the right lease with a receipt back on WhatsApp.',
      },
      {
        number: '03',
        title: 'Remit and report',
        body: "Agency fees follow each management agreement. Landlords get a statement and their remittance on the day it's due.",
      },
    ],
  },

  features: {
    eyebrow: 'What you get',
    title: 'Everything a letting firm does each month, on one ledger.',
    receipt: {
      title: 'M-Pesa receipt · sample',
      amount: 'KES 45,000',
      rows: [
        { label: 'From', value: 'Amina W.' },
        { label: 'Lease', value: 'Riverside · B4' },
      ] as const,
      postedLabel: 'Posted',
      postedValue: 'Allocated',
    },
    tiles: [
      {
        id: 'rent',
        icon: 'wallet',
        title: 'Rent collection over M-Pesa',
        body: 'Prompts, Paybill and till payments all land on the lease they belong to, with a receipt sent back to the resident automatically.',
        wide: true,
      },
      {
        id: 'statements',
        icon: 'file-text',
        title: 'Landlord statements & remittances',
        body: 'Each landlord sees what came in, what was deducted under their agreement, and what was sent — to the shilling.',
        wide: false,
      },
      {
        id: 'repairs',
        icon: 'wrench',
        title: 'Repair requests to work orders',
        body: 'A resident sends a photo on WhatsApp; the caretaker gets a work order; the landlord sees the cost on their statement.',
        wide: false,
      },
      {
        id: 'whatsapp',
        icon: 'message-circle',
        title: 'WhatsApp as the customer channel',
        body: 'Reminders, receipts, viewings and repair updates happen where residents already are. No app to install.',
        wide: false,
      },
      {
        id: 'marketplace',
        icon: 'home',
        title: 'A marketplace for units, homes & plots',
        body: 'Vacant units list themselves from your portfolio. Viewings are booked on WhatsApp and the new lease starts in Ethanel.',
        wide: false,
      },
      {
        id: 'reports',
        icon: 'bar-chart',
        title: 'Reports landlords trust',
        body: 'Arrears, occupancy, collections by property, and an Excel export that ties back to every posting.',
        wide: false,
      },
    ] as const,
  },

  marketplace: {
    eyebrow: 'Find a home or plot',
    title: 'Units, homes and plots — listed by the people who manage them.',
    searchLabel: 'Search',
    note: 'Prices and listings shown are samples for illustration.',
    viewingCta: 'Book a viewing',
    whatsappCta: 'WhatsApp',
    /** Three cards from content/listings.ts (the same sample data the marketplace uses). */
    listingIds: ['rl-kilimani-2bed', 'sl-kitengela-plot', 'kh-ruiru-3bed'] as const,
  },

  trust: {
    eyebrow: 'Money you can audit',
    title: 'Built like a ledger, not a spreadsheet.',
    ledger: {
      title: 'Lease ledger · Riverside Court B4',
      sampleTag: 'Sample',
      columns: ['Date', 'Posting', 'Debit', 'Credit'] as const,
      rows: [
        {
          date: '01 Sep',
          ref: '#1041',
          label: 'Rent due, September',
          debit: '45,000',
          credit: '—',
          tone: 'normal',
        },
        {
          date: '03 Sep',
          ref: '#1042',
          label: 'M-Pesa RJ3K7… received',
          debit: '—',
          credit: '45,000',
          tone: 'received',
        },
        {
          date: '03 Sep',
          ref: '#1043',
          label: 'Agency fee per agreement',
          debit: '[fee]',
          credit: '—',
          tone: 'normal',
        },
        {
          date: '04 Sep',
          ref: '#1044',
          label: 'Reverses #1043 (duplicate)',
          debit: '—',
          credit: '[fee]',
          tone: 'reversal',
        },
        {
          date: '05 Sep',
          ref: '#1045',
          label: 'Landlord remittance sent',
          debit: '[net]',
          credit: '—',
          tone: 'normal',
        },
      ] as const,
      footer: '5 postings · nothing edited, nothing deleted',
      balanced: 'Balanced',
    },
    points: [
      {
        icon: 'lock',
        title: 'Postings are permanent',
        body: 'Nothing is edited in place. A correction is a new posting that references the old one, so the trail is always complete.',
      },
      {
        icon: 'coins',
        title: 'To the shilling',
        body: 'Every M-Pesa receipt, fee and remittance reconciles. Statements add up because they are built from the postings, not typed.',
      },
      {
        icon: 'shield-check',
        title: 'Your organization, your data',
        body: "Each firm's portfolio is its own tenancy in Ethanel. Staff sign in with their own accounts and see only what their role allows.",
      },
    ] as const,
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Priced by the units and properties you manage, and the features you switch on.',
    body: "Land-selling companies pay for what they market, not for a rent roll they don't run. We'll walk you through it on a call.",
    cta: { label: 'Talk to us about pricing', href: '/pricing' as Route },
  },

  cta: {
    title: 'Bring your rent roll. Leave with a plan.',
    body: 'A 30-minute walkthrough with your own properties loaded, so you can see what changes on the first of next month.',
    emailLabel: 'Work email',
    emailPlaceholder: 'you@yourfirm.co.ke',
    submit: 'Book a demo',
    // ASSUMPTION: SLA wording (QUESTIONS.md Q-04). Copy, not a commitment.
    success: "Thanks — we'll WhatsApp you within one working day",
    altLine: 'Looking for a home or plot instead?',
    altCta: { label: 'Browse the marketplace', href: '/marketplace' as Route },
  },
} as const;

export type Landing = typeof landing;
