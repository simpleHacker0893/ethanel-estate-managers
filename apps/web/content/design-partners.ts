import type { Route } from 'next';

export const designPartners = {
  eyebrow: 'Design partner programme',
  title: 'Shape the product. Go live first.',
  lede: 'A handful of letting firms and land-selling companies in our first four counties work with us every month. They tell us what breaks; we ship the fix; they run it before anyone else.',
  exchangeTitle: 'What the programme asks of you, and gives back',
  give: {
    title: 'You give',
    items: [
      'A 45-minute call each month with the person who runs your rent',
      'Your real portfolio on Ethanel, starting with one property',
      "Honest feedback, including the parts that don't work yet",
      'Permission to name you as a design partner once you say so',
    ],
  },
  get: {
    title: 'You get',
    items: [
      'Founding-customer terms, written into your agreement',
      'A say in the roadmap — the programme sets our next quarter',
      'Every release first, with a person on WhatsApp when it breaks',
      'Your data migrated by us, not by you',
    ],
  },
  stepsTitle: 'How a partnership runs',
  stepsLede: 'Six steps from the first call to your first landlord remittance on Ethanel.',
  steps: [
    {
      n: '01',
      title: 'Fit call',
      body: "30 minutes: units, counties, what hurts. We say plainly if we're not ready for you yet.",
    },
    {
      n: '02',
      title: 'Agreement',
      body: 'Founding-customer terms and the monthly cadence, on paper.',
    },
    {
      n: '03',
      title: 'Load one property',
      body: "We import leases, residents and the landlord's agreement from your spreadsheet.",
    },
    {
      n: '04',
      title: 'First rent run',
      body: 'Reminders out on WhatsApp, receipts back, statement generated.',
    },
    {
      n: '05',
      title: 'First remittance',
      body: 'Landlord paid on the agreed day, with the statement.',
    },
    {
      n: '06',
      title: 'The rest of the portfolio',
      body: 'Once the first month balances, we load everything else.',
    },
  ],
  fitTitle: 'Who fits right now',
  fits: [
    {
      title: 'Letting & property management firms',
      body: '50 to 500 units in Kiambu, Nairobi, Kajiado or Machakos, managing for several landlords.',
    },
    {
      title: 'Land-selling companies',
      body: 'Marketing plots in the same counties and taking deposits by instalment.',
    },
    {
      title: 'Landlords with a portfolio',
      body: 'Twenty units or more, self-managed, tired of the spreadsheet.',
    },
  ],
  apply: {
    title: 'Tell us about your portfolio.',
    body: 'Places are few while the programme runs. We reply within one working day, on WhatsApp unless you ask for email.',
    cta: {
      label: 'Apply to the programme',
      href: '/company?interest=design-partner#contact' as Route,
    },
  },
} as const;
