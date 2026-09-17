import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'Bring your rent roll. Leave with a plan.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Book a demo"
      title="Bring your rent roll. Leave with a plan."
      body="A 30-minute walkthrough with your own properties loaded. Use the form on the start page and we'll be in touch."
    />
  );
}
