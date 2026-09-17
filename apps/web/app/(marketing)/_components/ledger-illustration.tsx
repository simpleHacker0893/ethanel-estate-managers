import { CheckIcon } from 'lucide-react';

import { cn } from '@ethanel/ui/lib/cn';

import { landing } from '@/content/landing';

/** Server. An HTML table, not an image: the sample lease ledger with a reversal row. */
export function LedgerIllustration() {
  const l = landing.trust.ledger;
  return (
    <figure className="overflow-hidden card text-ink" data-sample>
      <figcaption className="flex items-center justify-between gap-3 border-b border-mist-100 px-5 py-4">
        <span className="text-label-m font-semibold">{l.title}</span>
        <span className="rounded-full bg-mist-100 px-2.5 py-1 text-label-s font-semibold text-mist-500">
          {l.sampleTag}
        </span>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-s">
          <thead>
            <tr className="text-label-s text-mist-500">
              {l.columns.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={cn('px-5 py-2.5 font-semibold', i >= 2 && 'text-right')}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {l.rows.map((row) => (
              <tr
                key={row.ref}
                className={cn('border-t border-mist-100', row.tone === 'reversal' && 'bg-pink-50')}
              >
                <td className="px-5 py-3 whitespace-nowrap text-mist-500 kes">{row.date}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-2">
                    {row.tone === 'received' ? (
                      <span className="dot-8 bg-mpesa" aria-hidden="true" />
                    ) : null}
                    <span className="text-mist-500 kes">{row.ref}</span>
                    <span>· {row.label}</span>
                  </span>
                </td>
                <td className="px-5 py-3 text-right kes">{row.debit}</td>
                <td
                  className={cn(
                    'px-5 py-3 text-right kes',
                    row.tone === 'reversal' && 'font-semibold text-pink-700',
                  )}
                >
                  {row.credit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-mist-100 px-5 py-3 text-body-s text-mist-500">
        <span className="inline-flex items-center gap-2">
          <CheckIcon className="size-4 text-teal" aria-hidden="true" />
          {l.footer}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-1 text-label-s font-semibold text-teal">
          {l.balanced}
        </span>
      </div>
    </figure>
  );
}
