'use client';

import { XIcon } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

/** shadcn Sheet on radix Dialog. Client because Radix manages open state and focus. */
export function Sheet(props: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

export function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

export function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

export function SheetPortal(props: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

export function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-navy-950/60 motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
}

export function SheetContent({
  className,
  children,
  side = 'right',
  title,
  description,
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'right' | 'left';
  /** Accessible name for the dialog; rendered visually hidden. */
  title: string;
  description?: string;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed inset-y-0 z-50 flex h-dvh w-[min(100vw,420px)] flex-col bg-white shadow-menu transition-transform duration-300 ease-out motion-reduce:transition-none',
          side === 'right' &&
            'right-0 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
          side === 'left' &&
            'left-0 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
          className,
        )}
        {...props}
      >
        <SheetPrimitive.Title className="sr-only">{title}</SheetPrimitive.Title>
        {description ? (
          <SheetPrimitive.Description className="sr-only">{description}</SheetPrimitive.Description>
        ) : null}
        {children}
        <SheetPrimitive.Close
          className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-button text-mist-700 hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          aria-label="Close menu"
        >
          <XIcon className="size-5" aria-hidden="true" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
