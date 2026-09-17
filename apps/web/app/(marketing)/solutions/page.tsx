import type { Metadata } from 'next';

import { RolePanel } from '@/app/(marketing)/solutions/_components/role-panel';
import { roles } from '@/content/solutions';

export const metadata: Metadata = {
  title: 'Solutions',
  description: roles['letting-firms'].metaDescription,
  alternates: { canonical: '/solutions/letting-firms' },
};

/** Server. /solutions shows the first role; each role has its own URL. */
export default function SolutionsPage() {
  return <RolePanel roleId="letting-firms" />;
}
