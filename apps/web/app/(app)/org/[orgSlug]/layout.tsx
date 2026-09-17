/**
 * Server. Tenant dashboard shell. Sprint 002 wraps this in the Clerk organization context and
 * resolves `orgSlug` to an organization_id for every downstream call. Figures here are read
 * live: never 'use cache' in this route group. The shell reads no params so it prerenders;
 * pages read `params` under <Suspense>.
 */
export default function OrgLayout({ children }: LayoutProps<'/org/[orgSlug]'>) {
  return <div className="min-h-dvh bg-mist-50">{children}</div>;
}
