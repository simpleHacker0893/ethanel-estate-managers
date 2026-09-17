import type { Route } from 'next';

import type { NavIconName } from '@/components/site/nav-icon';
import type { ImageSlotId } from '@/content/images';

/** Company hub. Copy from the canvas "Company / Hub + contact 1440". */
export const company = {
  eyebrow: 'Company',
  title: "A ledger for Kenya's rent, built with the firms who run it.",
  lede: 'We are a small team in Kiambu and Nairobi building Ethanel Estate Managers alongside a handful of letting firms and land-selling companies. They tell us what breaks; we ship the fix.',
  image: 'company-hero' as ImageSlotId,
  partnerCard: {
    eyebrow: 'Design partner programme',
    title: 'Shape the product. Go live first.',
    body: 'A monthly call, early access to every release, and founding-customer terms confirmed in your agreement.',
    cta: { label: 'Become a design partner', href: '/design-partners' as Route },
  },
  findTitle: "What you'll find here",
  links: [
    {
      icon: 'handshake' as NavIconName,
      title: 'Design partners',
      body: 'Who they are, what the programme asks of you, and what you get back.',
      cta: 'Read the programme',
      href: '/design-partners' as Route,
    },
    {
      icon: 'tag' as NavIconName,
      title: 'Pricing',
      body: 'Four plans from Free to Enterprise, priced by the units you manage and the features you switch on.',
      cta: 'See pricing',
      href: '/pricing' as Route,
    },
    {
      icon: 'briefcase' as NavIconName,
      title: 'Careers',
      body: 'Engineers, a designer and a customer lead who have chased rent in Nairobi. Roles open as we grow.',
      cta: 'See open roles',
      href: '/careers' as Route,
    },
    {
      icon: 'newspaper' as NavIconName,
      title: 'Press & brand',
      body: 'Logos, the palette, a one-paragraph description, three stories and who to email.',
      cta: 'Open the press kit',
      href: '/press' as Route,
    },
    {
      icon: 'shield-check' as NavIconName,
      title: 'Trust & security',
      body: "Postings are permanent. Each organization's data is its own. Sign-in via Clerk with roles per staff member.",
      cta: 'Read the trust page',
      href: '/trust' as Route,
    },
    {
      icon: 'message-circle' as NavIconName,
      title: 'Contact / WhatsApp us',
      body: 'A person replies on the channel you prefer. Offices in Kiambu and Nairobi; visits by appointment.',
      cta: 'WhatsApp us',
      href: '/company#contact' as Route,
    },
  ],
  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about your portfolio.',
    body: 'How many units, which counties, and what hurts most today. We reply within one working day.',
    // ASSUMPTION (QUESTIONS.md Q-04): reply-time wording is copy, not a commitment.
    address: 'Kiambu & Nairobi, Kenya · visits by appointment',
    form: {
      name: 'Your name',
      organization: 'Organization',
      whatsapp: 'WhatsApp number',
      units: 'Units you manage',
      interest: "I'm interested in",
      message: 'What hurts most today?',
      note: 'We reply on WhatsApp unless you ask for email.',
      submit: 'Send',
      success: "Thanks — we'll WhatsApp you within one working day.",
      unitOptions: [
        { value: 'none', label: 'None yet' },
        { value: '1-5', label: '1 – 5' },
        { value: '6-20', label: '6 – 20' },
        { value: '21-50', label: '21 – 50' },
        { value: '51-150', label: '51 – 150' },
        { value: '151-300', label: '151 – 300' },
        { value: '301-plus', label: 'More than 300' },
      ],
      interestOptions: [
        { value: 'demo', label: 'A demo' },
        { value: 'pricing', label: 'Pricing for my portfolio' },
        { value: 'design-partner', label: 'The design partner programme' },
        { value: 'list-plots', label: 'Listing plots on the marketplace' },
        { value: 'press', label: 'Press or partnerships' },
        { value: 'other', label: 'Something else' },
      ],
    },
  },
} as const;
