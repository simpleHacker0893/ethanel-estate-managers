/** Copy for sign-in, sign-up, the post-sign-in router and the 403 page. */
export const authCopy = {
  signIn: {
    eyebrow: 'Sign in',
    title: 'Sign in to Ethanel.',
    body: 'Staff, landlords and residents use the same door. Where you land depends on your role.',
  },
  signUp: {
    eyebrow: 'Create an account',
    title: 'Create your Ethanel account.',
    body: 'Your organization adds you to its portfolio after you sign up. Demo accounts on the landing page need no sign-up.',
  },
  afterSignIn: {
    title: 'Signing you in',
    loading: 'Finding your organization…',
  },
  noAccess: {
    eyebrow: 'Almost there',
    title: 'Your account is not linked to an organization yet.',
    body: 'Ask your organization to add you, or use one of the demo accounts on the landing page to look around.',
  },
  forbidden: {
    eyebrow: 'No access',
    title: "You don't have access to this page.",
    body: 'This organization, portfolio or lease is not linked to your account. If it should be, ask the organization that manages it.',
    home: 'Back to the start',
    signIn: 'Sign in with another account',
  },
  app: {
    signOutHint: 'Account',
    dashboard: 'Dashboard',
    settings: 'Settings',
    landlord: 'Landlord portal',
    resident: 'Your home',
    sampleNote:
      'Demo organization on sample data. Nothing here is a real lease, payment or person.',
  },
} as const;
