import { Fraunces, Manrope } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import './globals.css';

// Next 16 only allows `axes` on variable fonts with `weight: 'variable'`; the theme pins
// headings to 600 and opsz/SOFT via font-variation-settings, so this matches the spec exactly.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz', 'SOFT'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

/** Server. Root layout: html lang from next-intl, fonts, providers, skip link. */
export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const locale = await getLocale();
  const t = await getTranslations('common');

  return (
    <html lang={locale} className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-mist-50 font-sans text-mist-700 antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-button bg-pink-500 px-4 py-3 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
