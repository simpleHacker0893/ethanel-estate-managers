import type { Route } from 'next';

import type { NavIconName } from '@/components/site/nav-icon';
import type { ImageSlotId } from '@/content/images';

/** Careers. Roles are examples of what we expect to hire, labelled as such. */
export const careers = {
  eyebrow: 'Careers',
  title: "Build the ledger Kenya's rent runs on.",
  lede: 'A small team in Kiambu and Nairobi. Engineers who have shipped on M-Pesa Daraja, a designer, and a customer lead who has chased rent herself. We hire slowly and on purpose.',
  image: 'careers-hero' as ImageSlotId,
  howTitle: 'How we work',
  how: [
    {
      icon: 'shield-check' as NavIconName,
      title: 'Ledger first',
      body: "Money is modelled before a screen is drawn. If it doesn't balance, it doesn't ship.",
    },
    {
      icon: 'message-circle' as NavIconName,
      title: 'WhatsApp is the product',
      body: 'Residents and caretakers never install anything. We design for a 4-inch screen on a mid-range Android.',
    },
    {
      icon: 'handshake' as NavIconName,
      title: 'Partners set the roadmap',
      body: "Design-partner firms decide what we build next. We don't guess in a room.",
    },
  ],
  rolesTitle: 'Open roles',
  rolesNote:
    'No roles are open yet. These are the first we expect to hire; each becomes a real brief when it is signed off. Good notes get a reply even when there is no role.',
  roles: [
    {
      title: 'Ledger & payments engineer',
      meta: 'Engineering · Nairobi · hybrid',
      status: 'Opening soon',
    },
    {
      title: 'Product designer, WhatsApp experience',
      meta: 'Design · Nairobi · hybrid',
      status: 'Opening soon',
    },
    {
      title: 'Customer lead, letting firms',
      meta: 'Customers · Kiambu · in person',
      status: 'Opening soon',
    },
  ],
  noFit: {
    title: 'Nothing that fits?',
    body: "Tell us what you'd build here and why. Good notes get a reply even when there's no role.",
    cta: { label: 'Send a note', href: '/company?interest=other#contact' as Route },
  },
  likeTitle: "What it's like",
  like: [
    {
      title: 'Field days',
      body: 'Everyone visits a partner firm each month — the office, the caretaker, the resident.',
    },
    {
      title: 'Shillings, not story points',
      body: 'We measure the month by rent runs closed and remittances sent on time.',
    },
    {
      title: 'Written by default',
      body: 'Decisions live in DECISIONS.md; nobody reconstructs a meeting from memory.',
    },
    { title: 'Kiswahili welcome', body: 'The product will speak it; so does the team.' },
  ],
  closing: {
    title: 'Come chase rent with us.',
    body: 'Send a note, or apply when a role opens.',
    cta: { label: 'Send a note', href: '/company?interest=other#contact' as Route },
  },
} as const;
