import Link from 'next/link';

import { Eyebrow } from '@/app/(marketing)/_components/section';
import { demoAccounts } from '@/content/demo-accounts';

/** Server. White band listing the demo accounts; the sign-in link opens the shared door. */
export function DemoAccounts() {
  const s = demoAccounts;
  return (
    <section
      id="demo-accounts"
      aria-labelledby="demo-accounts-title"
      className="reveal bg-white section-y"
    >
      <div className="container-x">
        <Eyebrow className="text-iris-700">{s.eyebrow}</Eyebrow>
        <h2 id="demo-accounts-title" className="mt-4 max-w-[20ch] text-display-l">
          {s.title}
        </h2>
        <p className="mt-5 max-w-[60ch] text-body-l text-mist-700">{s.body}</p>

        <div className="mt-10 overflow-x-auto rounded-card border border-mist-200">
          <table className="w-full min-w-[720px] text-body-s">
            <thead className="bg-mist-50 text-left text-label-s text-mist-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {s.columns.persona}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {s.columns.name}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {s.columns.email}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {s.columns.sees}
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">{s.signIn}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {s.rows.map((row) => (
                <tr key={row.email}>
                  <td className="px-4 py-3 font-semibold text-ink">{row.persona}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">
                    <code className="rounded-[6px] bg-mist-100 px-1.5 py-0.5 text-label-s text-ink">
                      {row.email}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-mist-700">{row.sees}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/sign-in"
                      className="font-semibold text-iris-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-500"
                    >
                      {s.signIn}
                      <span className="sr-only"> as {row.name}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-body-s text-mist-500">
          {s.columns.password}:{' '}
          <code className="rounded-[6px] bg-mist-100 px-1.5 py-0.5 text-label-s text-ink">
            {s.password}
          </code>
          {' · '}
          {s.note}
        </p>
      </div>
    </section>
  );
}
