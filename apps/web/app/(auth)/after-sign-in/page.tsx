import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { homeFor } from '@ethanel/db';

import { authCopy } from '@/content/auth';
import { getActor } from '@/lib/auth';

export const metadata: Metadata = { title: authCopy.afterSignIn.title, robots: { index: false } };

/**
 * Server. Clerk lands every sign-in here; the data layer decides where this person belongs
 * (organization dashboard, landlord portal or resident surface) and answers with a real
 * redirect, so the segment blocks (`instant = false`). Signed-in people Ethanel does not know
 * yet see the no-access explanation instead of a 403.
 */
export const instant = false;

export default async function AfterSignInPage() {
  const actor = await getActor();
  if (!actor) redirect('/sign-in');
  const home = homeFor(actor);
  if (home) redirect(home);
  return (
    <div className="container-x section-y">
      <div className="max-w-xl">
        <p className="eyebrow text-iris-700">{authCopy.noAccess.eyebrow}</p>
        <h1 className="mt-4 text-display-l">{authCopy.noAccess.title}</h1>
        <p className="mt-4 text-body-l text-mist-700">{authCopy.noAccess.body}</p>
      </div>
    </div>
  );
}
