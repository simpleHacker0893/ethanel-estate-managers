import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'Sign in to Ethanel.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Sign in"
      title="Sign in to Ethanel."
      body="Organization sign-in arrives with the dashboard. Book a demo to get early access."
    />
  );
}
