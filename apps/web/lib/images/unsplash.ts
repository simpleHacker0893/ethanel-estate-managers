import type { ImageSlot, ResolvedImage } from '@/content/images';

/**
 * Unsplash API client for scene photos. Pure function of (slot, accessKey); reads no request
 * APIs so it is safe inside 'use cache'. Follows the API guidelines: hotlink `urls.raw`, show
 * attribution with UTM parameters, and hit `download_location` when a photo is used.
 */
interface UnsplashPhoto {
  urls: { raw: string };
  width: number;
  height: number;
  color: string | null;
  user: { name: string; links: { html: string } };
  links: { html: string; download_location: string };
}

const UTM = 'utm_source=ethanel_estate_managers&utm_medium=referral';

export class UnsplashMiss extends Error {
  override readonly name = 'UnsplashMiss';
}

async function unsplashGet<T>(path: string, accessKey: string): Promise<T> {
  const response = await fetch(`https://api.unsplash.com${path}`, {
    headers: { Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1' },
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new UnsplashMiss(`unsplash ${path} responded ${response.status}`);
  return (await response.json()) as T;
}

export async function fetchUnsplashPhoto(
  slot: ImageSlot,
  accessKey: string,
): Promise<Extract<ResolvedImage, { kind: 'photo' }>> {
  let photo: UnsplashPhoto;
  if (slot.photoId) {
    photo = await unsplashGet<UnsplashPhoto>(
      `/photos/${encodeURIComponent(slot.photoId)}`,
      accessKey,
    );
  } else {
    const params = new URLSearchParams({
      query: slot.query,
      orientation: slot.orientation,
      per_page: '1',
      content_filter: 'high',
    });
    const result = await unsplashGet<{ results: UnsplashPhoto[] }>(
      `/search/photos?${params.toString()}`,
      accessKey,
    );
    const first = result.results[0];
    if (!first) throw new UnsplashMiss(`no result for "${slot.query}"`);
    photo = first;
  }

  // Guideline: trigger a download event when the photo is used. Fire and forget.
  void fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    signal: AbortSignal.timeout(4000),
  }).catch(() => undefined);

  return {
    kind: 'photo',
    src: photo.urls.raw,
    width: photo.width,
    height: photo.height,
    alt: slot.alt,
    color: photo.color ?? '#E9E5FA',
    attribution: {
      name: photo.user.name,
      profileUrl: `${photo.user.links.html}?${UTM}`,
      photoUrl: `${photo.links.html}?${UTM}`,
    },
  };
}
