import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

/** Server. Rendered for unknown routes; also the `/_not-found` static page. */
export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <main id="main" className="container-x min-h-dvh section-y">
      <p className="eyebrow text-iris-700">{t('eyebrow')}</p>
      <h1 className="mt-4 max-w-2xl text-display-l">{t('title')}</h1>
      <p className="mt-4 max-w-xl text-body-l">{t('body')}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary">
          <Link href="/">{t('home')}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/marketplace">{t('marketplace')}</Link>
        </Button>
      </div>
    </main>
  );
}
