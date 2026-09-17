import type { Metadata } from 'next';
import { MapPinIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { SceneImageSlot } from '@/components/media/scene-image-slot';
import { NavIconBadge } from '@/components/site/nav-icon';
import { company } from '@/content/company';
import { whatsappIntros } from '@/content/whatsapp';
import { whatsappContact } from '@/lib/whatsapp';

import { ContactForm } from './_components/contact-form';

export const metadata: Metadata = { title: 'Company', description: company.lede };

/** Server. Company hub with the contact form (Client leaf) reading ?interest= under Suspense. */
export default function CompanyPage() {
  const whatsapp = whatsappContact(whatsappIntros.contact());
  return (
    <>
      <section
        aria-labelledby="company-title"
        className="relative isolate overflow-hidden bg-navy-950 text-frost"
      >
        <SceneImageSlot
          slot={company.image}
          variant="hero"
          priority
          attribution="sr-only"
          className="opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/50"
        />
        <div className="relative container-x grid-12 items-end gap-y-8 py-16 md:py-20">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-pink-400">{company.eyebrow}</Eyebrow>
            <h1 id="company-title" className="mt-4 max-w-[20ch] text-display-xl text-frost">
              {company.title}
            </h1>
            <p className="mt-5 max-w-[56ch] text-body-l text-lavender-muted">{company.lede}</p>
          </div>
          <div className="col-span-12 rounded-card border border-navy-800 bg-navy-900 p-6 lg:col-span-4 lg:col-start-9">
            <p className="eyebrow text-pink-400">{company.partnerCard.eyebrow}</p>
            <p className="mt-2 font-display text-[22px] leading-7 font-semibold text-frost">
              {company.partnerCard.title}
            </p>
            <p className="mt-2 text-body-s text-lavender-muted">{company.partnerCard.body}</p>
            <Button asChild variant="accent" className="mt-5 w-full">
              <Link href={company.partnerCard.cta.href}>{company.partnerCard.cta.label}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="company-find" className="bg-mist-50 section-y">
        <div className="container-x">
          <h2 id="company-find" className="text-display-l">
            {company.findTitle}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {company.links.map((link) => (
              <li key={link.title} className="flex card-hover flex-col card p-7">
                <NavIconBadge name={link.icon} size={48} />
                <h3 className="mt-5 font-sans text-[18px] leading-6 font-bold text-ink">
                  {link.title}
                </h3>
                <p className="mt-2 flex-1 text-body-s text-mist-700">{link.body}</p>
                <Link
                  href={link.href}
                  className="mt-5 text-label-m font-semibold text-iris-700 underline-offset-4 hover:underline"
                >
                  {link.cta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-20 bg-white section-y"
      >
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow className="text-iris-700">{company.contact.eyebrow}</Eyebrow>
            <h2 id="contact-title" className="mt-4 max-w-[18ch] text-display-l">
              {company.contact.title}
            </h2>
            <p className="mt-4 max-w-[46ch] text-body-l text-mist-700">{company.contact.body}</p>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-[50px] items-center gap-2 rounded-button border border-mist-200 bg-white px-5 font-sans text-label-m font-semibold text-ink hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              <MessageCircleIcon className="size-5 text-whatsapp" aria-hidden="true" />
              WhatsApp {whatsapp.display}
            </a>
            <p className="mt-6 inline-flex items-center gap-2 text-body-s text-mist-700">
              <MapPinIcon className="size-4 text-mist-500" aria-hidden="true" />
              {company.contact.address}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="card p-6 md:p-8">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
