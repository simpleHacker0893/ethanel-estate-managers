import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

import { authCopy } from '@/content/auth';

/**
 * Server. Rendered when a guard in lib/auth.ts calls forbidden(). Under Cache Components the
 * response is already streaming, so the status is 200 and this page is the refusal (ADR-001).
 */
export default function Forbidden() {
  const s = authCopy.forbidden;
  return (
    <main id="main" className="container-x min-h-dvh section-y">
      <p className="eyebrow text-iris-700">{s.eyebrow}</p>
      <h1 className="mt-4 max-w-2xl text-display-l">{s.title}</h1>
      <p className="mt-4 max-w-xl text-body-l">{s.body}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary">
          <Link href="/">{s.home}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/sign-in">{s.signIn}</Link>
        </Button>
      </div>
    </main>
  );
}
