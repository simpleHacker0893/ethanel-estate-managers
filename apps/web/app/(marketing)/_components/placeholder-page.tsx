import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

/**
 * Server. Heading-only placeholder for routes designed on the canvas but out of Sprint 001 scope.
 * Keeps every nav and footer link resolving (no 404s) with the site shell around it.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="container-x section-y">
      <p className="eyebrow text-iris-700">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-display-l">{title}</h1>
      {body ? <p className="mt-4 max-w-xl text-body-l">{body}</p> : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="accent">
          <Link href="/#demo">Book a demo</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Back to the start</Link>
        </Button>
      </div>
    </div>
  );
}
