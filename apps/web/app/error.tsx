'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@ethanel/ui/components/button';

/** Client: Next requires error boundaries to be client components. */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="container-x min-h-dvh section-y">
      <p className="eyebrow text-coral">{t('eyebrow')}</p>
      <h1 className="mt-4 max-w-2xl text-display-l">{t('title')}</h1>
      <p className="mt-4 max-w-xl text-body-l">{t('body')}</p>
      <div className="mt-8">
        <Button variant="primary" onClick={reset}>
          {t('retry')}
        </Button>
      </div>
    </main>
  );
}
