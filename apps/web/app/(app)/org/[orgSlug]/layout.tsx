import type { Route } from 'next';

import { EthanelClerkProvider } from '@/components/auth/clerk-provider';
import { AppHeader, type AppNavLink } from '@/components/app/app-header';
import { authCopy } from '@/content/auth';
import { requireOrganizationAccess } from '@/lib/auth';

/**
 * Server. Tenant dashboard shell. Resolves `orgSlug` to an organization and refuses anyone
 * without a membership row before any child renders (forbidden page; see `org/layout.tsx` on
 * the status code). Figures in this route group are read live: never 'use cache' here.
 */
export const instant = false;

export default async function OrgLayout({ children, params }: LayoutProps<'/org/[orgSlug]'>) {
  const { orgSlug } = await params;
  const { organization, membership } = await requireOrganizationAccess(orgSlug);
  const canManage = membership.role === 'owner' || membership.role === 'admin';
  const links: AppNavLink[] = [
    { label: authCopy.app.dashboard, href: `/org/${orgSlug}` as Route },
    ...(canManage
      ? [{ label: authCopy.app.settings, href: `/org/${orgSlug}/settings` as Route }]
      : []),
  ];
  return (
    <EthanelClerkProvider>
      <div className="min-h-dvh bg-mist-50">
        <AppHeader title={organization.name} links={links} />
        <main id="main" className="container-x py-10">
          {children}
        </main>
      </div>
    </EthanelClerkProvider>
  );
}
