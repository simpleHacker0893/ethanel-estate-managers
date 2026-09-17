import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'How the ledger and your data are protected.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Trust & security"
      title="How the ledger and your data are protected."
      body="Postings are permanent, every organization is its own tenancy, and staff see only what their role allows."
    />
  );
}
