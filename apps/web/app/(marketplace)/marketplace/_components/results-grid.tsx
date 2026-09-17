import { SearchXIcon } from 'lucide-react';
import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';

import type { MarketplaceSearch } from '@ethanel/contracts/marketplace-search';
import { serializeMarketplaceSearch } from '@ethanel/contracts/marketplace-search';
import { Button } from '@ethanel/ui/components/button';

import { ListingCard } from '@/components/marketplace/listing-card';
import { marketplaceCopy } from '@/content/listings';
import { countyLabels, intentSegments } from '@/content/marketplace';
import { formatKes, formatListedDate, searchListings } from '@/lib/listings';

/**
 * The search itself is cached (hours, tag `listings`) so listing-svc can revalidate it later;
 * cards render outside the cache because their photo slots may defer to request time.
 */
// eslint-disable-next-line @typescript-eslint/require-await -- 'use cache' requires an async function
async function cachedSearch(search: MarketplaceSearch) {
  'use cache';
  cacheLife('hours');
  cacheTag('listings');
  return searchListings(search);
}

/** Server. Heading, count, grid or empty state, sample note. */
export async function ResultsGrid({ search }: { search: MarketplaceSearch }) {
  const listings = await cachedSearch(search);
  const segment = intentSegments.find((s) => s.id === search.intent);
  const widenHref = serializeMarketplaceSearch('/marketplace', { ...search, budget: 'any' });
  const anywhereHref = serializeMarketplaceSearch('/marketplace', {
    ...search,
    county: 'anywhere',
    area: '',
  });
  const place =
    search.area.trim() !== ''
      ? search.area.trim()
      : search.county === 'anywhere'
        ? 'Kenya'
        : countyLabels[search.county];

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display-l">
            {segment?.heading}
            {place === 'Kenya' ? '' : ` in ${place}`}
          </h1>
          <p className="mt-2 text-body-m text-mist-500">{marketplaceCopy.lede}</p>
        </div>
        <p className="text-body-s font-semibold text-mist-700 kes" aria-live="polite">
          {listings.length} {marketplaceCopy.resultsSuffix}
        </p>
      </div>
      {search.sort === 'nearest' ? (
        <p className="mt-2 text-body-s text-mist-500">{marketplaceCopy.nearestNote}</p>
      ) : null}

      {listings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-5 card px-6 py-14 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-[12px] bg-iris-100 text-iris-700">
            <SearchXIcon className="size-6" aria-hidden="true" />
          </span>
          <p className="max-w-md text-body-l text-ink">{marketplaceCopy.emptyTitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary">
              <Link href={widenHref}>{marketplaceCopy.widenBudget}</Link>
            </Button>
            {search.county !== 'anywhere' || search.area ? (
              <Button asChild variant="secondary">
                <Link href={anywhereHref}>Search all of Kenya</Link>
              </Button>
            ) : null}
            <Button asChild variant="secondary">
              <Link href="/sign-in?next=%2Fmarketplace%23alerts">{marketplaceCopy.getAlert}</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <li key={l.id}>
              <ListingCard
                id={l.id}
                chip={l.chip}
                intent={l.intent}
                status={l.status}
                statusLabel={marketplaceCopy.statusLabels[l.status]}
                price={formatKes(l.priceKes)}
                per={segment?.per ?? ''}
                title={l.title}
                meta={l.meta}
                location={l.location}
                coordinates={l.coordinates}
                agency={l.agency}
                listedLabel={`${marketplaceCopy.listedPrefix} ${formatListedDate(l.publishedAt)}`}
                photo={l.photo}
                sample
                viewingLabel={marketplaceCopy.viewingCta}
                whatsappLabel={marketplaceCopy.whatsappCta}
                mapLabel={marketplaceCopy.openMap}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-body-s text-mist-500">{marketplaceCopy.note}</p>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-10 w-72 max-w-full rounded-[8px] bg-mist-200" />
      <div className="mt-3 h-5 w-96 max-w-full rounded-[6px] bg-mist-100" />
      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="overflow-hidden card">
            <div className="aspect-[4/3] bg-mist-100" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-1/2 rounded-[6px] bg-mist-200" />
              <div className="h-4 w-3/4 rounded-[6px] bg-mist-100" />
              <div className="h-4 w-1/3 rounded-[6px] bg-mist-100" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
