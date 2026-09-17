import { DEMO_PASSWORD, demoUsers, type Persona } from '@ethanel/db/fixtures';

/**
 * Demo accounts shown on the landing page. Derived from the seed fixtures so the copy can never
 * drift from what `pnpm --filter @ethanel/db seed` and `seed:clerk` create. Sample people, sample
 * organization, sample figures.
 */
const personaCopy: Record<Persona, { label: string; sees: string }> = {
  admin: {
    label: 'Organization owner',
    sees: 'Rent run, properties, ledger, people and settings for Riverside Lettings',
  },
  staff: { label: 'Staff', sees: 'The Riverside Lettings dashboard, without settings' },
  caretaker: { label: 'Caretaker', sees: 'The Riverside Lettings dashboard and open work orders' },
  landlord: {
    label: 'Landlord',
    sees: 'Her statement for Riverside Court: collected, fees, remitted',
  },
  resident: {
    label: 'Resident',
    sees: 'Her lease at Riverside Court B4, receipts and repair requests',
  },
  savannahOwner: {
    label: 'Owner, second organization',
    sees: 'Savannah Land Co. only, never Riverside Lettings',
  },
};

export const demoAccounts = {
  eyebrow: 'Try it',
  title: 'Sign in with a demo account.',
  body: 'Six sample people across two sample organizations. Every figure is illustrative and nothing here is a real lease, payment or person.',
  columns: {
    persona: 'Role',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    sees: 'What you will see',
  },
  signIn: 'Sign in',
  password: DEMO_PASSWORD,
  note: 'One password for every demo account. Accounts are reset from time to time.',
  rows: demoUsers.map((user) => ({
    persona: personaCopy[user.persona].label,
    name: user.fullName,
    email: user.email,
    sees: personaCopy[user.persona].sees,
    home: user.home,
  })),
} as const;
