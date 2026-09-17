import { publicEnv } from '@/lib/env';
import { site } from '@/content/site';

/** JSON-LD for the landing page. Serialised with `<` escaped so it is safe inside a <script>. */
export function landingJsonLd(): string {
  const origin = publicEnv.NEXT_PUBLIC_SITE_URL;
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: site.wordmark,
    url: origin,
    logo: `${origin}/opengraph-image`,
    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
    areaServed: ['Nairobi', 'Kiambu', 'Kajiado', 'Machakos'],
  };
  const application = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: site.description,
    url: origin,
    provider: { '@type': 'Organization', name: site.name, url: origin },
  };
  return JSON.stringify([organization, application]).replace(/</g, '\\u003c');
}
