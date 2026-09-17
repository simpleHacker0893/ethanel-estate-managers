import { Suspense } from 'react';

/** Server. Placeholder until the dashboard lands. No Fraunces in the dashboard. */
export default function OrgHomePage({ params }: PageProps<'/org/[orgSlug]'>) {
  return (
    <main id="main" className="container-x section-y">
      <Suspense
        fallback={<h1 className="font-sans text-heading-m font-bold text-ink">Dashboard</h1>}
      >
        <OrgHeading params={params} />
      </Suspense>
      <p className="mt-2 text-body-m">Coming in a later sprint.</p>
    </main>
  );
}

async function OrgHeading({ params }: { params: PageProps<'/org/[orgSlug]'>['params'] }) {
  const { orgSlug } = await params;
  return <h1 className="font-sans text-heading-m font-bold text-ink">Dashboard · {orgSlug}</h1>;
}
