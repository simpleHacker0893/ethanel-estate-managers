import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = {
  title: 'Everything a letting firm does each month, on one ledger.',
};

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Products"
      title="Everything a letting firm does each month, on one ledger."
      body="Rent collection, leases and residents, remittances, repairs and reports. The full product overview is on its way."
    />
  );
}
