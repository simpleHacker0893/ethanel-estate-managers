import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'Logos, colours and who to talk to.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Press & brand"
      title="Logos, colours and who to talk to."
      body="Brand assets and press contacts are coming."
    />
  );
}
