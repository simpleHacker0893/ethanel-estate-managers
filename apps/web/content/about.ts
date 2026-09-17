import type { Route } from 'next';

import type { ImageSlotId } from '@/content/images';

/**
 * About page. Founding facts as told by the operator (QUESTIONS.md Q-26): founded 2024 in Kiambu
 * County by Loise Ndirangu and Racheal Wangui, sisters and advocates, with Njuguna Njenga as CTO.
 * Nothing else about the founders is claimed.
 */
export const about = {
  eyebrow: 'About Ethanel Estate Managers',
  title: 'Rent is the biggest monthly transaction most Kenyans make. It deserves a ledger.',
  tabsLabel: 'About sections',
  tabs: [
    {
      id: 'story',
      label: 'Our story',
      heading: 'Two sisters, one filing cabinet, and a ledger that finally balanced.',
      lede: 'Ethanel Estate Managers was founded in 2024 in Kiambu County by Loise Ndirangu and Racheal Wangui, sisters and advocates who had spent years on the paperwork behind other people’s property.',
      body: 'Their practice sat in the middle of property management and land transactions across Kenya: leases drafted and renewed, sale agreements and title transfers, landlords waiting on statements that never quite reconciled, and rent that arrived on M-Pesa with nobody keeping the books. The pattern repeated in every file. So they built the company they wished their clients had: one that manages the property, collects the rent, pays the landlord on the agreed day, and keeps a ledger any lawyer would sign. Njuguna Njenga joined as Chief Technology Officer to turn that ledger into software — WhatsApp at the front, an append-only ledger underneath.',
      image: 'about-story' as ImageSlotId,
      sideTitle: 'How we work',
      side: [
        { glyph: '01', title: 'Ledger first', body: 'Money is modelled before screens are drawn.' },
        {
          glyph: '02',
          title: 'WhatsApp, not an app',
          body: 'Residents and caretakers never install anything.',
        },
        {
          glyph: '03',
          title: 'Design partners decide',
          body: 'Firms in the programme set the roadmap.',
        },
        { glyph: '04', title: 'No invented numbers', body: 'Placeholders until a fact is real.' },
      ],
    },
    {
      id: 'kenya',
      label: 'Why Kenya first',
      heading: 'Because M-Pesa already moved the money. Nobody was keeping the books.',
      lede: 'Kenya has the rails: mobile money residents trust, WhatsApp on nearly every phone, and letting firms that manage portfolios larger than most software assumes.',
      body: "What is missing is the accounting layer between a resident's M-Pesa confirmation and a landlord's remittance. Ethanel is built for that gap, in shillings, with the vocabulary letting firms already use: organization, resident, landlord, caretaker, management agreement.",
      image: 'about-kenya' as ImageSlotId,
      sideTitle: 'The rails we build on',
      side: [
        { glyph: 'M', title: 'M-Pesa', body: 'STK push, Paybill and B2C remittances.' },
        {
          glyph: 'W',
          title: 'WhatsApp Business',
          body: 'Reminders, receipts, repairs and viewings.',
        },
        { glyph: 'K', title: 'KES ledger', body: 'Double-entry postings, permanent by design.' },
        { glyph: 'C', title: 'Clerk sign-in', body: 'Roles per staff member, per organization.' },
      ],
    },
    {
      id: 'team',
      label: 'The team',
      heading: 'Founded by two advocates. Built with an engineer who has shipped on M-Pesa.',
      lede: 'A small team in Kiambu and Nairobi. We are deliberately few while the design-partner programme runs.',
      body: 'Loise and Racheal bring the years of leases, agreements and land transactions that taught them what breaks. Njuguna brings the platform engineering to make a ledger that never loses a shilling. Names and faces of the wider team arrive here as they join.',
      image: null,
      sideTitle: 'Leadership',
      side: [],
    },
    {
      id: 'launch',
      label: 'Where we launch',
      heading: 'Kiambu, Nairobi, Kajiado and Machakos first.',
      lede: 'The four counties where our design partners manage the most units. Then Mombasa, Nakuru and Nanyuki as agencies there join.',
      body: 'Launching county by county keeps the marketplace honest: a listing only appears where an organization on Ethanel actually manages it. If your county is not on the list yet, your firm can be the one that adds it.',
      image: 'about-launch' as ImageSlotId,
      sideTitle: 'Counties',
      side: [
        { glyph: '●', title: 'Kiambu', body: 'Ruiru, Thika, Juja — home county', tag: 'Launching' },
        {
          glyph: '●',
          title: 'Nairobi',
          body: 'Kilimani, Westlands, Ruaka and more',
          tag: 'Launching',
        },
        {
          glyph: '●',
          title: 'Kajiado',
          body: 'Kitengela, Ongata Rongai, Isinya',
          tag: 'Launching',
        },
        {
          glyph: '●',
          title: 'Machakos',
          body: 'Syokimau, Athi River, Kangundo Road',
          tag: 'Launching',
        },
        {
          glyph: '○',
          title: 'Mombasa · Nakuru · Nanyuki',
          body: 'As agencies there join',
          tag: 'Coming',
        },
      ],
    },
  ],
  team: [
    {
      name: 'Loise Ndirangu',
      role: 'Co-founder',
      bio: 'Advocate. Property management and land transactions across Kenya.',
      image: 'founder-loise' as ImageSlotId,
    },
    {
      name: 'Racheal Wangui',
      role: 'Co-founder',
      bio: 'Advocate. Leases, sale agreements and the paperwork behind them.',
      image: 'founder-racheal' as ImageSlotId,
    },
    {
      name: 'Njuguna Njenga',
      role: 'Chief Technology Officer',
      bio: 'Platform engineering; the ledger, M-Pesa and WhatsApp integrations.',
      image: 'cto-njuguna' as ImageSlotId,
    },
  ],
  closing: {
    title: 'Want to help build it?',
    body: 'Design partners, early hires and land-selling companies in our first four counties.',
    primary: { label: 'Become a design partner', href: '/design-partners' as Route },
    secondary: { label: 'See open roles', href: '/careers' as Route },
  },
} as const;
