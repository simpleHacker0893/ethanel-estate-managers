import { Suspense } from 'react';

import { landlordPortal } from '@ethanel/db';

import { Panel, Stat, formatDate, humanize } from '@/components/app/stat';
import { authCopy } from '@/content/auth';
import { requireLandlord } from '@/lib/auth';
import { formatKes } from '@/lib/money/format.money';

/** Server. Live statement per landlord row: collected, fees, remitted, and the postings behind them. */
export default function LandlordHomePage() {
  return (
    <Suspense
      fallback={
        <h1 className="font-sans text-heading-m font-bold text-ink">{authCopy.app.landlord}</h1>
      }
    >
      <Portal />
    </Suspense>
  );
}

async function Portal() {
  const actor = await requireLandlord();
  const statements = await landlordPortal(actor);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-iris-700">{authCopy.app.landlord}</p>
        <h1 className="mt-2 font-sans text-heading-m font-bold text-ink">{actor.fullName}</h1>
        <p className="mt-2 text-body-s text-mist-500">{authCopy.app.sampleNote}</p>
      </div>
      {statements.map((s) => (
        <section
          key={s.landlordId}
          aria-label={`Statement for ${s.landlordName}`}
          className="flex flex-col gap-6"
        >
          <h2 className="font-sans text-[20px] leading-7 font-bold text-ink">
            {s.landlordName} · {s.month ?? 'no postings yet'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Rent collected" value={formatKes(s.collectedMinor)} tone="teal" />
            <Stat
              label="Agency fees"
              value={formatKes(s.feesMinor)}
              note={`${(s.agencyFeeBps / 100).toString()}% per management agreement`}
            />
            <Stat label="Remitted to you" value={formatKes(s.remittedMinor)} tone="iris" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="Your properties">
              <ul className="divide-y divide-mist-100">
                {s.properties.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-2 text-body-s"
                  >
                    <div>
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-label-s text-mist-500">
                        {p.town}, {p.county}
                      </p>
                    </div>
                    <p className="tabular-nums">
                      {p.occupied} of {p.units} let
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Postings on your statement">
              <ul className="divide-y divide-mist-100">
                {s.postings.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-2 text-body-s"
                  >
                    <div>
                      <p className="font-semibold text-ink">{humanize(p.kind)}</p>
                      <p className="text-label-s text-mist-500">
                        {formatDate(p.postedAt)} · {p.reference}
                      </p>
                    </div>
                    <p className="tabular-nums">{formatKes(p.amountMinor)}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </section>
      ))}
    </div>
  );
}
