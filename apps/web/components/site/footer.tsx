import Link from 'next/link';

import { footerColumns, site } from '@/content/site';
import { whatsappIntros } from '@/content/whatsapp';
import { whatsappContact } from '@/lib/whatsapp';

import { Logo } from './logo';

/** Server. Ink background, four link columns, WhatsApp line with the green dot. */
export function Footer() {
  const whatsapp = whatsappContact(whatsappIntros.general());

  return (
    <footer className="bg-ink text-lavender-muted">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-body-s text-lavender-muted">{site.tagline}</p>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-body-s font-semibold text-frost hover:text-pink-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
            >
              <span className="dot-8 bg-whatsapp" aria-hidden="true" />
              {site.whatsappUs} · {whatsapp.display}
            </a>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:gap-6"
          >
            {footerColumns.map((column) => (
              <div key={column.heading}>
                <p className="mb-4 eyebrow text-frost">{column.heading}</p>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-6 items-center rounded-[4px] text-body-s text-lavender-muted hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-navy-800 pt-6 text-body-s sm:flex-row sm:items-center sm:justify-between">
          <p>{site.copyright}</p>
          <p>{site.languages}</p>
        </div>
      </div>
    </footer>
  );
}
