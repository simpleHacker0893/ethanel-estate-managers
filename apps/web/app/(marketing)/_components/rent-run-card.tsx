import { cn } from '@ethanel/ui/lib/cn';

import { landing } from '@/content/landing';

const tone = {
  pink: 'text-pink-700',
  iris: 'text-iris-700',
  muted: 'text-mist-500',
} as const;

/** Server. Sample rent-run summary card in the hero. Every figure is from content/landing.ts. */
export function RentRunCard() {
  const c = landing.hero.rentRun;
  return (
    <div className="card p-5 text-ink" data-sample>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-s font-semibold text-mist-500">{c.title}</p>
          <p className="mt-0.5 text-label-m font-semibold">{c.property}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-1 text-label-s font-semibold text-teal">
          <span className="dot-8 bg-teal" aria-hidden="true" />
          {c.status}
        </span>
      </div>

      <p className="mt-5 font-sans text-[32px] leading-9 font-bold tracking-[-0.01em] kes">
        {c.collected}
      </p>
      <p className="mt-1 text-body-s text-mist-500">{c.collectedNote}</p>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={c.progressPercent}
        aria-label={c.progressLabel}
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-mist-100"
      >
        <div className="h-full rounded-full bg-teal" style={{ width: `${c.progressPercent}%` }} />
      </div>

      <dl className="mt-4 divide-y divide-mist-100 border-t border-mist-100">
        {c.rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-body-s text-mist-700">{row.label}</dt>
            <dd className={cn('text-body-s font-semibold kes', tone[row.tone])}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
