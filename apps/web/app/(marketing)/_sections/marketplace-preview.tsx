import type { ReactNode } from 'react';

import { ListingCard } from '@/components/marketplace/listing-card';
import { Eyebrow } from '@/app/(marketing)/_components/section';
import { landing } from '@/content/landing';
import { marketplaceCopy, sampleListings } from '@/content/listings';
import { intentSegments } from '@/content/marketplace';
import { formatKes, formatListedDate } from '@/lib/listings';

/** Server. mist-100 band. The search bar (Client) is passed in as a slot from page.tsx. */
export function MarketplacePreview({ searchBar }: { searchBar?: ReactNode }) {
  const s = landing.marketplace;
  return (
    <section
      id="marketplace"
      aria-labelledby="marketplace-title"
      className="reveal bg-mist-100 section-y"
    >
      <div className="container-x">
        <Eyebrow className="text-iris-700">{s.eyebrow}</Eyebrow>
        <h2 id="marketplace-title" className="mt-4 max-w-[24ch] text-display-l">
          {s.title}
        </h2>

        {searchBar ? <div className="mt-10">{searchBar}</div> : null}

        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.listingIds.map((id, index) => {
            const listing = sampleListings.find((l) => l.id === id);
            if (!listing) return null;
            const per = intentSegments.find((seg) => seg.id === listing.intent)?.per ?? '';
            return (
              <li
                key={id}
                className="reveal md:last:col-span-2 lg:last:col-span-1"
                style={{ ['--i' as string]: index }}
              >
                <ListingCard
                  id={listing.id}
                  chip={listing.chip}
                  intent={listing.intent}
                  status={listing.status}
                  statusLabel={marketplaceCopy.statusLabels[listing.status]}
                  price={formatKes(listing.priceKes)}
                  per={per}
                  title={listing.title}
                  meta={listing.meta}
                  location={listing.location}
                  coordinates={listing.coordinates}
                  agency={listing.agency}
                  listedLabel={`${marketplaceCopy.listedPrefix} ${formatListedDate(listing.publishedAt)}`}
                  photo={listing.photo}
                  sample
                  viewingLabel={s.viewingCta}
                  whatsappLabel={s.whatsappCta}
                  mapLabel={marketplaceCopy.openMap}
                />
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-body-s text-mist-500">{s.note}</p>
      </div>
    </section>
  );
}
