import { MapPinIcon, MessageCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { whatsappContact } from '@/lib/whatsapp';

export type ListingIntent = 'rent' | 'sale' | 'land' | 'lease' | 'short-stay';

export interface ListingCardProps {
  id: string;
  chip: string;
  intent: ListingIntent;
  price: string;
  per: string;
  title: string;
  meta?: string;
  location: string;
  agency: string;
  /** Gradient placeholder key until listing-svc serves photos. */
  photo: 'a' | 'b' | 'c';
  photoUrl?: string;
  viewingLabel: string;
  whatsappLabel: string;
  sample?: boolean;
}

const chipTone: Record<ListingIntent, string> = {
  rent: 'bg-iris-100 text-iris-700 border-iris-200',
  'short-stay': 'bg-iris-100 text-iris-700 border-iris-200',
  sale: 'bg-pink-100 text-pink-700 border-pink-200',
  land: 'bg-pink-100 text-pink-700 border-pink-200',
  lease: 'bg-teal-100 text-teal border-teal-200',
};

const gradient = {
  a: 'from-iris-100 to-pink-100',
  b: 'from-iris-200 to-iris-50',
  c: 'from-pink-100 to-iris-100',
} as const;

/** Server. Marketplace listing card; the photo is a next/image slot with a gradient placeholder. */
export function ListingCard(p: ListingCardProps) {
  const whatsapp = whatsappContact();
  return (
    <article
      className="flex card-hover flex-col overflow-hidden card text-ink"
      data-sample={p.sample}
    >
      <div
        className={cn(
          'relative aspect-[4/3] w-full bg-gradient-to-br',
          !p.photoUrl && gradient[p.photo],
        )}
      >
        {p.photoUrl ? (
          <Image
            src={p.photoUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <span
          className={cn(
            'absolute top-3 left-3 rounded-full border px-2.5 py-1 text-label-s font-semibold',
            chipTone[p.intent],
          )}
        >
          {p.chip}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-sans text-[22px] leading-7 font-bold kes">
          {p.price}
          {p.per ? <span className="text-body-s font-semibold text-mist-500"> {p.per}</span> : null}
        </p>
        <h3 className="mt-1.5 font-sans text-label-m font-semibold text-ink">{p.title}</h3>
        {p.meta ? <p className="mt-1 text-body-s text-mist-500">{p.meta}</p> : null}
        <p className="mt-2 inline-flex items-center gap-1.5 text-body-s text-mist-700">
          <MapPinIcon className="size-4 text-mist-500" aria-hidden="true" />
          {p.location}
        </p>
        <p className="mt-1 text-body-s text-mist-500">Managed by {p.agency}</p>

        <div className="mt-5 flex flex-col gap-3 border-t border-mist-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/marketplace?listing=${p.id}`}
            className="text-label-m font-semibold text-iris-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          >
            {p.viewingLabel}
          </Link>
          <Button asChild={Boolean(whatsapp.href)} variant="secondary" size="compact">
            {whatsapp.href ? (
              <a href={whatsapp.href}>
                <MessageCircleIcon className="text-whatsapp" aria-hidden="true" />
                {p.whatsappLabel} {whatsapp.display}
              </a>
            ) : (
              <>
                <MessageCircleIcon className="text-whatsapp" aria-hidden="true" />
                {p.whatsappLabel} {whatsapp.display}
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
