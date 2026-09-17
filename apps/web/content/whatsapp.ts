/**
 * Prefilled WhatsApp intro messages. Every wa.me link on the site opens the chat with one of
 * these so the first message is already typed. Keep them short: they show in the composer.
 */
const greeting = 'Hi Ethanel Estate Managers,';

export const whatsappIntros = {
  general: () => `${greeting} I'd like to know more about managing my property with you.`,
  listingEnquiry: ({ title, id }: { title: string; id: string }) =>
    `${greeting} I'm interested in "${title}" (listing ${id}). Is it still available, and can I book a viewing?`,
  demo: () => `${greeting} I'd like to book a demo for my portfolio.`,
  contact: () => `${greeting} I have a question about Ethanel.`,
  press: () => `${greeting} I'm getting in touch about press or partnerships.`,
  pricing: () => `${greeting} I'd like to talk about pricing for my portfolio.`,
} as const;
