import { CheckCheckIcon, ChevronLeftIcon, MoreVerticalIcon } from 'lucide-react';

import { landing } from '@/content/landing';

/**
 * Server. A WhatsApp conversation drawn in DOM + CSS so it reads as the real thing:
 * teal header, mist chat area, tails on the bubbles, blue double ticks. Hidden below 768px.
 */
export function WhatsAppBubble() {
  const w = landing.hero.whatsapp;
  return (
    <figure
      className="hidden overflow-hidden rounded-card border border-mist-200 bg-mist-100 text-ink md:block"
      aria-label={`Sample WhatsApp conversation with ${w.name}`}
      data-sample
    >
      <div className="flex items-center gap-3 bg-whatsapp-header px-3 py-2.5 text-white">
        <ChevronLeftIcon className="size-5 shrink-0" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-label-s font-bold"
        >
          {w.avatar}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-label-m font-semibold">{w.name}</span>
          <span className="block text-[12px] text-white/80">{w.subtitle}</span>
        </span>
        <MoreVerticalIcon className="size-5 shrink-0" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2 px-3 py-3">
        <span className="mx-auto rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-mist-500 shadow-xs">
          {w.dayPill}
        </span>

        <div className="relative mr-10 rounded-[10px] rounded-tl-none bg-white px-3 py-2 text-[14px] leading-5 shadow-xs">
          <span
            aria-hidden="true"
            className="absolute top-0 -left-2 size-0 border-t-[10px] border-r-[8px] border-t-white border-r-transparent"
          />
          <span className="block text-[12px] font-semibold text-whatsapp-header">
            {w.incoming.sender}
          </span>
          <p>{w.incoming.text}</p>
          <span className="mt-1 block text-right text-[11px] text-mist-500">{w.incoming.time}</span>
        </div>

        <div className="relative ml-auto min-w-24 rounded-[10px] rounded-tr-none bg-whatsapp-out px-3 py-2 text-[14px] leading-5 shadow-xs">
          <span
            aria-hidden="true"
            className="absolute top-0 -right-2 size-0 border-t-[10px] border-l-[8px] border-t-whatsapp-out border-l-transparent"
          />
          <p className="font-semibold">{w.outgoing.text}</p>
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-mist-500">
            {w.outgoing.time}
            <CheckCheckIcon className="size-3.5 text-[#53BDEB]" aria-label="Read" />
          </span>
        </div>
      </div>
    </figure>
  );
}
