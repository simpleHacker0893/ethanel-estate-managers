import type { Metadata } from 'next';
import { Suspense } from 'react';

import { loadMarketplaceSearch } from '@ethanel/contracts/marketplace-search';

import { marketplaceCopy } from '@/content/listings';

import { AlertsBand } from './_components/alerts-band';
import { MarketplaceFilters, MarketplaceFiltersSkeleton } from './_components/marketplace-filters';
import { ResultsGrid, ResultsSkeleton } from './_components/results-grid';

export const metadata: Metadata = {
  title: marketplaceCopy.title,
  description: marketplaceCopy.description,
};

/**
 * Server. The shell (heading, filter chrome, alerts band) prerenders; the results read
 * `searchParams` under <Suspense> and hand the parsed, normalised values to a cached component.
 */
export default function MarketplacePage({ searchParams }: PageProps<'/marketplace'>) {
  return (
    <>
      <div className="container-x pt-8 pb-4 md:pt-10">
        <Suspense fallback={<MarketplaceFiltersSkeleton />}>
          <SearchAwareFilters searchParams={searchParams} />
        </Suspense>
      </div>
      <div className="container-x pb-12">
        <Suspense fallback={<ResultsSkeleton />}>
          <SearchAwareResults searchParams={searchParams} />
        </Suspense>
      </div>
      <AlertsBand />
    </>
  );
}

type SearchParamsPromise = PageProps<'/marketplace'>['searchParams'];

async function SearchAwareFilters({ searchParams }: { searchParams: SearchParamsPromise }) {
  const search = await loadMarketplaceSearch(searchParams);
  return <MarketplaceFilters initial={search} />;
}

async function SearchAwareResults({ searchParams }: { searchParams: SearchParamsPromise }) {
  const search = await loadMarketplaceSearch(searchParams);
  return <ResultsGrid search={search} />;
}
