import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = {
  title: 'Built for letting firms, land-selling companies, landlords, caretakers and residents.',
};

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Solutions"
      title="Built for letting firms, land-selling companies, landlords, caretakers and residents."
      body="Pick who you are and see what changes on the first of next month."
    />
  );
}
