import type { Metadata } from 'next';
import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { SceneImageSlot } from '@/components/media/scene-image-slot';
import { Logo } from '@/components/site/logo';
import { press } from '@/content/press';

export const metadata: Metadata = { title: 'Press & brand', description: press.boilerplate.short };

/** Server. Press kit: boilerplate, contact, facts, three illustrative stories, logo, colour, type. */
export default function PressPage() {
  return (
    <>
      <section aria-labelledby="press-title" className="bg-navy-950 py-16 text-frost md:py-20">
        <div className="container-x grid-12 items-center gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-pink-400">{press.eyebrow}</Eyebrow>
            <h1 id="press-title" className="mt-4 max-w-[18ch] text-display-xl text-frost">
              {press.title}
            </h1>
            <p className="mt-5 max-w-[60ch] text-body-l text-lavender-muted">{press.lede}</p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <SceneImageSlot slot={press.image} variant="card" attribution="none" />
          </div>
        </div>
      </section>

      <section aria-labelledby="press-boilerplate" className="bg-mist-50 section-y">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <h2 id="press-boilerplate" className="text-heading-m">
              {press.boilerplate.title}
            </h2>
            <p className="mt-4 font-sans text-[20px] leading-7 font-bold text-ink">
              {press.boilerplate.short}
            </p>
            <p className="mt-3 text-body-m text-mist-700">{press.boilerplate.long}</p>
            <p className="mt-4 rounded-card border border-iris-200 bg-iris-50 px-4 py-3 text-body-s text-iris-800">
              {press.boilerplate.vocabulary}
            </p>
          </div>
          <div className="col-span-12 flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
            <div className="card p-5">
              <p className="eyebrow text-mist-500">{press.contact.title}</p>
              <p className="mt-2 font-sans text-label-m font-semibold text-ink">
                {press.contact.name}
              </p>
              <p className="text-body-s text-mist-700">{press.contact.email}</p>
              <p className="mt-2 text-body-s text-mist-500">{press.contact.note}</p>
            </div>
            <div className="card p-5">
              <p className="eyebrow text-mist-500">{press.facts.title}</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-body-s text-mist-700">
                {press.facts.items.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="mt-3 text-body-s font-semibold text-mist-500">
                {press.facts.notPublished}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="press-stories" className="bg-white section-y">
        <div className="container-x">
          <h2 id="press-stories" className="text-display-l">
            {press.storiesTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-body-m text-mist-700">{press.storiesLede}</p>
          <ul className="mt-10 flex flex-col gap-8">
            {press.stories.map((story, i) => (
              <li
                key={story.id}
                className="grid gap-6 overflow-hidden card p-6 lg:grid-cols-12 lg:p-8"
              >
                <div className={cn('lg:col-span-5', i % 2 ? 'lg:order-2' : '')}>
                  <SceneImageSlot slot={story.image} variant="card" />
                </div>
                <div className="lg:col-span-7">
                  <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-label-s font-semibold text-amber-700">
                    {press.illustrativeTag}
                  </span>
                  <p className="mt-4 eyebrow text-iris-700">{story.eyebrow}</p>
                  <h3 className="mt-2 max-w-[26ch] font-display text-[26px] leading-8 font-semibold text-ink">
                    {story.title}
                  </h3>
                  <p className="mt-3 text-body-m text-mist-700">{story.body}</p>
                  <table className="mt-5 w-full text-left text-body-s">
                    <thead>
                      <tr className="text-label-s text-mist-500">
                        <th scope="col" className="py-2 pr-3 font-semibold">
                          What changed
                        </th>
                        <th scope="col" className="py-2 pr-3 font-semibold">
                          Before
                        </th>
                        <th scope="col" className="py-2 font-semibold">
                          With Ethanel
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {story.metrics.map((m) => (
                        <tr key={m.label} className="border-t border-mist-100">
                          <th scope="row" className="py-2 pr-3 font-semibold text-ink">
                            {m.label}
                          </th>
                          <td className="py-2 pr-3 text-mist-700">{m.before}</td>
                          <td className="py-2 font-semibold text-teal-700">{m.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="press-logo" className="bg-mist-50 section-y">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-6">
            <h2 id="press-logo" className="text-heading-m">
              {press.logo.title}
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              <div className="rounded-card bg-navy-950 p-6">
                <Logo />
              </div>
              <div className="rounded-card border border-mist-200 bg-white p-6">
                <Logo tone="light" />
              </div>
            </div>
            <p className="mt-4 text-body-s text-mist-700">{press.logo.rule}</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {press.logo.downloads.map((d) => (
                <li key={d.href}>
                  <a
                    href={d.href}
                    download
                    className="inline-flex h-11 items-center gap-2 rounded-button border border-mist-200 bg-white px-4 text-label-s font-semibold text-ink hover:bg-mist-100"
                  >
                    <DownloadIcon className="size-4" aria-hidden="true" />
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-body-s text-mist-500">{press.logo.fontNote}</p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <h2 className="text-heading-m">{press.colour.title}</h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {press.colour.swatches.map((s) => (
                <li key={s.hex} className="overflow-hidden card">
                  <div className={cn('h-16', s.className)} aria-hidden="true" />
                  <div className="p-3">
                    <p className="font-sans text-label-s font-semibold text-ink">{s.name}</p>
                    <p className="text-body-s text-mist-500 kes">{s.hex}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h2 className="mt-10 text-heading-m">{press.type.title}</h2>
            <dl className="mt-4 flex flex-col gap-3">
              <div className="card p-4">
                <dt className="font-display text-[24px] leading-7 font-semibold text-ink">
                  {press.type.display.name}
                </dt>
                <dd className="mt-1 text-body-s text-mist-700">{press.type.display.note}</dd>
              </div>
              <div className="card p-4">
                <dt className="font-sans text-[22px] leading-7 font-bold text-ink">
                  {press.type.body.name}
                </dt>
                <dd className="mt-1 text-body-s text-mist-700">{press.type.body.note}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="press-closing" className="bg-iris-50 py-14">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="press-closing" className="text-heading-m">
              {press.closing.title}
            </h2>
            <p className="mt-2 text-body-m text-mist-700">{press.closing.body}</p>
          </div>
          <Button asChild variant="primary">
            <Link href={press.closing.cta.href}>{press.closing.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
