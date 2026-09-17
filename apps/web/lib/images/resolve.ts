import { cacheLife, cacheTag } from 'next/cache';
import { connection } from 'next/server';

import { imageSlots, type ImageSlotId, type ResolvedImage } from '@/content/images';
import { serverEnv } from '@/lib/env';

import { fetchUnsplashPhoto } from './unsplash';

function illustration(slotId: ImageSlotId): ResolvedImage {
  const slot = imageSlots[slotId];
  return {
    kind: 'illustration',
    scene: slot.fallback,
    alt: slot.alt,
    ...('initials' in slot && slot.initials ? { initials: slot.initials } : {}),
  };
}

/** Long-lived cache of a successful Unsplash lookup. A miss throws, so it is never cached. */
async function photoCached(slotId: ImageSlotId, accessKey: string): Promise<ResolvedImage> {
  'use cache';
  cacheLife('days');
  cacheTag('scene-images', `scene-image:${slotId}`);
  return fetchUnsplashPhoto(imageSlots[slotId], accessKey);
}

/** Per-process backoff so a failing slot does not hit Unsplash on every request. */
const retryAfter = new Map<ImageSlotId, number>();
const BACKOFF_MS = 10 * 60 * 1000;

async function photoOrIllustration(slotId: ImageSlotId, accessKey: string): Promise<ResolvedImage> {
  const blockedUntil = retryAfter.get(slotId);
  if (blockedUntil !== undefined && blockedUntil > Date.now()) return illustration(slotId);
  try {
    const photo = await photoCached(slotId, accessKey);
    retryAfter.delete(slotId);
    return photo;
  } catch (error) {
    retryAfter.set(slotId, Date.now() + BACKOFF_MS);
    console.warn(
      JSON.stringify({
        level: 'warn',
        event: 'scene_image_miss',
        slot: slotId,
        error: String(error),
      }),
    );
    return illustration(slotId);
  }
}

/**
 * Server-only. Resolves a scene slot to a photo or a brand illustration; never throws.
 *
 * With an access key at build time the photo is fetched once and prerendered. Without one the
 * slot defers to request time (`connection()`), so adding the key on staging or production makes
 * photos appear without a rebuild; each successful lookup is then cached for days.
 */
export async function resolveImage(slotId: ImageSlotId): Promise<ResolvedImage> {
  const slot = imageSlots[slotId];
  if (slot.source === 'illustration') return illustration(slotId);
  const buildKey = serverEnv().UNSPLASH_ACCESS_KEY;
  if (buildKey) {
    try {
      return await photoCached(slotId, buildKey);
    } catch {
      // Fall through: resolve at request time instead of baking a miss into the shell.
    }
  }
  await connection();
  const runtimeKey = serverEnv().UNSPLASH_ACCESS_KEY;
  if (!runtimeKey) return illustration(slotId);
  return photoOrIllustration(slotId, runtimeKey);
}
