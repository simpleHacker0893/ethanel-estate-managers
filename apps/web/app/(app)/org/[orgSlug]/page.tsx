import { Suspense } from 'react';

import { organizationDashboard } from '@ethanel/db';

import { Panel, Stat, formatDate, humanize } from '@/components/app/stat';
import { authCopy } from '@/content/auth';
import { requireOrganizationAccess } from '@/lib/auth';
import { formatKes, percentOf } from '@/lib/money/format.money';

/** Server. Live organization dashboard: rent run, properties, ledger tail, open repairs. */
export default function OrgHomePage({ params }: PageProps<'/org/[orgSlug]'>) {
  return (
    <Suspense
      fallback={
        <h1 className="font-sans text-heading-m font-bold text-ink">{authCopy.app.dashboard}</h1>
      }
    >
      <Dashboard params={params} />
    </Suspense>
  );
}

async function Dashboard({ params }: { params: PageProps<'/org/[orgSlug]'>['params'] }) {
  const { orgSlug } = await params;
  const { organization, membership, actor } = await requireOrganizationAccess(orgSlug);
  const data = await organizationDashboard(organization);
  const run = data.rentRun;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-iris-700">{authCopy.app.dashboard}</p>
        <h1 className="mt-2 font-sans text-heading-m font-bold text-ink">{organization.name}</h1>
        <p className="mt-2 text-body-m text-mist-700">
          {actor.fullName} · <span data-testid="membership-role">{membership.role}</span>
        </p>
        <p className="mt-2 text-body-s text-mist-500">{authCopy.app.sampleNote}</p>
      </div>

      {run ? (
        <section
          aria-label={`Rent run ${run.month}`}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Stat
            label={`Collected · ${run.month}`}
            value={formatKes(run.collectedMinor)}
            note={`${percentOf(run.collectedMinor, run.expectedMinor)}% of expected rent`}
            tone="teal"
          />
          <Stat
            label="Expected"
            value={formatKes(run.expectedMinor)}
            note={`${run.leasesTotal} leases billed`}
          />
          <Stat
            label="Outstanding"
            value={formatKes(run.outstandingMinor)}
            note={`${run.leasesTotal - run.leasesPaid} leases unpaid`}
            tone="pink"
          />
          <Stat label="Leases paid" value={`${run.leasesPaid} of ${run.leasesTotal}`} tone="iris" />
        </section>
      ) : (
        <p className="text-body-m text-mist-700">No rent run yet.</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Properties">
          <table className="w-full text-body-s">
            <thead className="text-left text-label-s text-mist-500">
              <tr>
                <th scope="col" className="pb-2 font-semibold">
                  Property
                </th>
                <th scope="col" className="pb-2 font-semibold">
                  Landlord
                </th>
                <th scope="col" className="pb-2 text-right font-semibold">
                  Units
                </th>
                <th scope="col" className="pb-2 text-right font-semibold">
                  Vacant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {data.properties.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 font-semibold text-ink">
                    {p.name}
                    <span className="block text-label-s font-normal text-mist-500">
                      {p.town}, {p.county} · {p.kind}
                    </span>
                  </td>
                  <td className="py-2">{p.landlordName}</td>
                  <td className="py-2 text-right tabular-nums">{p.units}</td>
                  <td className="py-2 text-right tabular-nums">{p.vacant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Open repair requests">
          {data.repairs.length === 0 ? (
            <p className="text-body-s text-mist-500">Nothing open.</p>
          ) : (
            <ul className="divide-y divide-mist-100">
              {data.repairs.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 py-2 text-body-s">
                  <div>
                    <p className="font-semibold text-ink">{r.title}</p>
                    <p className="text-label-s text-mist-500">
                      {r.propertyName} · {r.unitLabel} · raised {formatDate(r.raisedAt)}
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

      <Panel title="Latest postings">
        <table className="w-full text-body-s">
          <thead className="text-left text-label-s text-mist-500">
            <tr>
              <th scope="col" className="pb-2 font-semibold">
                Date
              </th>
              <th scope="col" className="pb-2 font-semibold">
                Posting
              </th>
              <th scope="col" className="pb-2 font-semibold">
                Lease
              </th>
              <th scope="col" className="pb-2 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {data.recentPostings.map((p) => (
              <tr key={p.id}>
                <td className="py-2 tabular-nums">{formatDate(p.postedAt)}</td>
                <td className="py-2">
                  <span className="font-semibold text-ink">{humanize(p.kind)}</span>
                  <span className="block text-label-s text-mist-500">{p.reference}</span>
                </td>
                <td className="py-2">{p.leaseLabel ?? '—'}</td>
                <td className="py-2 text-right tabular-nums">{formatKes(p.amountMinor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
