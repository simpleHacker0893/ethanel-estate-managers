import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'Why Ethanel exists.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="About"
      title="Why Ethanel exists."
      body="Letting firms run on spreadsheets and goodwill. We are building the ledger underneath."
    />
  );
}
