import { Eyebrow } from '@/app/(marketing)/_components/section';
import { landing } from '@/content/landing';

/** Server. navy-950 band, three navy-900 cards with pink-400 Fraunces numerals. */
export function HowItWorks() {
  const s = landing.how;
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="reveal bg-navy-950 section-y text-frost"
    >
      <div className="container-x">
        <div className="grid-12 items-end gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-pink-400">{s.eyebrow}</Eyebrow>
            <h2 id="how-title" className="mt-4 max-w-[20ch] text-display-l text-frost">
              {s.title}
            </h2>
          </div>
          <p className="col-span-12 text-body-l text-lavender-muted lg:col-span-5 lg:pb-1">
            {s.lede}
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.steps.map((step, index) => (
            <li
              key={step.number}
              className="reveal flex flex-col rounded-card border border-navy-800 bg-navy-900 p-7 md:last:col-span-2 lg:last:col-span-1"
              style={{ ['--i' as string]: index }}
            >
              <span
                aria-hidden="true"
                className="font-display text-[40px] leading-none font-semibold text-pink-400 kes"
              >
                {step.number}
              </span>
              <h3 className="mt-6 font-sans text-[22px] leading-7 font-bold text-frost">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 text-body-m text-lavender-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
