import type { Metadata } from 'next';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ethanel/ui/components/accordion';
import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { pricing } from '@/content/pricing';

import { FeatureMatrix } from './_components/feature-matrix';
import { TierGrid } from './_components/tier-grid';

export const metadata: Metadata = { title: 'Pricing', description: pricing.lede };

/** Server. Four subscription tiers with introductory prices, a feature matrix and the FAQ. */
export default function PricingPage() {
  return (
    <>
      <section aria-labelledby="pricing-title" className="bg-navy-950 py-16 text-frost md:py-20">
        <div className="container-x">
          <Eyebrow className="text-pink-400">{pricing.eyebrow}</Eyebrow>
          <h1 id="pricing-title" className="mt-4 max-w-[20ch] text-display-xl text-frost">
            {pricing.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-body-l text-lavender-muted">{pricing.lede}</p>
        </div>
      </section>
      <section aria-labelledby="pricing-tiers" className="bg-mist-50 section-y">
        <div className="container-x">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="pricing-tiers" className="text-heading-m">
              Plans
            </h2>
            <p className="w-fit rounded-full border border-amber-100 bg-amber-100 px-3 py-1.5 text-label-s font-semibold text-amber-700">
              {pricing.introductory}
            </p>
          </div>
          <TierGrid />
          <div className="mt-12">
            <FeatureMatrix />
          </div>
        </div>
      </section>
      <section aria-labelledby="pricing-faq" className="bg-white section-y">
        <div className="container-x grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="pricing-faq" className="text-display-l">
              {pricing.faqTitle}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible>
              {pricing.faq.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-mist-700">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <section aria-labelledby="pricing-closing" className="bg-iris-50 py-14">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="pricing-closing" className="text-heading-m">
              {pricing.closing.title}
            </h2>
            <p className="mt-2 text-body-m text-mist-700">{pricing.closing.body}</p>
          </div>
          <Button asChild variant="accent" className="w-full md:w-auto">
            <Link href={pricing.closing.cta.href}>{pricing.closing.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
