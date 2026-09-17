import Image from 'next/image';

import { cn } from '@ethanel/ui/lib/cn';

import type { ImageSlotId } from '@/content/images';
import { unsplashLoader } from '@/lib/images/loader';
import { resolveImage } from '@/lib/images/resolve';

import { SceneIllustration } from './scene-illustration';

export type SceneVariant = 'hero' | 'card' | 'thumb' | 'portrait' | 'promo';

const frame: Record<SceneVariant, string> = {
  hero: 'absolute inset-0',
  card: 'relative aspect-[4/3] w-full overflow-hidden rounded-card',
  thumb: 'relative size-12 shrink-0 overflow-hidden rounded-[10px]',
  portrait: 'relative aspect-square w-full overflow-hidden rounded-card',
  promo: 'relative aspect-[16/9] w-full overflow-hidden rounded-[10px]',
};

const sizesFor: Record<SceneVariant, string> = {
  hero: '100vw',
  card: '(min-width: 1024px) 560px, 100vw',
  thumb: '48px',
  portrait: '(min-width: 1024px) 320px, 50vw',
  promo: '260px',
};

/**
 * Server, async. Resolves the slot (photo through the Unsplash cache, else illustration) and
 * renders it. Always mount inside <SceneImageSlot> so a streamed miss has a fallback.
 */
export async function SceneImage({
  slot,
  variant,
  priority = false,
  attribution = 'caption',
  className,
}: {
  slot: ImageSlotId;
  variant: SceneVariant;
  priority?: boolean;
  attribution?: 'caption' | 'sr-only' | 'none';
  className?: string;
}) {
  const image = await resolveImage(slot);
  const decorative = attribution === 'none' || variant === 'thumb';

  if (image.kind === 'illustration') {
    return (
      <div className={cn(frame[variant], className)}>
        <SceneIllustration
          scene={image.scene}
          {...(decorative || !image.alt ? {} : { label: image.alt })}
          {...(image.initials ? { initials: image.initials } : {})}
        />
      </div>
    );
  }

  return (
    <figure className={cn(frame[variant], className)} style={{ backgroundColor: image.color }}>
      <Image
        loader={unsplashLoader}
        src={image.src}
        alt={decorative ? '' : image.alt}
        fill
        sizes={sizesFor[variant]}
        priority={priority}
        className="object-cover"
      />
      {attribution === 'none' ? null : (
        <figcaption
          className={cn(
            attribution === 'sr-only'
              ? 'sr-only'
              : 'absolute right-2 bottom-2 rounded-[6px] bg-navy-950/70 px-2 py-1 text-[11px] leading-4 text-frost',
          )}
        >
          Photo by{' '}
          <a
            href={image.attribution.profileUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="underline"
          >
            {image.attribution.name}
          </a>{' '}
          on{' '}
          <a
            href={image.attribution.photoUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="underline"
          >
            Unsplash
          </a>
        </figcaption>
      )}
    </figure>
  );
}
