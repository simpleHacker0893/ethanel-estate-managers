import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = {
  title: "A small team in Nairobi building a ledger for Kenya's rent.",
};

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title={"A small team in Nairobi building a ledger for Kenya's rent."}
      body="Contact, design partners, pricing and press live here soon. WhatsApp us in the meantime."
    />
  );
}
