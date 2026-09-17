import Link from 'next/link';
import Script from 'next/script';

import { Button } from '@ethanel/ui/components/button';

import { headerActions, navGroups, topLevelLinks } from '@/content/nav';

import { Logo } from './logo';
import { MegaMenu } from './mega-menu';
import { MobileNav } from './mobile-nav';

/**
 * Server. Sticky navy-950 bar; after 24px of scroll it drops to 92% with backdrop-blur through a
 * scroll-driven animation (see `.site-header` in globals.css), so no scroll listener ships.
 */
export function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-navy-900 bg-navy-950 text-frost">
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navGroups.map((group) => (
              <MegaMenu key={group.id} group={group} />
            ))}
            {topLevelLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-[8px] px-1 font-sans text-label-m font-semibold text-frost transition-colors hover:text-pink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href={headerActions.signIn.href}
            className="rounded-[8px] font-sans text-label-m font-semibold text-frost hover:text-pink-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
          >
            {headerActions.signIn.label}
          </Link>
          <Button asChild variant="accent" size="compact">
            <Link href={headerActions.demo.href}>{headerActions.demo.label}</Link>
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>

      <Script id="mega-menu-controller" strategy="afterInteractive">{`
(function () {
  var items = document.querySelectorAll('[data-menu]');
  function setOpen(item, open) {
    var trigger = item.querySelector('[data-menu-trigger]');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { item.removeAttribute('data-closed'); item.setAttribute('data-open', ''); }
    else { item.removeAttribute('data-open'); }
  }
  function closeAll(except) {
    items.forEach(function (i) { if (i !== except) { i.removeAttribute('data-open'); i.removeAttribute('data-closed'); var t = i.querySelector('[data-menu-trigger]'); if (t) t.setAttribute('aria-expanded', 'false'); } });
  }
  items.forEach(function (item) {
    var trigger = item.querySelector('[data-menu-trigger]');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      closeAll(item);
      setOpen(item, !open);
      if (open) item.setAttribute('data-closed', '');
    });
    item.addEventListener('pointerenter', function () { closeAll(item); setOpen(item, true); });
    item.addEventListener('pointerleave', function () { if (!item.contains(document.activeElement)) setOpen(item, false); });
    item.addEventListener('focusin', function () { closeAll(item); item.removeAttribute('data-closed'); trigger.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) { setOpen(item, false); item.removeAttribute('data-closed'); } });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); setOpen(item, false); item.setAttribute('data-closed', ''); trigger.focus(); }
    });
  });
  document.addEventListener('pointerdown', function (e) { if (!e.target.closest || !e.target.closest('[data-menu]')) closeAll(null); });
})();
      `}</Script>
    </header>
  );
}
