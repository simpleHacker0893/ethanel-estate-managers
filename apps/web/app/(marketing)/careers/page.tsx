import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: "Build a ledger for Kenya's rent." };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Careers"
      title={"Build a ledger for Kenya's rent."}
      body="Roles will be listed here as the team grows."
    />
  );
}
