import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { SceneImageSlot } from '@/components/media/scene-image-slot';
import { NavIconBadge } from '@/components/site/nav-icon';
import { careers } from '@/content/careers';

export const metadata: Metadata = { title: 'Careers', description: careers.lede };

/** Server. Careers from the canvas; roles are explicitly labelled as not yet open. */
export default function CareersPage() {
  return (
    <>
      <section
        aria-labelledby="careers-title"
        className="relative isolate overflow-hidden bg-navy-950 text-frost"
      >
        <SceneImageSlot
          slot={careers.image}
          variant="hero"
          priority
          attribution="sr-only"
          className="opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/50"
        />
        <div className="relative container-x py-16 md:py-20">
          <Eyebrow className="text-pink-400">{careers.eyebrow}</Eyebrow>
          <h1 id="careers-title" className="mt-4 max-w-[18ch] text-display-xl text-frost">
            {careers.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-body-l text-lavender-muted">{careers.lede}</p>
        </div>
      </section>

      <section aria-labelledby="careers-how" className="bg-mist-50 section-y">
        <div className="container-x">
          <h2 id="careers-how" className="text-display-l">
            {careers.howTitle}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            {careers.how.map((item) => (
              <li key={item.title} className="card p-7 md:first:col-span-2 lg:first:col-span-1">
                <NavIconBadge name={item.icon} size={48} />
                <h3 className="mt-5 font-sans text-[18px] leading-6 font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-body-s text-mist-700">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="careers-roles" className="bg-white section-y">
        <div className="container-x">
          <h2 id="careers-roles" className="text-display-l">
            {careers.rolesTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-body-m text-mist-700">{careers.rolesNote}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {careers.roles.map((role) => (
              <li
                key={role.title}
                className="flex flex-col gap-3 card p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-sans text-[18px] leading-6 font-bold text-ink">{role.title}</p>
                  <p className="text-body-s text-mist-500">{role.meta}</p>
                </div>
                <span className="w-fit rounded-full bg-mist-100 px-3 py-1.5 text-label-s font-semibold text-mist-700">
                  {role.status}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4 rounded-card border border-iris-200 bg-iris-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-label-m font-semibold text-ink">{careers.noFit.title}</p>
              <p className="mt-1 text-body-s text-mist-700">{careers.noFit.body}</p>
            </div>
            <Button asChild variant="secondary">
              <Link href={careers.noFit.cta.href}>{careers.noFit.cta.label}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="careers-like" className="bg-mist-50 section-y">
        <div className="container-x">
          <h2 id="careers-like" className="text-display-l">
            {careers.likeTitle}
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {careers.like.map((item) => (
              <li key={item.title} className="border-t-2 border-iris-700 pt-4">
                <p className="font-sans text-label-m font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-body-s text-mist-700">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="careers-closing" className="bg-navy-950 py-14 text-frost">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="careers-closing" className="text-heading-m text-frost">
              {careers.closing.title}
            </h2>
            <p className="mt-2 text-body-m text-lavender-muted">{careers.closing.body}</p>
          </div>
          <Button asChild variant="accent" className="w-full md:w-auto">
            <Link href={careers.closing.cta.href}>{careers.closing.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
