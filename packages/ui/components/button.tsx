import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

/**
 * Ethanel button. 50px tall, radius 10, Manrope 600 15/20.
 * primary   iris-700 + white, hover iris-600
 * accent    pink-500 + navy-950 text (never white), hover pink-400
 * secondary white + mist-200 stroke
 * ghost     transparent + lavender-muted stroke, for dark surfaces
 * link      text only, iris-700
 */
export const buttonVariants = cva(
  'inline-flex h-[50px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-button border border-transparent px-6 font-sans text-label-m font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-iris-700 text-white hover:bg-iris-600',
        accent: 'bg-pink-500 text-navy-950 hover:bg-pink-400',
        secondary: 'border-mist-200 bg-white text-ink hover:bg-mist-100',
        ghost:
          'border-lavender-muted bg-transparent text-frost hover:border-frost hover:bg-white/5',
        link: 'h-auto rounded-none border-0 px-0 text-iris-700 underline-offset-4 hover:text-iris-800 hover:underline',
      },
      size: {
        default: 'h-[50px] px-6',
        compact: 'h-11 px-5',
        icon: 'size-11 px-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the styles onto the child element (e.g. a next/link). */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  );
}
