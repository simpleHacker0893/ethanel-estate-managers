import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@ethanel/ui/lib/cn';

import type { NavGroup } from '@/content/nav';

import { SceneImageSlot } from '@/components/media/scene-image-slot';

import { NavIconBadge } from './nav-icon';

/**
 * Server. One trigger + panel per group. Opening on hover and focus is CSS (see `.mega-*` rules
 * in globals.css); Escape, focus return and aria-expanded are handled by the tiny inline script
 * in header.tsx. The panel is `role="menu"` with `role="menuitem"` links.
 */
export function MegaMenu({ group }: { group: NavGroup }) {
  const panelId = `menu-${group.id}`;
  const hasPromo = Boolean(group.promo);
  const colCount = group.columns.length + (hasPromo ? 1 : 0);

  return (
    <li className="mega-item" data-menu>
      <button
        type="button"
        className="mega-trigger inline-flex h-11 items-center gap-1.5 rounded-[8px] px-1 font-sans text-label-m font-semibold text-frost transition-colors hover:text-pink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 aria-expanded:text-pink-400"
        aria-expanded="false"
        aria-haspopup="menu"
        aria-controls={panelId}
        data-menu-trigger
      >
        {group.label}
        <ChevronDownIcon
          className="size-3.5 text-lavender-muted transition-transform duration-200 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        role="menu"
        aria-label={group.label}
        data-menu-panel
        className="mega-panel absolute top-full left-1/2 z-40 mt-1 rounded-card border-t border-mist-200 bg-white p-6 text-ink shadow-menu"
        style={{ width: `min(${group.width}px, 100%)` }}
      >
        <div
          className={cn('grid gap-5', hasPromo ? 'grid-cols-[1fr_1fr_220px]' : 'grid-cols-3')}
          style={{
            gridTemplateColumns: hasPromo
              ? `repeat(${group.columns.length}, minmax(0, 1fr)) ${group.id === 'solutions' ? '260px' : '220px'}`
              : `repeat(${colCount}, minmax(0, 1fr))`,
          }}
        >
          {group.columns.map((column, index) => (
            <div
              key={column.eyebrow}
              className={cn('flex flex-col gap-1', index > 0 && 'border-l border-mist-100 pl-5')}
            >
              <p className="px-3 pb-2 eyebrow text-mist-500">{column.eyebrow}</p>
              {column.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  className="flex items-start gap-3.5 rounded-[12px] px-3 py-2.5 text-ink transition-colors hover:bg-mist-50 focus-visible:bg-mist-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink-500"
                >
                  {item.image ? (
                    <SceneImageSlot slot={item.image} variant="thumb" attribution="none" />
                  ) : (
                    <NavIconBadge name={item.icon} />
                  )}
                  <span className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1.5 text-label-m font-semibold">
                      {item.label}
                      {item.badge ? (
                        <span className="rounded-full bg-mist-100 px-2 py-0.5 text-label-s font-semibold text-mist-500">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    {item.description ? (
                      <span className="text-body-s text-mist-500">{item.description}</span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          ))}

          {group.promo ? (
            <Link
              href={group.promo.href}
              role="menuitem"
              className={cn(
                'flex flex-col justify-between gap-4 rounded-[12px] border p-5 text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500',
                group.promo.tone === 'pink'
                  ? 'border-pink-200 bg-pink-100 hover:bg-pink-50'
                  : 'border-iris-200 bg-iris-50 hover:bg-white',
              )}
            >
              {group.promo.image ? (
                <SceneImageSlot slot={group.promo.image} variant="promo" attribution="none" />
              ) : null}
              <span className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    'eyebrow',
                    group.promo.tone === 'pink' ? 'text-pink-700' : 'text-iris-700',
                  )}
                >
                  {group.promo.eyebrow}
                </span>
                <span
                  className={cn(
                    'font-semibold text-ink',
                    group.promo.tone === 'pink'
                      ? 'text-[16px] leading-[22px]'
                      : 'font-display text-[18px] leading-6',
                  )}
                >
                  {group.promo.title}
                </span>
                {group.promo.body ? (
                  <span className="text-body-s text-mist-700">{group.promo.body}</span>
                ) : null}
              </span>
              <span
                className={cn(
                  'text-label-s font-semibold',
                  group.promo.tone === 'pink' ? 'text-pink-700' : 'text-iris-700',
                )}
              >
                {group.promo.cta}
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
}
