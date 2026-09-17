import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { authCopy } from '@/content/auth';

export const metadata: Metadata = { title: authCopy.signIn.title };

/** Only same-origin paths are honoured, so `next` can never redirect off the site (P-24, Q-30). */
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

/**
 * Server. Clerk's sign-in component on the Ethanel theme. With a same-origin `?next=` (the
 * marketplace handoff for viewings, listing and alerts) the person is sent straight back there;
 * otherwise Clerk lands on /after-sign-in, where the data layer picks their surface. Reads
 * `searchParams` under Suspense so the page shell still prerenders.
 */
export default function SignInPage({ searchParams }: PageProps<'/sign-in/[[...sign-in]]'>) {
  return (
    <div className="container-x section-y">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        <div className="text-center">
          <p className="eyebrow text-iris-700">{authCopy.signIn.eyebrow}</p>
          <h1 className="mt-4 text-display-l">{authCopy.signIn.title}</h1>
          <p className="mt-4 text-body-l text-mist-700">{authCopy.signIn.body}</p>
        </div>
        <Suspense
          fallback={
            <div
              className="h-[420px] w-full max-w-[400px] rounded-card border border-mist-200 bg-white"
              aria-hidden="true"
            />
          }
        >
          <SignInWithNext searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function SignInWithNext({
  searchParams,
}: {
  searchParams: PageProps<'/sign-in/[[...sign-in]]'>['searchParams'];
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const what = next
    ? (describe[next] ??
      (next.startsWith('/marketplace?listing=') ? 'book a viewing' : `continue to ${next}`))
    : null;
  return (
    <>
      {next ? (
        <p
          className="rounded-card border border-iris-200 bg-iris-50 px-4 py-3 text-body-m text-ink"
          data-next={next}
        >
          Sign in to {what}. You will be sent back to where you were.
        </p>
      ) : null}
      <SignIn {...(next ? { forceRedirectUrl: next, signUpForceRedirectUrl: next } : {})} />
    </>
  );
}
