import type { Metadata } from 'next';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { designPartners as d } from '@/content/design-partners';

export const metadata: Metadata = { title: 'Design partners', description: d.lede };

/** Server. Programme page from the canvas; applying goes through the company contact form. */
export default function DesignPartnersPage() {
  return (
    <>
      <section aria-labelledby="dp-title" className="bg-navy-950 py-16 text-frost md:py-20">
        <div className="container-x">
          <Eyebrow className="text-pink-400">{d.eyebrow}</Eyebrow>
          <h1 id="dp-title" className="mt-4 max-w-[16ch] text-display-xl text-frost">
            {d.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-body-l text-lavender-muted">{d.lede}</p>
        </div>
      </section>
      <section aria-labelledby="dp-exchange" className="bg-mist-50 section-y">
        <div className="container-x">
          <h2 id="dp-exchange" className="max-w-[24ch] text-display-l">
            {d.exchangeTitle}
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[d.give, d.get].map((col, i) => (
              <div
                key={col.title}
                className={
                  i === 0
                    ? 'rounded-door border border-iris-200 bg-iris-50 p-8'
                    : 'rounded-door border border-pink-200 bg-pink-100 p-8'
                }
              >
                <p className={i === 0 ? 'eyebrow text-iris-700' : 'eyebrow text-pink-700'}>
                  {col.title}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-m text-mist-700">
                      <span
                        className={
                          i === 0
                            ? 'mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-iris-100 text-iris-700'
                            : 'mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-pink-200 text-pink-700'
                        }
                      >
                        <CheckIcon className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="dp-steps" className="bg-navy-950 section-y text-frost">
        <div className="container-x">
          <h2 id="dp-steps" className="text-display-l text-frost">
            {d.stepsTitle}
          </h2>
          <p className="mt-3 text-body-l text-lavender-muted">{d.stepsLede}</p>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {d.steps.map((step) => (
              <li key={step.n} className="rounded-card border border-navy-800 bg-navy-900 p-6">
                <span
                  className="font-display text-[32px] leading-none font-semibold text-pink-400 kes"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <h3 className="mt-4 font-sans text-[18px] leading-6 font-bold text-frost">
                  {step.title}
                </h3>
                <p className="mt-2 text-body-s text-lavender-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section aria-labelledby="dp-fit" className="bg-mist-50 section-y">
        <div className="container-x grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="dp-fit" className="text-display-l">
              {d.fitTitle}
            </h2>
          </div>
          <ul className="col-span-12 flex flex-col divide-y divide-mist-200 lg:col-span-8">
            {d.fits.map((fit) => (
              <li key={fit.title} className="py-5 first:pt-0">
                <h3 className="font-sans text-[18px] leading-6 font-bold text-ink">{fit.title}</h3>
                <p className="mt-1.5 text-body-m text-mist-700">{fit.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="dp-apply" className="bg-iris-50 py-14">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="dp-apply" className="text-heading-m">
              {d.apply.title}
            </h2>
            <p className="mt-2 max-w-[60ch] text-body-m text-mist-700">{d.apply.body}</p>
          </div>
          <Button asChild variant="primary" className="w-full md:w-auto">
            <Link href={d.apply.cta.href}>{d.apply.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
