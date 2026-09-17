import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { pricing } from '@/content/pricing';

/** Server. Four tiers; the featured one is lifted. Every price carries the introductory label. */
export function TierGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {pricing.tiers.map((tier) => (
        <li key={tier.id}>
          <article
            aria-labelledby={`tier-${tier.id}`}
            className={cn(
              'flex h-full flex-col rounded-card border p-6',
              tier.featured ? 'border-iris-700 bg-navy-950 text-frost' : 'card',
            )}
          >
            <h3
              id={`tier-${tier.id}`}
              className={cn(
                'font-sans text-[20px] leading-7 font-bold',
                tier.featured ? 'text-frost' : 'text-ink',
              )}
            >
              {tier.name}
            </h3>
            <p
              className={cn(
                'mt-1 text-body-s',
                tier.featured ? 'text-lavender-muted' : 'text-mist-500',
              )}
            >
              {tier.unitsLabel}
            </p>
            <p className="mt-5 flex items-baseline gap-1.5">
              <span
                className={cn(
                  'font-sans text-[32px] leading-9 font-bold kes',
                  tier.featured ? 'text-frost' : 'text-ink',
                )}
              >
                {tier.priceLabel}
              </span>
              {tier.priceKesMonthly !== null ? (
                <span
                  className={cn(
                    'text-body-s font-semibold',
                    tier.featured ? 'text-lavender-muted' : 'text-mist-500',
                  )}
                >
                  {pricing.perMonth}
                </span>
              ) : null}
            </p>
            <p
              className={cn(
                'mt-3 text-body-s',
                tier.featured ? 'text-lavender-muted' : 'text-mist-700',
              )}
            >
              {tier.blurb}
            </p>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {tier.highlights.map((h) => (
                <li
                  key={h}
                  className={cn(
                    'flex items-start gap-2.5 text-body-s',
                    tier.featured ? 'text-frost' : 'text-mist-700',
                  )}
                >
                  <CheckIcon
                    className={cn(
                      'mt-1 size-4 shrink-0',
                      tier.featured ? 'text-pink-400' : 'text-teal-700',
                    )}
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                  {h}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={
                tier.featured ? 'accent' : tier.id === 'enterprise' ? 'primary' : 'secondary'
              }
              className="mt-6 w-full"
            >
              <Link href={tier.cta.href}>{tier.cta.label}</Link>
            </Button>
          </article>
        </li>
      ))}
    </ul>
  );
}
