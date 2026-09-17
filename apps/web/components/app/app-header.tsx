import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { Route } from 'next';

import { Logo } from '@/components/site/logo';

export interface AppNavLink {
  readonly label: string;
  readonly href: Route;
}

/**
 * Server. Header for signed-in surfaces: logo, the surface name, its links and Clerk's
 * UserButton (account menu + sign out). No Fraunces here; the dashboard never uses display type.
 */
export function AppHeader({ title, links }: { title: string; links: readonly AppNavLink[] }) {
  return (
    <header className="border-b border-navy-900 bg-navy-950 text-frost">
      <div className="container-x flex h-[64px] items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Logo />
          <span className="hidden text-label-m font-semibold text-lavender-muted sm:inline">
            {title}
          </span>
        </div>
        <nav aria-label="Workspace" className="flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[8px] font-sans text-label-m font-semibold text-frost hover:text-pink-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
            >
              {link.label}
            </Link>
          ))}
          <UserButton />
        </nav>
      </div>
    </header>
  );
}
