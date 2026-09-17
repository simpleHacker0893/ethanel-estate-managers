import type { Metadata } from 'next';

import { MarketplaceSearchBar } from '@/app/(marketing)/_components/marketplace-search-bar';
import { DemoAccounts } from '@/app/(marketing)/_sections/demo-accounts';
import { Doors } from '@/app/(marketing)/_sections/doors';
import { FinalCta } from '@/app/(marketing)/_sections/final-cta';
import { Hero } from '@/app/(marketing)/_sections/hero';
import { HowItWorks } from '@/app/(marketing)/_sections/how-it-works';
import { MarketplacePreview } from '@/app/(marketing)/_sections/marketplace-preview';
import { PricingTeaser } from '@/app/(marketing)/_sections/pricing-teaser';
import { Trust } from '@/app/(marketing)/_sections/trust';
import { WhatYouGet } from '@/app/(marketing)/_sections/what-you-get';
import { site } from '@/content/site';
import { publicEnv } from '@/lib/env';
import { landingJsonLd } from '@/lib/jsonld';

/** Reads no runtime data, so metadata is part of the static shell. */
export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title: { absolute: site.title },
    description: site.description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: site.title,
      description: site.description,
      url: '/',
      locale: 'en_KE',
    },
    twitter: { card: 'summary_large_image', title: site.title, description: site.description },
    robots: { index: true, follow: true },
  };
}

/** Server. Composes the landing sections. Calls no request API, so it prerenders static. */
export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: landingJsonLd() }} />
      <Hero />
      <Doors />
      <HowItWorks />
      <WhatYouGet />
      <MarketplacePreview searchBar={<MarketplaceSearchBar />} />
      <Trust />
      <PricingTeaser />
      <DemoAccounts />
      <FinalCta />
    </>
  );
}
