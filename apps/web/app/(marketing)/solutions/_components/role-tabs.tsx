import Link from 'next/link';

import { cn } from '@ethanel/ui/lib/cn';

import { roleIds, roles, solutionsPage, type RoleId } from '@/content/solutions';

/** Server. URL-driven tabs: plain links with aria-current, no client state. */
export function RoleTabs({ active }: { active: RoleId }) {
  return (
    <nav aria-label={solutionsPage.tabsLabel} className="overflow-x-auto">
      <ul className="flex min-w-max gap-1 rounded-full bg-navy-900 p-1">
        {roleIds.map((id) => {
          const selected = id === active;
          return (
            <li key={id}>
              <Link
                href={`/solutions/${id}`}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'inline-flex h-11 items-center rounded-full px-4 text-[14px] leading-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500',
                  selected ? 'bg-white text-ink' : 'text-lavender-muted hover:text-frost',
                )}
              >
                {roles[id].label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
