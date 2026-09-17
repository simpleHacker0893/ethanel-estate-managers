import { CheckIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { landing } from '@/content/landing';

interface Door {
  readonly eyebrow: string;
  readonly title: string;
  readonly bullets: readonly string[];
  readonly cta: { readonly label: string; readonly href: Route };
}

function DoorPanel({
  door,
  tone,
  headingId,
  variant,
}: {
  door: Door;
  tone: 'iris' | 'pink';
  headingId: string;
  variant: 'primary' | 'accent';
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-door border p-7 md:p-9 lg:p-10',
        tone === 'iris' ? 'border-iris-200 bg-iris-50' : 'border-pink-200 bg-pink-100',
      )}
    >
      <Eyebrow className={tone === 'iris' ? 'text-iris-700' : 'text-pink-700'}>
        {door.eyebrow}
      </Eyebrow>
      <h2 id={headingId} className="mt-4 max-w-[22ch] text-display-l">
        {door.title}
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {door.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-body-m text-mist-700">
            <span
              className={cn(
                'mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full',
                tone === 'iris' ? 'bg-iris-100 text-iris-700' : 'bg-pink-200 text-pink-700',
              )}
            >
              <CheckIcon className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-8 md:mt-auto md:pt-8">
        <Button asChild variant={variant} className="w-full sm:w-auto">
          <Link href={door.cta.href}>{door.cta.label}</Link>
        </Button>
      </div>
    </div>
  );
}

/** Server. Two doors: firms (iris) and residents/buyers (pink). */
export function Doors() {
  return (
    <section id="doors" aria-labelledby="doors-firms-title" className="reveal bg-mist-50 section-y">
      <div className="container-x grid gap-6 lg:grid-cols-2">
        <DoorPanel
          door={landing.doors.firms}
          tone="iris"
          headingId="doors-firms-title"
          variant="primary"
        />
        <DoorPanel
          door={landing.doors.residents}
          tone="pink"
          headingId="doors-residents-title"
          variant="accent"
        />
      </div>
    </section>
  );
}
