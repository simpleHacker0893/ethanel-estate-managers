import type { ContentSection } from '@/content/legal';

import { Eyebrow } from './section';

/** Server. Long-form legal-style page: eyebrow, h1, draft note, ordered sections. */
export function ContentPage({
  eyebrow,
  title,
  draftNote,
  sections,
}: {
  eyebrow: string;
  title: string;
  draftNote?: string;
  sections: readonly ContentSection[];
}) {
  return (
    <div className="container-x section-y">
      <Eyebrow className="text-iris-700">{eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-3xl text-display-l">{title}</h1>
      {draftNote ? (
        <p className="mt-6 max-w-2xl rounded-card border border-amber-100 bg-amber-100 px-4 py-3 text-body-s text-amber-700">
          {draftNote}
        </p>
      ) : null}
      <div className="mt-10 max-w-2xl">
        {sections.map((section) => (
          <section key={section.heading} className="mt-8 first:mt-0">
            <h2 className="font-sans text-[20px] leading-7 font-bold text-ink">
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-3 text-body-m text-mist-700">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
