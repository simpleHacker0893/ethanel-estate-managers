import Link from 'next/link';

import { DemoForm } from '@/app/(marketing)/_components/demo-form';
import { landing } from '@/content/landing';

/** Server. navy-950, id="demo" (the header CTA targets it). */
export function FinalCta() {
  const s = landing.cta;
  return (
    <section
      id="demo"
      aria-labelledby="demo-title"
      className="reveal scroll-mt-20 bg-navy-950 section-y text-frost"
    >
      <div className="container-x grid-12 gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <h2 id="demo-title" className="max-w-[18ch] text-display-l text-frost">
            {s.title}
          </h2>
          <p className="mt-5 max-w-[52ch] text-body-l text-lavender-muted">{s.body}</p>
          <div className="mt-8">
            <DemoForm
              emailLabel={s.emailLabel}
              emailPlaceholder={s.emailPlaceholder}
              submitLabel={s.submit}
              successMessage={s.success}
            />
          </div>
          <p className="mt-6 text-body-s text-lavender-muted">
            {s.altLine}{' '}
            <Link
              href={s.altCta.href}
              className="font-semibold text-pink-400 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
            >
              {s.altCta.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
