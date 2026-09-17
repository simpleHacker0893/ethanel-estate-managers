import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { authCopy } from '@/content/auth';

export const metadata: Metadata = { title: authCopy.signIn.title };

/** Server. Clerk's hosted sign-in component on the Ethanel theme. */
export default function SignInPage() {
  return (
    <div className="container-x section-y">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        <div className="text-center">
          <p className="eyebrow text-iris-700">{authCopy.signIn.eyebrow}</p>
          <h1 className="mt-4 text-display-l">{authCopy.signIn.title}</h1>
          <p className="mt-4 text-body-l text-mist-700">{authCopy.signIn.body}</p>
        </div>
        {/* Clerk's component reads the pathname at runtime; the shell around it still prerenders. */}
        <Suspense
          fallback={
            <div
              className="h-[420px] w-full max-w-[400px] rounded-card border border-mist-200 bg-white"
              aria-hidden="true"
            />
          }
        >
          <SignIn />
        </Suspense>
      </div>
    </div>
  );
}
