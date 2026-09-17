import type { Metadata } from 'next';

import { PlaceholderPage } from '@/app/(marketing)/_components/placeholder-page';

export const metadata: Metadata = { title: 'Privacy policy.' };

/** Server. Placeholder; the designed page ships in a later sprint. */
export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Privacy"
      title="Privacy policy."
      body="The full policy is being finalised with counsel."
    />
  );
}
