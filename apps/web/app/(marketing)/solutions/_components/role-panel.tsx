import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { SceneImageSlot } from '@/components/media/scene-image-slot';
import { roles, solutionsPage, type RoleId } from '@/content/solutions';

import { RoleTabs } from './role-tabs';

const valueTone = {
  ink: 'text-ink',
  pink: 'text-pink-700',
  iris: 'text-iris-700',
  teal: 'text-teal-700',
  amber: 'text-amber-700',
} as const;

/** Server. Hero with the role's scene image behind a navy overlay, then the role detail. */
export function RolePanel({ roleId: id }: { roleId: RoleId }) {
  const role = roles[id];
  return (
    <>
      <section
        aria-labelledby="solutions-title"
        className="relative isolate overflow-hidden bg-navy-950 text-frost"
      >
        <SceneImageSlot
          slot={role.image}
          variant="hero"
          priority
          attribution="sr-only"
          className="opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40"
        />
        <div className="relative container-x pt-16 pb-10 md:pt-20 md:pb-12">
          <Eyebrow className="text-pink-400">{solutionsPage.eyebrow}</Eyebrow>
          <h1 id="solutions-title" className="mt-4 max-w-[16ch] text-display-xl text-frost">
            {solutionsPage.title}
          </h1>
          <p className="mt-4 max-w-[48ch] text-body-l text-lavender-muted">{solutionsPage.lede}</p>
          <div className="mt-10">
            <RoleTabs active={id} />
          </div>
        </div>
      </section>

      <section aria-labelledby="role-title" className="reveal bg-mist-50 section-y">
        <div className="container-x grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-6">
            <Eyebrow className="text-iris-700">{role.eyebrow}</Eyebrow>
            <h2 id="role-title" className="mt-4 max-w-[20ch] text-display-l">
              {role.heading}
            </h2>
            <p className="mt-5 max-w-[56ch] text-body-l text-mist-700">{role.lede}</p>
            <ul className="mt-8 flex flex-col gap-4">
              {role.points.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-iris-100 text-iris-700">
                    <CheckIcon className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
                  </span>
                  <span>
                    <span className="block font-sans text-label-m font-semibold text-ink">
                      {point.title}
                    </span>
                    <span className="block text-body-s text-mist-700">{point.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" className="w-full sm:w-auto">
                <Link href={role.cta.href}>{role.cta.label}</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href={solutionsPage.seeProducts.href}>{solutionsPage.seeProducts.label}</Link>
              </Button>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-5 lg:col-span-5 lg:col-start-8">
            <SceneImageSlot slot={role.image} variant="card" />
            <div
              className={cn(
                'rounded-card border p-5 text-ink',
                role.tone === 'iris' && 'border-iris-200 bg-iris-50',
                role.tone === 'pink' && 'border-pink-200 bg-pink-100',
                role.tone === 'plain' && 'border-mist-200 bg-white',
              )}
              data-sample
            >
              <p className="text-label-s font-semibold text-mist-500">{role.mock.title}</p>
              <p className="mt-0.5 text-label-m font-semibold">{role.mock.head}</p>
              <dl className="mt-4 divide-y divide-mist-200/70 border-t border-mist-200/70">
                {role.mock.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-body-s text-mist-700">{row.label}</dt>
                    <dd className={cn('text-body-s font-semibold kes', valueTone[row.tone])}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-body-s text-mist-500">{role.mock.note}</p>
            </div>
            <div className="rounded-card border border-mist-200 bg-white p-5">
              <p className="eyebrow text-mist-500">{solutionsPage.whereTitle}</p>
              <p className="mt-2 text-body-m text-ink">{role.livesIn}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="solutions-closing" className="bg-navy-950 py-14 text-frost">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="solutions-closing" className="text-heading-m text-frost">
              {solutionsPage.closing.title}
            </h2>
            <p className="mt-2 max-w-[56ch] text-body-m text-lavender-muted">
              {solutionsPage.closing.body}
            </p>
          </div>
          <Button asChild variant="accent" className="w-full md:w-auto">
            <Link href={solutionsPage.closing.cta.href}>{solutionsPage.closing.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
