import Link from 'next/link';

import { cn } from '@ethanel/ui/lib/cn';

import { site } from '@/content/site';

/**
 * Pink square mark with a Fraunces "E", the "Ethanel" wordmark and "Estate Managers" beneath it
 * in small caps. Server. `tone` picks the text colours for dark (header, footer) or light
 * surfaces (mobile sheet).
 */
export function Logo({
  tone = 'dark',
  className,
  compact = false,
}: {
  tone?: 'dark' | 'light';
  className?: string;
  /** Mark only plus wordmark, no descriptor (tight spaces). */
  compact?: boolean;
}) {
  const wordmark = tone === 'dark' ? 'text-frost' : 'text-ink';
  const sub = tone === 'dark' ? 'text-lavender-muted' : 'text-mist-500';
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500',
        className,
      )}
      aria-label={`${site.name} home`}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-pink-500 font-display text-[20px] leading-none font-semibold text-navy-950"
      >
        E
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[20px] leading-[22px] font-semibold tracking-[-0.01em]',
            wordmark,
          )}
        >
          {site.wordmark}
        </span>
        {compact ? null : (
          <span
            className={cn(
              'mt-0.5 font-sans text-[9.5px] leading-3 font-bold tracking-[0.12em] uppercase',
              sub,
            )}
          >
            {site.wordmarkSub}
          </span>
        )}
      </span>
    </Link>
  );
}
