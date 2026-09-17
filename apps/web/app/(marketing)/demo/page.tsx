import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { demo } from '@/content/demo';
import { whatsappIntros } from '@/content/whatsapp';
import { whatsappContact } from '@/lib/whatsapp';

import { DemoQuestionnaire } from './_components/demo-questionnaire';

export const metadata: Metadata = { title: 'Book a demo', description: demo.lede };

/** Server. Shell prerenders; the questionnaire is a Client leaf that reads ?tier under Suspense. */
export default function DemoPage() {
  const whatsapp = whatsappContact(whatsappIntros.demo());
  return (
    <>
      <section aria-labelledby="demo-title" className="bg-navy-950 py-14 text-frost md:py-16">
        <div className="container-x">
          <Eyebrow className="text-pink-400">{demo.eyebrow}</Eyebrow>
          <h1 id="demo-title" className="mt-4 max-w-[18ch] text-display-xl text-frost">
            {demo.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-body-l text-lavender-muted">{demo.lede}</p>
        </div>
      </section>
      <section aria-label="Demo questionnaire" className="bg-mist-50 section-y">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <div className="card p-6 md:p-8">
              <Suspense fallback={null}>
                <DemoQuestionnaire whatsappHref={whatsapp.href} />
              </Suspense>
            </div>
          </div>
          <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="eyebrow text-iris-700">{demo.aside.title}</p>
            <ol className="mt-4 flex flex-col gap-4">
              {demo.aside.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-iris-100 font-sans text-label-s font-bold text-iris-700 kes"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="text-body-m text-mist-700">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-body-s text-mist-500">{demo.aside.privacy}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
