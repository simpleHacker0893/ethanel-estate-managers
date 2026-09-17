/**
 * Mirror of the demo personas in `@ethanel/db/fixtures` (packages/testing cannot depend on a
 * package that pulls Prisma into the Playwright runtime). Keep the two in step; the
 * `fixtures mirror` test in auth.spec.ts fails loudly when they drift.
 */
export interface DemoUser {
  readonly persona: 'admin' | 'staff' | 'caretaker' | 'landlord' | 'resident' | 'savannahOwner';
  readonly email: string;
  readonly clerkUserId: string;
  readonly home: string;
}

export const demoUsers: readonly DemoUser[] = [
  {
    persona: 'admin',
    email: 'demo.admin@ethanel.co.ke',
    clerkUserId: 'user_demo_admin',
    home: '/org/riverside-lettings',
  },
  {
    persona: 'staff',
    email: 'demo.staff@ethanel.co.ke',
    clerkUserId: 'user_demo_staff',
    home: '/org/riverside-lettings',
  },
  {
    persona: 'caretaker',
    email: 'demo.caretaker@ethanel.co.ke',
    clerkUserId: 'user_demo_caretaker',
    home: '/org/riverside-lettings',
  },
  {
    persona: 'landlord',
    email: 'demo.landlord@ethanel.co.ke',
    clerkUserId: 'user_demo_landlord',
    home: '/landlord',
  },
  {
    persona: 'resident',
    email: 'demo.resident@ethanel.co.ke',
    clerkUserId: 'user_demo_resident',
    home: '/me',
  },
  {
    persona: 'savannahOwner',
    email: 'demo.savannah@ethanel.co.ke',
    clerkUserId: 'user_demo_savannah',
    home: '/org/savannah-land',
  },
];
