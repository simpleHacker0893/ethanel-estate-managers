import Link from 'next/link';

import { cn } from '@ethanel/ui/lib/cn';

/** Pink square mark with a Fraunces "E" plus the wordmark. Server. */
export function Logo({
  wordmarkClassName,
  className,
}: {
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500',
        className,
      )}
      aria-label="Ethanel home"
    >
      <span
        aria-hidden="true"
        className="inline-flex size-8 items-center justify-center rounded-[8px] bg-pink-500 font-display text-[20px] leading-none font-semibold text-navy-950"
      >
        E
      </span>
      <span
        className={cn(
          'font-display text-[20px] leading-6 font-semibold tracking-[-0.01em] text-frost',
          wordmarkClassName,
        )}
      >
        Ethanel
      </span>
    </Link>
  );
}
