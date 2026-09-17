import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';

export const metadata: Metadata = { title: 'Sign in' };

/** Only same-origin paths are honoured, so `next` can never redirect off the site. */
function safeNext(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  return /^\/(?!\/)[^\s]*$/.test(raw) ? raw : null;
}

const describe: Record<string, string> = {
  '/marketplace#alerts': 'save this search and get WhatsApp alerts',
  '/marketplace': 'book a viewing',
  '/org': 'list your property',
};

async function Continuation({
  searchParams,
}: {
  searchParams: PageProps<'/sign-in'>['searchParams'];
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (!next) return null;
  const what =
    describe[next] ??
    (next.startsWith('/marketplace?listing=') ? 'book a viewing' : `continue to ${next}`);
  return (
    <p
      className="mt-4 rounded-card border border-iris-200 bg-iris-50 px-4 py-3 text-body-m text-ink"
      data-next={next}
    >
      Sign in to {what}. You will be sent back to where you were.
    </p>
  );
}

/** Server. Placeholder until Clerk arrives (Q-10); reads ?next under Suspense so the shell stays static. */
export default function SignInPage({ searchParams }: PageProps<'/sign-in'>) {
  return (
    <div className="container-x section-y">
      <Eyebrow className="text-iris-700">Sign in</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-display-l">Sign in to Ethanel Estate Managers.</h1>
      <Suspense fallback={null}>
        <Continuation searchParams={searchParams} />
      </Suspense>
      <p className="mt-4 max-w-xl text-body-l">
        Organization sign-in arrives with the dashboard. Book a demo to get early access, or browse
        the marketplace without an account.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="accent">
          <Link href="/demo">Book a demo</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/marketplace">Browse the marketplace</Link>
        </Button>
      </div>
    </div>
  );
}
