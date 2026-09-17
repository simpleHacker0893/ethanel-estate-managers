'use client';

import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ethanel/ui/components/accordion';
import { Button } from '@ethanel/ui/components/button';
import { Sheet, SheetContent, SheetTrigger } from '@ethanel/ui/components/sheet';

import { headerActions, navGroups, topLevelLinks } from '@/content/nav';

import { Logo } from './logo';

import { NavIconBadge } from './nav-icon';

/**
 * Client: owns the Sheet open state. Below 1024px the header shows this instead of the
 * mega-menus. Rows are 56px, one accordion per group, "Book a demo" pinned at the bottom.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-button text-frost hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          aria-label="Open menu"
        >
          <MenuIcon className="size-6" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" title="Menu" description="Site navigation">
        <div className="flex h-14 shrink-0 items-center border-b border-mist-100 px-5">
          <Logo tone="light" />
        </div>

        <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
          <Accordion type="multiple" className="w-full">
            {navGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id} className="border-mist-100">
                <AccordionTrigger className="px-2">{group.label}</AccordionTrigger>
                <AccordionContent className="pb-2">
                  <ul className="flex flex-col">
                    {group.columns.map((column) => (
                      <li key={column.eyebrow}>
                        <p className="px-2 pt-2 pb-1 eyebrow text-mist-500">{column.eyebrow}</p>
                        <ul>
                          {column.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setOpen(false);
                                }}
                                className="flex min-h-14 items-center gap-3 rounded-[10px] px-2 py-2 text-label-m font-semibold text-ink hover:bg-mist-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink-500"
                              >
                                <NavIconBadge name={item.icon} />
                                <span className="inline-flex items-center gap-1.5">
                                  {item.label}
                                  {item.badge ? (
                                    <span className="rounded-full bg-mist-100 px-2 py-0.5 text-label-s text-mist-500">
                                      {item.badge}
                                    </span>
                                  ) : null}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <ul className="mt-1">
            {topLevelLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="flex min-h-14 items-center rounded-[10px] px-2 text-label-m font-semibold text-ink hover:bg-mist-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={headerActions.signIn.href}
                onClick={() => {
                  setOpen(false);
                }}
                className="flex min-h-14 items-center rounded-[10px] px-2 text-label-m font-semibold text-ink hover:bg-mist-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink-500"
              >
                {headerActions.signIn.label}
              </Link>
            </li>
            <li>
              <Link
                href={headerActions.signUp.href}
                onClick={() => {
                  setOpen(false);
                }}
                className="flex min-h-14 items-center rounded-[10px] px-2 text-label-m font-semibold text-ink hover:bg-mist-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink-500"
              >
                {headerActions.signUp.label}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="shrink-0 border-t border-mist-100 p-4">
          <Button asChild variant="accent" fullWidth>
            <Link
              href={headerActions.demo.href}
              onClick={() => {
                setOpen(false);
              }}
            >
              {headerActions.demo.label}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
