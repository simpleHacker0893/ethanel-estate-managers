import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@ethanel/ui/lib/cn';

/**
 * Server. One landmark per section: `<section aria-labelledby>` pointing at its heading, the
 * shared vertical rhythm, and the `reveal` entrance class (CSS-only, see globals.css).
 */
export function Section({
  id,
  labelledBy,
  className,
  children,
  ...props
}: ComponentProps<'section'> & { id: string; labelledBy: string; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('reveal section-y', className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  className,
  dot,
  children,
}: {
  className?: string;
  dot?: 'pink';
  children: ReactNode;
}) {
  return (
    <p className={cn('inline-flex items-center gap-2 eyebrow', className)}>
      {dot ? <span className="dot-8 bg-pink-500" aria-hidden="true" /> : null}
      {children}
    </p>
  );
}
