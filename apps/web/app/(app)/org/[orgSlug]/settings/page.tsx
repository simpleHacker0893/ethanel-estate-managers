import { Suspense } from 'react';

import { organizationMembers } from '@ethanel/db';

import { Panel } from '@/components/app/stat';
import { authCopy } from '@/content/auth';
import { requireOrganizationAccess } from '@/lib/auth';

/** Server. Owner and admin only: the organization's members and their roles. */
export default function OrgSettingsPage({ params }: PageProps<'/org/[orgSlug]/settings'>) {
  return (
    <Suspense
      fallback={
        <h1 className="font-sans text-heading-m font-bold text-ink">{authCopy.app.settings}</h1>
      }
    >
      <Settings params={params} />
    </Suspense>
  );
}

async function Settings({ params }: { params: PageProps<'/org/[orgSlug]/settings'>['params'] }) {
  const { orgSlug } = await params;
  const { organization } = await requireOrganizationAccess(orgSlug, ['owner', 'admin']);
  const members = await organizationMembers(organization.id);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-iris-700">{authCopy.app.settings}</p>
        <h1 className="mt-2 font-sans text-heading-m font-bold text-ink">{organization.name}</h1>
        <p className="mt-2 text-body-s text-mist-500">{authCopy.app.sampleNote}</p>
      </div>
      <Panel title="People">
        <ul className="divide-y divide-mist-100" data-testid="members">
          {members.map((m) => (
            <li key={m.userId} className="flex items-center justify-between gap-4 py-2 text-body-s">
              <div>
                <p className="font-semibold text-ink">{m.fullName}</p>
                <p className="text-label-s text-mist-500">{m.email}</p>
              </div>
              <span className="rounded-full bg-mist-100 px-2 py-0.5 text-label-s text-mist-700">
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
