import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = {
  title: 'Priced by the units and properties you manage, and the features you switch on.',
};

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Pricing"
      title="Priced by the units and properties you manage, and the features you switch on."
      body="Land-selling companies pay for what they market, not for a rent roll they don't run. We'll walk you through it on a call."
    />
  );
}
