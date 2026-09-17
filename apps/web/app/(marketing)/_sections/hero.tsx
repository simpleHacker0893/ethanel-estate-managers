import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { RentRunCard } from '@/app/(marketing)/_components/rent-run-card';
import { Eyebrow } from '@/app/(marketing)/_components/section';
import { WhatsAppBubble } from '@/app/(marketing)/_components/whatsapp-bubble';
import { landing } from '@/content/landing';

const dot = {
  mpesa: 'bg-mpesa',
  whatsapp: 'bg-whatsapp',
  pink: 'bg-pink-500',
  iris: 'bg-iris-600',
} as const;

/** Server. navy-950, 7/5 split, copy left. The only <h1> on the site. */
export function Hero() {
  const h = landing.hero;
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="reveal bg-navy-950 section-y text-frost"
    >
      <div className="container-x grid-12 items-center gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <Eyebrow dot="pink" className="text-pink-400">
            {h.eyebrow}
          </Eyebrow>
          <h1 id="hero-title" className="mt-5 max-w-[15ch] text-display-xl text-frost">
            {h.title}
          </h1>
          <p className="mt-6 max-w-[56ch] text-body-l text-lavender-muted">{h.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" className="w-full sm:w-auto">
              <Link href={h.primaryCta.href}>{h.primaryCta.label}</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href={h.secondaryCta.href}>{h.secondaryCta.label}</Link>
            </Button>
          </div>
          <p className="mt-8 text-body-s text-lavender-muted">{h.launchLine}</p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Works with">
            {h.chips.map((chip) => (
              <li
                key={chip.label}
                className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900 px-3 py-1.5 text-label-s font-semibold text-frost"
              >
                <span className={cn('dot-8', dot[chip.dot])} aria-hidden="true" />
                {chip.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 grid gap-5 lg:col-span-5 lg:max-w-[460px] lg:justify-self-end xl:max-w-none">
          <RentRunCard />
          <WhatsAppBubble />
        </div>
      </div>
    </section>
  );
}
