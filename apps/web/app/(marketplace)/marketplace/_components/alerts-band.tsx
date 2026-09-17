import { BellIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

import { marketplaceCopy } from '@/content/listings';

/** Server. Saved-search alerts band; the flow itself arrives with listing-svc. */
export function AlertsBand() {
  return (
    <section
      id="alerts"
      aria-labelledby="alerts-title"
      className="scroll-mt-20 bg-navy-950 py-14 text-frost"
    >
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-navy-900 text-pink-400">
            <BellIcon className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 id="alerts-title" className="text-heading-m text-frost">
              {marketplaceCopy.alertsTitle}
            </h2>
            <p className="mt-2 max-w-[56ch] text-body-m text-lavender-muted">
              {marketplaceCopy.alertsBody}
            </p>
          </div>
        </div>
        <Button asChild variant="accent" className="w-full md:w-auto">
          <Link href="/#demo">{marketplaceCopy.alertsCta}</Link>
        </Button>
      </div>
    </section>
  );
}
