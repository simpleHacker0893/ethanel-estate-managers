'use client';

import { CheckIcon } from 'lucide-react';
import { useActionState, useId } from 'react';

import type { DemoRequestResult } from '@ethanel/contracts/demo-request';
import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { requestDemo } from '@/app/(marketing)/actions/request-demo';

/** Client: useActionState around the Server Action. Success replaces the form with the thanks line. */
export function DemoForm({
  emailLabel,
  emailPlaceholder,
  submitLabel,
  successMessage,
}: {
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  successMessage: string;
}) {
  const [state, action, pending] = useActionState<DemoRequestResult | null, FormData>(
    requestDemo,
    null,
  );
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hasError = state !== null && !state.ok;

  if (state?.ok) {
    return (
      <p
        role="status"
        className="inline-flex items-center gap-3 rounded-card border border-navy-800 bg-navy-900 px-5 py-4 text-body-m font-semibold text-frost"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-teal text-white">
          <CheckIcon className="size-4" aria-hidden="true" strokeWidth={2.5} />
        </span>
        {successMessage}
      </p>
    );
  }

  return (
    <form action={action} aria-busy={pending} noValidate className="w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={inputId} className="sr-only">
            {emailLabel}
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder={emailPlaceholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className={cn(
              'h-[50px] w-full rounded-button border bg-navy-900 px-4 font-sans text-body-m text-frost placeholder:text-lavender-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500',
              hasError ? 'border-coral' : 'border-navy-800',
            )}
          />
        </div>
        <Button type="submit" variant="accent" disabled={pending} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
      <p
        id={errorId}
        aria-live="polite"
        className={cn('mt-2 min-h-5 text-body-s text-coral', !hasError && 'sr-only')}
      >
        {hasError ? state.message : ''}
      </p>
    </form>
  );
}
