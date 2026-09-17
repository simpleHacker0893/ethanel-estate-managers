import { LedgerIllustration } from '@/app/(marketing)/_components/ledger-illustration';
import { Eyebrow } from '@/app/(marketing)/_components/section';
import { NavIconBadge } from '@/components/site/nav-icon';
import { landing } from '@/content/landing';

/** Server. Ledger table left (under the H2), three hairline-divided points right. */
export function Trust() {
  const s = landing.trust;
  return (
    <section id="trust" aria-labelledby="trust-title" className="reveal bg-mist-50 section-y">
      <div className="container-x">
        <Eyebrow className="text-iris-700">{s.eyebrow}</Eyebrow>
        <h2 id="trust-title" className="mt-4 max-w-[20ch] text-display-l">
          {s.title}
        </h2>

        <div className="mt-10 grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <LedgerIllustration />
          </div>
          <ul className="col-span-12 divide-y divide-mist-200 lg:col-span-5 lg:pl-4">
            {s.points.map((point, index) => (
              <li
                key={point.title}
                className="reveal flex gap-4 py-6 first:pt-0"
                style={{ ['--i' as string]: index }}
              >
                <NavIconBadge name={point.icon} />
                <div>
                  <h3 className="font-sans text-[18px] leading-6 font-bold text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-body-m text-mist-700">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
