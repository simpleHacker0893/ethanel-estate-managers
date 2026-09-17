import { Suspense } from 'react';

import { cn } from '@ethanel/ui/lib/cn';

import { imageSlots, type ImageSlotId } from '@/content/images';

import { SceneIllustration } from './scene-illustration';
import { SceneImage, type SceneVariant } from './scene-image';

const frame: Record<SceneVariant, string> = {
  hero: 'absolute inset-0',
  card: 'relative aspect-[4/3] w-full overflow-hidden rounded-card',
  thumb: 'relative size-12 shrink-0 overflow-hidden rounded-[10px]',
  portrait: 'relative aspect-square w-full overflow-hidden rounded-card',
  promo: 'relative aspect-[16/9] w-full overflow-hidden rounded-[10px]',
};

/**
 * Server. Wraps SceneImage in Suspense with the slot's illustration as the fallback, so a photo
 * that resolves at request time (a streamed hole) never blocks the static shell.
 */
export function SceneImageSlot(props: {
  slot: ImageSlotId;
  variant: SceneVariant;
  priority?: boolean;
  attribution?: 'caption' | 'sr-only' | 'none';
  className?: string;
}) {
  const slot = imageSlots[props.slot];
  const fallback = (
    <div className={cn(frame[props.variant], props.className)}>
      <SceneIllustration
        scene={slot.fallback}
        {...('initials' in slot && slot.initials ? { initials: slot.initials } : {})}
      />
    </div>
  );
  return (
    <Suspense fallback={fallback}>
      <SceneImage {...props} />
    </Suspense>
  );
}
