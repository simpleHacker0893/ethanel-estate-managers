'use client';

import { SlidersHorizontalIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useState } from 'react';

import type {
  MarketplaceAmenity,
  MarketplaceBudget,
  MarketplaceSearch,
  MarketplaceSort,
  MarketplaceType,
  MarketplaceWhere,
} from '@ethanel/contracts/marketplace-search';
import { marketplaceSearchParsers } from '@ethanel/contracts/marketplace-search';
import { Button } from '@ethanel/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ethanel/ui/components/select';
import { cn } from '@ethanel/ui/lib/cn';

import { marketplaceCopy } from '@/content/listings';
import {
  budgetBandsByIntent,
  intentSegments,
  searchBarCopy,
  sortOptions,
  typeOptions,
  whereOptions,
} from '@/content/marketplace';

const { listing: _listing, ...filterParsers } = marketplaceSearchParsers;

/**
 * Client: the results-page filter chrome. nuqs writes the URL with `shallow: false`, so the
 * server re-renders the cached ResultsGrid for the new search without a full reload.
 */
export function MarketplaceFilters({ initial }: { initial: MarketplaceSearch }) {
  const [q, setQ] = useQueryStates(filterParsers, { shallow: false, history: 'push' });
  const [open, setOpen] = useState(false);
  const segment = intentSegments.find((s) => s.id === q.intent) ?? intentSegments[0];
  const bands = budgetBandsByIntent[q.intent];
  const isDefault =
    q.where === 'anywhere' &&
    q.type === 'any' &&
    q.budget === 'any' &&
    q.beds === null &&
    q.amenities.length === 0;

  return (
    <div className="card p-4 md:p-5" data-initial-intent={initial.intent}>
      <div
        role="radiogroup"
        aria-label={searchBarCopy.segmentsLabel}
        className="flex flex-wrap gap-1 rounded-full bg-mist-100 p-1"
      >
        {intentSegments.map((s) => {
          const selected = s.id === q.intent;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => void setQ({ intent: s.id, budget: 'any' })}
              className={cn(
                'h-11 grow rounded-full px-4 text-[14px] leading-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:grow-0',
                selected
                  ? 'border border-mist-200 bg-white text-ink'
                  : 'text-mist-700 hover:text-ink',
              )}
            >
              {s.resultsLabel}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-body-s text-mist-500">{segment?.hint}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <div>
          <label
            htmlFor="mp-where"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.where}
          </label>
          <Select
            value={q.where}
            onValueChange={(v) => void setQ({ where: v as MarketplaceWhere })}
          >
            <SelectTrigger id="mp-where">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {whereOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} disabled={o.coming === true}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="mp-type"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.lookingFor}
          </label>
          <Select value={q.type} onValueChange={(v) => void setQ({ type: v as MarketplaceType })}>
            <SelectTrigger id="mp-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="mp-budget"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.budget} · {segment?.priceUnit}
          </label>
          <Select
            value={q.budget}
            onValueChange={(v) => void setQ({ budget: v as MarketplaceBudget })}
          >
            <SelectTrigger id="mp-budget">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bands.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="mp-sort"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {marketplaceCopy.sort}
          </label>
          <Select value={q.sort} onValueChange={(v) => void setQ({ sort: v as MarketplaceSort })}>
            <SelectTrigger id="mp-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full md:w-auto"
            aria-expanded={open}
            aria-controls="mp-more-filters"
            onClick={() => {
              setOpen((v) => !v);
            }}
          >
            <SlidersHorizontalIcon aria-hidden="true" />
            {marketplaceCopy.filters}
          </Button>
        </div>
      </div>

      <div
        id="mp-more-filters"
        hidden={!open}
        className="mt-4 grid gap-6 border-t border-mist-100 pt-4 md:grid-cols-[auto_1fr_auto]"
      >
        <fieldset>
          <legend className="mb-2 text-label-s font-semibold text-mist-700">
            {marketplaceCopy.bedrooms}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4].map((n) => {
              const selected = q.beds === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => void setQ({ beds: selected ? null : n })}
                  className={cn(
                    'h-11 min-w-11 rounded-full border px-4 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500',
                    selected
                      ? 'border-iris-700 bg-iris-700 text-white'
                      : 'border-mist-200 bg-white text-mist-700 hover:border-mist-300',
                  )}
                >
                  {n === 4 ? '4+' : n}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-label-s font-semibold text-mist-700">
            {marketplaceCopy.amenities}
          </legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(marketplaceCopy.amenityLabels) as MarketplaceAmenity[]).map((a) => {
              const checked = q.amenities.includes(a);
              return (
                <label
                  key={a}
                  className="inline-flex min-h-11 items-center gap-2 text-body-s text-ink"
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-iris-700"
                    checked={checked}
                    onChange={() =>
                      void setQ({
                        amenities: checked
                          ? q.amenities.filter((x) => x !== a)
                          : [...q.amenities, a],
                      })
                    }
                  />
                  {marketplaceCopy.amenityLabels[a]}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-end">
          <Button
            type="button"
            variant="link"
            disabled={isDefault}
            onClick={() =>
              void setQ({
                where: 'anywhere',
                type: 'any',
                budget: 'any',
                beds: null,
                amenities: [],
              })
            }
          >
            {marketplaceCopy.clearAll}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Static-property lookups on a Client reference are undefined on the server; export separately. */
export function MarketplaceFiltersSkeleton() {
  return (
    <div className="card p-4 md:p-5" aria-hidden="true">
      <div className="h-[52px] rounded-full bg-mist-100" />
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-[50px] rounded-button bg-mist-100" />
        ))}
      </div>
    </div>
  );
}
