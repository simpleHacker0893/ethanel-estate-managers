import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'Shape the product, go live first.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Design partners"
      title="Shape the product, go live first."
      body="A small group of letting firms in Nairobi shape what we build next."
    />
  );
}
