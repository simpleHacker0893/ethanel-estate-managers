import type { Metadata } from 'next';

import { ContentPage } from '@/app/(marketing)/_components/content-page';
import { terms } from '@/content/legal';

export const metadata: Metadata = { title: terms.title };

/** Server. Draft terms pending counsel. */
export default function TermsPage() {
  return <ContentPage {...terms} />;
}
