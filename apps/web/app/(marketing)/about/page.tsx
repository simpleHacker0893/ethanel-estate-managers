import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@ethanel/ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ethanel/ui/components/tabs';
import { cn } from '@ethanel/ui/lib/cn';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { SceneImageSlot } from '@/components/media/scene-image-slot';
import { about } from '@/content/about';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ethanel Estate Managers was founded in 2024 in Kiambu County by two sisters and advocates, Loise Ndirangu and Racheal Wangui, with Njuguna Njenga as CTO.',
};

/**
 * Server. Tabs are a Client leaf; the panels are Server children passed through. The first tab
 * is prerendered in the shell, so the story and the imagery are in the static HTML.
 */
export default function AboutPage() {
  return (
    <>
      <Tabs defaultValue={about.tabs[0].id}>
        <section
          aria-labelledby="about-title"
          className="relative isolate overflow-hidden bg-navy-950 text-frost"
        >
          <SceneImageSlot
            slot="about-story"
            variant="hero"
            priority
            attribution="sr-only"
            className="opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950"
          />
          <div className="relative container-x pt-16 md:pt-20">
            <Eyebrow className="text-pink-400">{about.eyebrow}</Eyebrow>
            <h1 id="about-title" className="mt-4 max-w-[22ch] text-display-xl text-frost">
              {about.title}
            </h1>
            <TabsList aria-label={about.tabsLabel} className="mt-10">
              {about.tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </section>

        {about.tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <section aria-labelledby={`about-${tab.id}-title`} className="bg-mist-50 section-y">
              <div className="container-x grid-12 gap-y-10">
                <div className="col-span-12 lg:col-span-6">
                  <h2 id={`about-${tab.id}-title`} className="max-w-[22ch] text-display-l">
                    {tab.heading}
                  </h2>
                  <p className="mt-5 text-body-l text-mist-700">{tab.lede}</p>
                  <p className="mt-4 text-body-m text-mist-700">{tab.body}</p>
                  {tab.image ? (
                    <div className="mt-8">
                      <SceneImageSlot slot={tab.image} variant="card" />
                    </div>
                  ) : null}
                </div>
                <div className="col-span-12 lg:col-span-5 lg:col-start-8">
                  <p className="text-label-s font-semibold text-mist-500">{tab.sideTitle}</p>
                  {tab.id === 'team' ? (
                    <ul className="mt-3 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                      {about.team.map((person) => (
                        <li key={person.name} className="flex items-center gap-4 card p-4">
                          <div className="w-20 shrink-0">
                            <SceneImageSlot
                              slot={person.image}
                              variant="portrait"
                              attribution="none"
                            />
                          </div>
                          <div>
                            <p className="font-sans text-label-m font-semibold text-ink">
                              {person.name}
                            </p>
                            <p className="text-label-s font-semibold text-iris-700">
                              {person.role}
                            </p>
                            <p className="mt-1 text-body-s text-mist-700">{person.bio}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="mt-3 flex flex-col gap-3">
                      {tab.side.map((item) => {
                        const coming = 'tag' in item && item.tag === 'Coming';
                        return (
                          <li
                            key={item.title}
                            className={cn(
                              'flex items-center gap-3.5 card px-4 py-4',
                              'tag' in item && !coming && 'border-iris-200 bg-iris-50',
                            )}
                          >
                            <span
                              className={cn(
                                'inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] font-sans text-label-s font-bold text-iris-700',
                                'tag' in item && !coming ? 'bg-iris-200' : 'bg-iris-100',
                              )}
                              aria-hidden="true"
                            >
                              {item.glyph}
                            </span>
                            <span className="flex flex-1 flex-col">
                              <span className="font-sans text-label-m font-semibold text-ink">
                                {item.title}
                              </span>
                              <span className="text-body-s text-mist-500">{item.body}</span>
                            </span>
                            {'tag' in item ? (
                              <span
                                className={cn(
                                  'text-label-s font-semibold',
                                  coming ? 'text-mist-500' : 'text-iris-700',
                                )}
                              >
                                {item.tag}
                              </span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          </TabsContent>
        ))}
      </Tabs>

      <section aria-labelledby="about-closing" className="bg-iris-50 py-14">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="about-closing" className="text-heading-m">
              {about.closing.title}
            </h2>
            <p className="mt-2 text-body-m text-mist-700">{about.closing.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary">
              <Link href={about.closing.primary.href}>{about.closing.primary.label}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={about.closing.secondary.href}>{about.closing.secondary.label}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
