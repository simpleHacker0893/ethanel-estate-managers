import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { landing } from '@/content/landing';

/** Server. iris-50 band. No numbers, by decision. */
export function PricingTeaser() {
  const s = landing.pricing;
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="reveal bg-iris-50 section-y">
      <div className="container-x grid-12 items-center gap-y-8">
        <div className="col-span-12 lg:col-span-8">
          <Eyebrow className="text-iris-700">{s.eyebrow}</Eyebrow>
          <h2 id="pricing-title" className="mt-4 max-w-[26ch] text-display-l">
            {s.title}
          </h2>
          <p className="mt-5 max-w-[60ch] text-body-l text-mist-700">{s.body}</p>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:justify-self-end">
          <Button asChild variant="primary" className="w-full sm:w-auto">
            <Link href={s.cta.href}>{s.cta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
