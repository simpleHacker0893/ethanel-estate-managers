import { CalendarIcon, MapPinIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';

import type { ListingStatus } from '@ethanel/contracts/listing';
import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { SceneImageSlot } from '@/components/media/scene-image-slot';
import type { ImageSlotId } from '@/content/images';
import { whatsappIntros } from '@/content/whatsapp';
import { mapsSearchUrl } from '@/lib/maps';
import { whatsappContact } from '@/lib/whatsapp';

export type ListingIntent = 'rent' | 'sale' | 'land' | 'lease' | 'short-stay';

export interface ListingCardProps {
  id: string;
  chip: string;
  intent: ListingIntent;
  status: ListingStatus;
  statusLabel: string;
  price: string;
  per: string;
  title: string;
  meta?: string;
  location: string;
  coordinates: { lat: number; lng: number };
  agency: string;
  /** "Listed 3 Sep 2026" */
  listedLabel: string;
  photo: ImageSlotId;
  viewingLabel: string;
  whatsappLabel: string;
  mapLabel: string;
  sample?: boolean;
}

const chipTone: Record<ListingIntent, string> = {
  rent: 'bg-iris-100 text-iris-700 border-iris-200',
  'short-stay': 'bg-iris-100 text-iris-700 border-iris-200',
  sale: 'bg-pink-100 text-pink-700 border-pink-200',
  land: 'bg-pink-100 text-pink-700 border-pink-200',
  lease: 'bg-teal-100 text-teal-700 border-teal-200',
};

const statusTone: Record<ListingStatus, string> = {
  vacant: 'bg-teal-100 text-teal-700',
  booked: 'bg-amber-100 text-amber-700',
  let: 'bg-mist-100 text-mist-700',
  'under-offer': 'bg-amber-100 text-amber-700',
  sold: 'bg-navy-900 text-frost',
  'coming-soon': 'bg-iris-100 text-iris-700',
};

/**
 * Server. Marketplace listing card: photo slot (Unsplash or illustration), intent chip, status
 * chip, price, listed date, a location link that opens Google Maps at the coordinates, and
 * "Book a viewing" which hands off to sign-in. WhatsApp opens with a prefilled enquiry.
 */
export function ListingCard(p: ListingCardProps) {
  const whatsapp = whatsappContact(whatsappIntros.listingEnquiry({ title: p.title, id: p.id }));
  const next = encodeURIComponent(`/marketplace?listing=${p.id}`);
  return (
    <article
      className="flex card-hover flex-col overflow-hidden card text-ink"
      data-sample={p.sample}
    >
      <div className="relative">
        <SceneImageSlot
          slot={p.photo}
          variant="card"
          attribution="sr-only"
          className="rounded-none"
        />
        <span
          className={cn(
            'absolute top-3 left-3 rounded-full border px-2.5 py-1 text-label-s font-semibold',
            chipTone[p.intent],
          )}
        >
          {p.chip}
        </span>
        <span
          className={cn(
            'absolute top-3 right-3 rounded-full px-2.5 py-1 text-label-s font-semibold',
            statusTone[p.status],
          )}
          data-status={p.status}
        >
          {p.statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-sans text-[22px] leading-7 font-bold kes">
          {p.price}
          {p.per ? <span className="text-body-s font-semibold text-mist-500"> {p.per}</span> : null}
        </p>
        <h3 className="mt-1.5 font-sans text-label-m font-semibold text-ink">{p.title}</h3>
        {p.meta ? <p className="mt-1 text-body-s text-mist-500">{p.meta}</p> : null}
        <a
          href={mapsSearchUrl(p.coordinates)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-s text-iris-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          aria-label={`${p.location} — ${p.mapLabel}`}
        >
          <MapPinIcon className="size-4" aria-hidden="true" />
          {p.location}
        </a>
        <p className="mt-1 text-body-s text-mist-500">Managed by {p.agency}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-body-s text-mist-500">
          <CalendarIcon className="size-4" aria-hidden="true" />
          {p.listedLabel}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-mist-100 pt-4">
          <Link
            href={`/sign-in?next=${next}`}
            className="text-label-m font-semibold text-iris-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          >
            {p.viewingLabel}
          </Link>
          <Button
            asChild
            variant="secondary"
            size="compact"
            className="max-w-full min-w-0 px-3.5 text-[14px] [&_svg]:size-[18px]"
          >
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer">
              <MessageCircleIcon className="text-whatsapp" aria-hidden="true" />
              {p.whatsappLabel} {whatsapp.display}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
