import { cn } from '@ethanel/ui/lib/cn';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { NavIconBadge } from '@/components/site/nav-icon';
import { landing } from '@/content/landing';

function Receipt() {
  const r = landing.features.receipt;
  return (
    <div className="w-full max-w-[300px] card p-4 text-ink" data-sample>
      <p className="text-label-s font-semibold text-mist-500">{r.title}</p>
      <p className="mt-2 font-sans text-[26px] leading-8 font-bold kes">{r.amount}</p>
      <dl className="mt-3 divide-y divide-mist-100 border-t border-mist-100 text-body-s">
        {r.rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-2">
            <dt className="text-mist-500">{row.label}</dt>
            <dd className="font-semibold">{row.value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-mist-500">{r.postedLabel}</dt>
          <dd className="inline-flex items-center gap-1.5 font-semibold text-teal">
            <span className="dot-8 bg-teal" aria-hidden="true" />
            {r.postedValue}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** Server. Bento: 2fr 1fr 1fr on the first row, 1fr 1fr 1fr on the second. */
export function WhatYouGet() {
  const s = landing.features;
  return (
    <section id="features" aria-labelledby="features-title" className="reveal bg-mist-50 section-y">
      <div className="container-x">
        <Eyebrow className="text-iris-700">{s.eyebrow}</Eyebrow>
        <h2 id="features-title" className="mt-4 max-w-[24ch] text-display-l">
          {s.title}
        </h2>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          {s.tiles.map((tile, index) => (
            <li
              key={tile.id}
              className={cn(
                'reveal flex card-hover flex-col card p-7',
                tile.wide && 'md:col-span-2 lg:col-span-1 lg:flex-row lg:items-start lg:gap-8',
              )}
              style={{ ['--i' as string]: index }}
            >
              <div className="flex flex-1 flex-col">
                <NavIconBadge name={tile.icon} size={48} />
                <h3 className="mt-5 font-sans text-[20px] leading-7 font-bold text-ink">
                  {tile.title}
                </h3>
                <p className="mt-2 text-body-m text-mist-700">{tile.body}</p>
              </div>
              {tile.wide ? (
                <div className="mt-6 lg:mt-0 lg:shrink-0">
                  <Receipt />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
