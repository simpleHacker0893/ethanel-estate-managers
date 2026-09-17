'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

/** shadcn Tabs on radix Tabs. Client: Radix state. Panels may be Server children (pass-through). */
export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('flex flex-wrap gap-x-8 gap-y-1 border-b border-navy-800', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center pb-3 font-sans text-label-m font-semibold text-lavender-muted transition-colors hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 data-[state=active]:text-frost data-[state=active]:shadow-[inset_0_-2px_0_0_var(--color-pink-500)]',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500',
        className,
      )}
      {...props}
    />
  );
}
