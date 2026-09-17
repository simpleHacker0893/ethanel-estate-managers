import type { Metadata } from 'next';

import { ContentPage } from '@/app/(marketing)/_components/content-page';
import { privacy } from '@/content/legal';

export const metadata: Metadata = { title: privacy.title };

/** Server. Draft privacy policy pending counsel. */
export default function PrivacyPage() {
  return <ContentPage {...privacy} />;
}
