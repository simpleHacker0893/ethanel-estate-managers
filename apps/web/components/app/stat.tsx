import type { ReactNode } from 'react';

/** Server. One figure with its label. KES figures pass `tabular` so digits line up. */
export function Stat({
  label,
  value,
  note,
  tone = 'ink',
}: {
  label: string;
  value: ReactNode;
  note?: string;
  tone?: 'ink' | 'pink' | 'iris' | 'teal';
}) {
  const tones = {
    ink: 'text-ink',
    pink: 'text-pink-700',
    iris: 'text-iris-700',
    teal: 'text-teal-700',
  } as const;
  return (
    <div className="card p-5">
      <p className="text-label-s font-semibold tracking-wide text-mist-500 uppercase">{label}</p>
      <p className={`mt-2 font-sans text-heading-m font-bold tabular-nums ${tones[tone]}`}>
        {value}
      </p>
      {note ? <p className="mt-1 text-body-s text-mist-500">{note}</p> : null}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="card p-5">
      <h2 className="font-sans text-[18px] leading-6 font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

export function humanize(value: string): string {
  return value.replace(/_/g, ' ');
}
