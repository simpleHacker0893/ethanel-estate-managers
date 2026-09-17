import type { ImageLoaderProps } from 'next/image';

/** Hotlinks Unsplash's own CDN (per its guidelines) instead of proxying through /_next/image. */
export function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}
