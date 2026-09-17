import { CheckIcon, MinusIcon } from 'lucide-react';

import { pricing } from '@/content/pricing';

/** Server. HTML table, one column per tier. */
export function FeatureMatrix() {
  return (
    <div className="overflow-x-auto card">
      <table className="w-full min-w-[640px] text-left text-body-s">
        <thead>
          <tr className="text-label-s text-mist-500">
            <th scope="col" className="px-5 py-3 font-semibold">
              {pricing.matrixTitle}
            </th>
            {pricing.tiers.map((t) => (
              <th key={t.id} scope="col" className="px-5 py-3 text-center font-semibold text-ink">
                {t.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pricing.matrix.map((row) => (
            <tr key={row.feature} className="border-t border-mist-100">
              <th scope="row" className="px-5 py-3 font-semibold text-ink">
                {row.feature}
              </th>
              {pricing.tiers.map((t) => {
                const v = row.values[t.id];
                return (
                  <td key={t.id} className="px-5 py-3 text-center text-mist-700 kes">
                    {v === true ? (
                      <span className="inline-flex items-center justify-center">
                        <CheckIcon
                          className="size-4 text-teal-700"
                          aria-hidden="true"
                          strokeWidth={2.5}
                        />
                        <span className="sr-only">Included</span>
                      </span>
                    ) : v === false ? (
                      <span className="inline-flex items-center justify-center">
                        <MinusIcon className="size-4 text-mist-300" aria-hidden="true" />
                        <span className="sr-only">Not included</span>
                      </span>
                    ) : (
                      v
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
