import type { ReactNode } from 'react';

import { ListingCard } from '@/components/marketplace/listing-card';
import { Eyebrow } from '@/app/(marketing)/_components/section';
import { landing } from '@/content/landing';

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
          {s.listings.map((listing, index) => (
            <li
              key={listing.id}
              className="reveal md:last:col-span-2 lg:last:col-span-1"
              style={{ ['--i' as string]: index }}
            >
              <ListingCard
                {...listing}
                sample
                viewingLabel={s.viewingCta}
                whatsappLabel={s.whatsappCta}
              />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-body-s text-mist-500">{s.note}</p>
      </div>
    </section>
  );
}
