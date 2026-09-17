import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Cache Components is the caching model for marketing and marketplace. Screens where a stale
  // figure costs money (dashboard, ledger, landlord portal) must never use 'use cache'.
  cacheComponents: true,
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@ethanel/ui'],
  typedRoutes: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Listing photos are served from the listing-svc object store (Sprint 003+).
      { protocol: 'https', hostname: 'images.ethanel.co.ke' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withNextIntl(nextConfig);
