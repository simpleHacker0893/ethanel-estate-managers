import { getRequestConfig } from 'next-intl/server';

/**
 * English only at launch, no locale routing. The config reads no request API, so every
 * marketing route stays prerenderable under cacheComponents. When Kiswahili arrives this reads
 * the locale from a root param, never from headers().
 */
export const locales = ['en'] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = 'en';

const messagesByLocale: Record<AppLocale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../../messages/en.json'),
};

export default getRequestConfig(async () => {
  const locale = defaultLocale;
  const { default: messages } = await messagesByLocale[locale]();
  return { locale, messages, timeZone: 'Africa/Nairobi' };
});
