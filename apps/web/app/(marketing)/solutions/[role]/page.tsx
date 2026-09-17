import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RolePanel } from '@/app/(marketing)/solutions/_components/role-panel';
import { isRoleId, roleIds, roles } from '@/content/solutions';

export function generateStaticParams() {
  return roleIds.map((role) => ({ role }));
}

export async function generateMetadata({
  params,
}: PageProps<'/solutions/[role]'>): Promise<Metadata> {
  const { role } = await params;
  if (!isRoleId(role)) return {};
  return {
    title: `${roles[role].label} · Solutions`,
    description: roles[role].metaDescription,
    alternates: { canonical: `/solutions/${role}` },
  };
}

/** Server. One prerendered URL per role; tabs are links. */
export default async function SolutionsRolePage({ params }: PageProps<'/solutions/[role]'>) {
  const { role } = await params;
  if (!isRoleId(role)) notFound();
  return <RolePanel roleId={role} />;
}
