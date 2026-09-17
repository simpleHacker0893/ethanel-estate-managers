'use client';

import { CheckIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState, useId } from 'react';

import { contactInterests, type ContactRequestResult } from '@ethanel/contracts/contact-request';
import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { submitContact } from '@/app/(marketing)/actions/contact';
import { company } from '@/content/company';

const c = company.contact.form;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-label-s font-semibold text-mist-700">
        {label}
      </label>
      {children}
      <p
        id={`${id}-error`}
        aria-live="polite"
        className={cn('mt-1 text-body-s text-coral', !error && 'sr-only')}
      >
        {error ?? ''}
      </p>
    </div>
  );
}

const input =
  'h-[50px] w-full rounded-button border bg-white px-4 font-sans text-body-m text-ink placeholder:text-mist-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500';

/** Client: useActionState around the contact Server Action. Prefills interest from ?interest=. */
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactRequestResult | null, FormData>(
    submitContact,
    null,
  );
  const params = useSearchParams();
  const requested = params.get('interest');
  const initialInterest = (contactInterests as readonly string[]).includes(requested ?? '')
    ? (requested as (typeof contactInterests)[number])
    : 'demo';
  const id = useId();
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const border = (key: string) => (errors[key] ? 'border-coral' : 'border-mist-200');

  if (state?.ok) {
    return (
      <p
        role="status"
        className="inline-flex items-center gap-3 rounded-card border border-teal-200 bg-teal-100 px-5 py-4 text-body-m font-semibold text-ink"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-teal text-white">
          <CheckIcon className="size-4" aria-hidden="true" strokeWidth={2.5} />
        </span>
        {c.success}
      </p>
    );
  }

  return (
    <form action={action} aria-busy={pending} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field id={`${id}-name`} label={c.name} {...(errors.name ? { error: errors.name } : {})}>
        <input
          id={`${id}-name`}
          name="name"
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={`${id}-name-error`}
          className={cn(input, border('name'))}
        />
      </Field>
      <Field
        id={`${id}-organization`}
        label={c.organization}
        {...(errors.organization ? { error: errors.organization } : {})}
      >
        <input
          id={`${id}-organization`}
          name="organization"
          autoComplete="organization"
          className={cn(input, border('organization'))}
        />
      </Field>
      <Field
        id={`${id}-whatsapp`}
        label={c.whatsapp}
        {...(errors.whatsapp ? { error: errors.whatsapp } : {})}
      >
        <input
          id={`${id}-whatsapp`}
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="0722 000 000"
          aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={`${id}-whatsapp-error`}
          className={cn(input, border('whatsapp'))}
        />
      </Field>
      <Field id={`${id}-units`} label={c.units} {...(errors.units ? { error: errors.units } : {})}>
        <select
          id={`${id}-units`}
          name="units"
          required
          defaultValue=""
          aria-invalid={Boolean(errors.units)}
          aria-describedby={`${id}-units-error`}
          className={cn(input, border('units'))}
        >
          <option value="" disabled>
            Pick one
          </option>
          {c.unitOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field
          id={`${id}-interest`}
          label={c.interest}
          {...(errors.interest ? { error: errors.interest } : {})}
        >
          <select
            id={`${id}-interest`}
            name="interest"
            required
            defaultValue={initialInterest}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={`${id}-interest-error`}
            className={cn(input, border('interest'))}
          >
            {c.interestOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field
          id={`${id}-message`}
          label={c.message}
          {...(errors.message ? { error: errors.message } : {})}
        >
          <textarea
            id={`${id}-message`}
            name="message"
            required
            rows={4}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={`${id}-message-error`}
            className={cn(input, 'h-auto py-3', border('message'))}
          />
        </Field>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-s text-mist-500">{c.note}</p>
        <Button type="submit" variant="primary" disabled={pending} className="w-full sm:w-auto">
          {c.submit}
        </Button>
      </div>
      {state && !state.ok && state.error !== 'invalid' ? (
        <p role="alert" className="text-body-s text-coral sm:col-span-2">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
