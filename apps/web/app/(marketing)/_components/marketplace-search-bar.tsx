'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type {
  MarketplaceBudget,
  MarketplaceIntent,
  MarketplaceType,
  MarketplaceCounty,
} from '@ethanel/contracts/marketplace-search';
import { serializeMarketplaceSearch } from '@ethanel/contracts/marketplace-search';
import { Button } from '@ethanel/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ethanel/ui/components/select';
import { cn } from '@ethanel/ui/lib/cn';

import {
  budgetBandsByIntent,
  countyOptions,
  intentSegments,
  landingIntentIds,
  searchBarCopy,
  typeOptions,
} from '@/content/marketplace';

/**
 * Client: segmented control + three Selects, then navigates to /marketplace with the URL built
 * by the contract's nuqs serializer, so the results page parses exactly what was sent.
 */
export function MarketplaceSearchBar() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [intent, setIntent] = useState<MarketplaceIntent>('rent');
  const [county, setCounty] = useState<MarketplaceCounty>('anywhere');
  const [area, setArea] = useState('');
  const [type, setType] = useState<MarketplaceType>('any');
  const [budget, setBudget] = useState<MarketplaceBudget>('any');

  const segments = intentSegments.filter((s) => landingIntentIds.includes(s.id));
  const active = intentSegments.find((s) => s.id === intent) ?? segments[0];
  const bands = budgetBandsByIntent[intent];

  function pickIntent(next: MarketplaceIntent) {
    setIntent(next);
    setBudget('any');
  }

  function submit() {
    const href = serializeMarketplaceSearch('/marketplace', {
      intent,
      county,
      area: area.trim(),
      type,
      budget,
    });
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="card p-4 md:p-5"
      aria-label="Search the marketplace"
      aria-busy={pending}
    >
      <fieldset className="min-w-0">
        <legend className="sr-only">{searchBarCopy.segmentsLabel}</legend>
        <div
          role="radiogroup"
          aria-label={searchBarCopy.segmentsLabel}
          className="flex flex-wrap gap-1 rounded-full bg-mist-100 p-1"
        >
          {segments.map((segment) => {
            const selected = segment.id === intent;
            return (
              <button
                key={segment.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  pickIntent(segment.id);
                }}
                className={cn(
                  'h-11 grow rounded-full px-4 text-[14px] leading-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:grow-0',
                  selected
                    ? 'border border-mist-200 bg-white text-ink'
                    : 'text-mist-700 hover:text-ink',
                )}
              >
                {segment.landingLabel}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-body-s text-mist-500" aria-live="polite">
          {active?.hint}
        </p>
      </fieldset>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <div>
          <label
            htmlFor="search-county"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.county}
          </label>
          <Select
            value={county}
            onValueChange={(v) => {
              setCounty(v as MarketplaceCounty);
            }}
          >
            <SelectTrigger id="search-county">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countyOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="search-area"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.area}
          </label>
          <input
            id="search-area"
            name="area"
            type="search"
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
            }}
            maxLength={60}
            placeholder={searchBarCopy.areaPlaceholder}
            className="h-[50px] w-full rounded-button border border-mist-200 bg-white px-4 font-sans text-body-m text-ink placeholder:text-mist-500 hover:border-mist-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          />
        </div>
        <div>
          <label
            htmlFor="search-type"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.lookingFor}
          </label>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as MarketplaceType);
            }}
          >
            <SelectTrigger id="search-type">
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
            htmlFor="search-budget"
            className="mb-1.5 block text-label-s font-semibold text-mist-700"
          >
            {searchBarCopy.budget}
          </label>
          <Select
            value={budget}
            onValueChange={(v) => {
              setBudget(v as MarketplaceBudget);
            }}
          >
            <SelectTrigger id="search-budget">
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

        <div className="flex items-end">
          <Button type="submit" variant="accent" className="w-full xl:w-auto" disabled={pending}>
            {searchBarCopy.search}
          </Button>
        </div>
      </div>
    </form>
  );
}
