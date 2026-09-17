import { Suspense } from 'react';

import { residentHome } from '@ethanel/db';

import { Panel, Stat, formatDate, humanize } from '@/components/app/stat';
import { authCopy } from '@/content/auth';
import { requireResident } from '@/lib/auth';
import { formatKes } from '@/lib/money/format.money';

/** Server. The resident's own lease: rent due and paid this month, receipts, repair requests. */
export default function ResidentHomePage() {
  return (
    <Suspense
      fallback={
        <h1 className="font-sans text-heading-m font-bold text-ink">{authCopy.app.resident}</h1>
      }
    >
      <Home />
    </Suspense>
  );
}

async function Home() {
  const actor = await requireResident();
  const leases = await residentHome(actor);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-iris-700">{authCopy.app.resident}</p>
        <h1 className="mt-2 font-sans text-heading-m font-bold text-ink">{actor.fullName}</h1>
        <p className="mt-2 text-body-s text-mist-500">{authCopy.app.sampleNote}</p>
      </div>
      {leases.map((lease) => (
        <section
          key={lease.leaseId}
          aria-label={`${lease.propertyName} ${lease.unitLabel}`}
          className="flex flex-col gap-6"
        >
          <h2 className="font-sans text-[20px] leading-7 font-bold text-ink">
            {lease.propertyName} · {lease.unitLabel}, {lease.town} · managed by{' '}
            {lease.organizationName}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat
              label={`Rent due · ${lease.month ?? 'this month'}`}
              value={formatKes(lease.dueMinor)}
            />
            <Stat label="Paid" value={formatKes(lease.paidMinor)} tone="teal" />
            <Stat
              label="Balance"
              value={formatKes(lease.dueMinor - lease.paidMinor)}
              tone={lease.dueMinor - lease.paidMinor > 0n ? 'pink' : 'iris'}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="Receipts and postings">
              <ul className="divide-y divide-mist-100">
                {lease.postings.map((p) => (
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
            <Panel title="Repair requests">
              {lease.repairs.length === 0 ? (
                <p className="text-body-s text-mist-500">None raised.</p>
              ) : (
                <ul className="divide-y divide-mist-100">
                  {lease.repairs.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-4 py-2 text-body-s"
                    >
                      <div>
                        <p className="font-semibold text-ink">{r.title}</p>
                        <p className="text-label-s text-mist-500">
                          raised {formatDate(r.raisedAt)}
                        </p>
                      </div>
                      <span className="rounded-full bg-iris-100 px-2 py-0.5 text-label-s text-iris-700">
                        {humanize(r.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </section>
      ))}
    </div>
  );
}
