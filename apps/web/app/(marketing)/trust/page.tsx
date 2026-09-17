import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { NavIconBadge } from '@/components/site/nav-icon';
import { trust } from '@/content/legal';

export const metadata: Metadata = { title: 'Trust & security', description: trust.lede };

const icons = ['shield-check', 'bar-chart', 'wallet', 'building', 'key', 'users'] as const;

/** Server. Trust page from the canvas, with the roadmap list of things not yet claimed. */
export default function TrustPage() {
  let i = 0;
  return (
    <>
      <section aria-labelledby="trust-title" className="bg-navy-950 py-16 text-frost md:py-20">
        <div className="container-x">
          <Eyebrow className="text-pink-400">{trust.eyebrow}</Eyebrow>
          <h1 id="trust-title" className="mt-4 max-w-[20ch] text-display-xl text-frost">
            {trust.title}
          </h1>
          <p className="mt-5 max-w-[56ch] text-body-l text-lavender-muted">{trust.lede}</p>
        </div>
      </section>
      {trust.groups.map((group, g) => (
        <section
          key={group.title}
          aria-labelledby={`trust-group-${g}`}
          className={g % 2 ? 'bg-white section-y' : 'bg-mist-50 section-y'}
        >
          <div className="container-x">
            <h2 id={`trust-group-${g}`} className="text-heading-m">
              {group.title}
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
              {group.items.map((item) => {
                const icon = icons[i++ % icons.length] ?? 'shield-check';
                return (
                  <li key={item.title} className="card p-7">
                    <NavIconBadge name={icon} size={48} />
                    <h3 className="mt-5 font-sans text-[18px] leading-6 font-bold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-body-s text-mist-700">{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}
      <section aria-labelledby="trust-roadmap" className="bg-mist-50 section-y">
        <div className="container-x">
          <h2 id="trust-roadmap" className="text-heading-m">
            {trust.roadmapTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-body-m text-mist-700">{trust.roadmapLede}</p>
          <dl className="mt-8 divide-y divide-mist-200 border-t border-mist-200">
            {trust.roadmap.map((item) => (
              <div key={item.title} className="grid gap-2 py-5 md:grid-cols-[4fr_8fr] md:gap-6">
                <dt className="flex items-center gap-2.5 font-sans text-label-m font-semibold text-ink">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-label-s text-amber-700">
                    Roadmap
                  </span>
                  {item.title}
                </dt>
                <dd className="text-body-m text-mist-700">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section aria-labelledby="trust-report" className="bg-iris-50 py-14">
        <div className="container-x flex flex-col gap-5 card p-7 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="trust-report" className="font-sans text-[18px] leading-6 font-bold text-ink">
              {trust.report.title}
            </h2>
            <p className="mt-2 max-w-[64ch] text-body-s text-mist-700">{trust.report.body}</p>
          </div>
          <Button asChild variant="primary">
            <Link href="/company?interest=other#contact">{trust.report.cta}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
