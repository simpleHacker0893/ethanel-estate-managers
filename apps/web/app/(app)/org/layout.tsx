import { requireActor } from '@/lib/auth';

/**
 * Server. Parent of every `/org/[orgSlug]` route. It has no params, reads the session at the
 * top level and blocks (`instant = false`), so the session is resolved once (React `cache`)
 * before any organization page renders. The organization check itself lives in the child
 * layout, which knows the slug. A refusal renders app/forbidden.tsx; under Cache Components
 * the response has started streaming by then, so the status stays 200 (ADR-001).
 */
export const instant = false;

export default async function OrgRootLayout({ children }: LayoutProps<'/org'>) {
  await requireActor();
  return children;
}
