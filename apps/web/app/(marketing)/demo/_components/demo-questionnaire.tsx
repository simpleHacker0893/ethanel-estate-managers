'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useForm, useWatch, type FieldPath } from 'react-hook-form';

import {
  demoQuestionnaireSchema,
  demoQuestionnaireSteps,
  type DemoQuestionnaire as DemoQuestionnaireOutput,
  type DemoQuestionnaireInput,
  type DemoQuestionnaireResult,
} from '@ethanel/contracts/demo-questionnaire';
import { Button } from '@ethanel/ui/components/button';
import { cn } from '@ethanel/ui/lib/cn';

import { submitDemoQuestionnaire } from '@/app/(marketing)/actions/submit-demo-questionnaire';
import { demo } from '@/content/demo';

const input =
  'h-[50px] w-full rounded-button border bg-white px-4 font-sans text-body-m text-ink placeholder:text-mist-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500';

function Choice({
  name,
  value,
  label,
  type,
  register,
}: {
  name: FieldPath<DemoQuestionnaireInput>;
  value: string;
  label: string;
  type: 'radio' | 'checkbox';
  register: ReturnType<typeof useForm<DemoQuestionnaireInput>>['register'];
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[10px] border border-mist-200 bg-white px-3.5 py-2.5 text-body-s text-ink has-[:checked]:border-iris-700 has-[:checked]:bg-iris-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pink-500">
      <input type={type} value={value} className="size-4 accent-iris-700" {...register(name)} />
      {label}
    </label>
  );
}

/** Always occupies its line so a clearing error never shifts the control the pointer is on. */
function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} aria-live="polite" className="mt-1.5 min-h-5 text-body-s text-coral">
      {message ?? ''}
    </p>
  );
}

const tiers = ['free', 'starter', 'growth', 'enterprise'] as const;

/**
 * Client: react-hook-form + the contract schema. One step at a time, each validated with
 * trigger(step.fields) before advancing; values persist across steps; the final submit calls
 * the Server Action inside a transition.
 */
export function DemoQuestionnaire({ whatsappHref }: { whatsappHref: string }) {
  const params = useSearchParams();
  const tierParam = params.get('tier');
  const tier = (tiers as readonly string[]).includes(tierParam ?? '')
    ? (tierParam as (typeof tiers)[number])
    : undefined;

  const form = useForm<DemoQuestionnaireInput, unknown, DemoQuestionnaireOutput>({
    resolver: zodResolver(demoQuestionnaireSchema),
    mode: 'onTouched',
    defaultValues: {
      organizationTypeOther: '',
      counties: [],
      currentTools: [],
      otherSoftwareName: '',
      painPoints: [],
      painPointsOther: '',
      featuresWanted: [],
      contact: {
        name: '',
        role: '',
        organization: '',
        email: '',
        whatsapp: '',
        preferredChannel: 'whatsapp',
      },
      ...(tier ? { tier } : {}),
      source: 'demo',
    },
  });
  const { register: registerField, handleSubmit, trigger, control, formState } = form;
  /** Choice inputs re-validate on change once they carry an error, so a fixed answer clears at once. */
  const register: typeof registerField = (name, options) =>
    registerField(name, {
      ...options,
      onChange: () => {
        if (formState.errors[name.split('.')[0] as keyof typeof formState.errors])
          void trigger(name);
      },
    });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<DemoQuestionnaireResult | null>(null);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const orgType = useWatch({ control, name: 'organizationType' });
  const tools = useWatch({ control, name: 'currentTools' });
  const pains = useWatch({ control, name: 'painPoints' });
  const id = useId();

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const current = demoQuestionnaireSteps[step] ?? demoQuestionnaireSteps[0];
  const total = demoQuestionnaireSteps.length;
  const errors = formState.errors;

  async function next() {
    const ok = await trigger([...current.fields] as FieldPath<DemoQuestionnaireInput>[], {
      shouldFocus: true,
    });
    if (ok) setStep((s) => Math.min(s + 1, total - 1));
  }

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await submitDemoQuestionnaire(values);
      setResult(res);
    });
  });

  if (result?.ok) {
    return (
      <div role="status" className="flex flex-col gap-4">
        <p className="inline-flex items-center gap-3 font-sans text-[20px] leading-7 font-bold text-ink">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-teal text-white">
            <CheckIcon className="size-4" aria-hidden="true" strokeWidth={2.5} />
          </span>
          {demo.success.title}
        </p>
        <p className="text-body-m text-mist-700">{demo.success.body}</p>
        <Button asChild variant="secondary" className="w-fit">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp us now
          </a>
        </Button>
      </div>
    );
  }

  const stepCopy = demo.steps[current.id];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < total - 1) void next();
        else void onSubmit(e);
      }}
      aria-busy={pending}
      noValidate
    >
      <ol aria-label={demo.progressLabel} className="flex gap-2">
        {demoQuestionnaireSteps.map((s, i) => (
          <li
            key={s.id}
            aria-current={i === step ? 'step' : undefined}
            className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-iris-700' : 'bg-mist-200')}
          >
            <span className="sr-only">
              {demo.steps[s.id].title}
              {i < step ? ' (done)' : i === step ? ' (current)' : ''}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-label-s font-semibold text-mist-500 kes">
        Step {step + 1} of {total}
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 font-display text-[28px] leading-8 font-semibold text-ink outline-none"
      >
        {stepCopy.title}
      </h2>
      <p className="mt-1 text-body-m text-mist-700">{stepCopy.lede}</p>

      <div className="mt-6 flex flex-col gap-6">
        {current.id === 'organization' ? (
          <>
            <fieldset aria-describedby={`${id}-orgtype-err`}>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.organization.organizationType}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {demo.options.organizationType.map((o) => (
                  <Choice
                    key={o.value}
                    name="organizationType"
                    value={o.value}
                    label={o.label}
                    type="radio"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-orgtype-err`}
                {...(errors.organizationType?.message
                  ? { message: errors.organizationType.message }
                  : {})}
              />
            </fieldset>
            {orgType === 'other' ? (
              <div>
                <label
                  htmlFor={`${id}-orgother`}
                  className="mb-1.5 block text-label-m font-semibold text-ink"
                >
                  {demo.steps.organization.organizationTypeOther}
                </label>
                <input
                  id={`${id}-orgother`}
                  className={cn(
                    input,
                    errors.organizationTypeOther ? 'border-coral' : 'border-mist-200',
                  )}
                  {...register('organizationTypeOther')}
                />
                <FieldError
                  id={`${id}-orgother-err`}
                  {...(errors.organizationTypeOther?.message
                    ? { message: errors.organizationTypeOther.message }
                    : {})}
                />
              </div>
            ) : null}
            <fieldset>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.organization.portfolioSize}
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {demo.options.portfolioSize.map((o) => (
                  <Choice
                    key={o.value}
                    name="portfolioSize"
                    value={o.value}
                    label={o.label}
                    type="radio"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-size-err`}
                {...(errors.portfolioSize?.message
                  ? { message: errors.portfolioSize.message }
                  : {})}
              />
            </fieldset>
            <fieldset>
              <legend className="mb-1 text-label-m font-semibold text-ink">
                {demo.steps.organization.counties}
              </legend>
              <p className="mb-2 text-body-s text-mist-500">
                {demo.steps.organization.countiesHint}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {demo.options.counties.map((o) => (
                  <Choice
                    key={o.value}
                    name="counties"
                    value={o.value}
                    label={o.label}
                    type="checkbox"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-counties-err`}
                {...(errors.counties?.message ? { message: errors.counties.message } : {})}
              />
            </fieldset>
          </>
        ) : null}

        {current.id === 'today' ? (
          <>
            <fieldset>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.today.currentTools}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {demo.options.currentTools.map((o) => (
                  <Choice
                    key={o.value}
                    name="currentTools"
                    value={o.value}
                    label={o.label}
                    type="checkbox"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-tools-err`}
                {...(errors.currentTools?.message ? { message: errors.currentTools.message } : {})}
              />
            </fieldset>
            {tools.includes('other-software') ? (
              <div>
                <label
                  htmlFor={`${id}-software`}
                  className="mb-1.5 block text-label-m font-semibold text-ink"
                >
                  {demo.steps.today.otherSoftwareName}
                </label>
                <input
                  id={`${id}-software`}
                  className={cn(
                    input,
                    errors.otherSoftwareName ? 'border-coral' : 'border-mist-200',
                  )}
                  {...register('otherSoftwareName')}
                />
                <FieldError
                  id={`${id}-software-err`}
                  {...(errors.otherSoftwareName?.message
                    ? { message: errors.otherSoftwareName.message }
                    : {})}
                />
              </div>
            ) : null}
            <fieldset>
              <legend className="mb-1 text-label-m font-semibold text-ink">
                {demo.steps.today.painPoints}
              </legend>
              <p className="mb-2 text-body-s text-mist-500">{demo.steps.today.painPointsHint}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {demo.options.painPoints.map((o) => (
                  <Choice
                    key={o.value}
                    name="painPoints"
                    value={o.value}
                    label={o.label}
                    type="checkbox"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-pains-err`}
                {...(errors.painPoints?.message ? { message: errors.painPoints.message } : {})}
              />
            </fieldset>
            {pains.includes('other') ? (
              <div>
                <label
                  htmlFor={`${id}-painother`}
                  className="mb-1.5 block text-label-m font-semibold text-ink"
                >
                  {demo.steps.today.painPointsOther}
                </label>
                <input
                  id={`${id}-painother`}
                  className={cn(input, errors.painPointsOther ? 'border-coral' : 'border-mist-200')}
                  {...register('painPointsOther')}
                />
                <FieldError
                  id={`${id}-painother-err`}
                  {...(errors.painPointsOther?.message
                    ? { message: errors.painPointsOther.message }
                    : {})}
                />
              </div>
            ) : null}
          </>
        ) : null}

        {current.id === 'needs' ? (
          <>
            <fieldset>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.needs.featuresWanted}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {demo.options.featuresWanted.map((o) => (
                  <Choice
                    key={o.value}
                    name="featuresWanted"
                    value={o.value}
                    label={o.label}
                    type="checkbox"
                    register={register}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.needs.mpesaSetup}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {demo.options.mpesaSetup.map((o) => (
                  <Choice
                    key={o.value}
                    name="mpesaSetup"
                    value={o.value}
                    label={o.label}
                    type="radio"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-mpesa-err`}
                {...(errors.mpesaSetup?.message ? { message: errors.mpesaSetup.message } : {})}
              />
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.needs.whatsappBusiness}
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {demo.options.whatsappBusiness.map((o) => (
                  <Choice
                    key={o.value}
                    name="whatsappBusiness"
                    value={o.value}
                    label={o.label}
                    type="radio"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-wab-err`}
                {...(errors.whatsappBusiness?.message
                  ? { message: errors.whatsappBusiness.message }
                  : {})}
              />
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-label-m font-semibold text-ink">
                {demo.steps.needs.timeline}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {demo.options.timeline.map((o) => (
                  <Choice
                    key={o.value}
                    name="timeline"
                    value={o.value}
                    label={o.label}
                    type="radio"
                    register={register}
                  />
                ))}
              </div>
              <FieldError
                id={`${id}-timeline-err`}
                {...(errors.timeline?.message ? { message: errors.timeline.message } : {})}
              />
            </fieldset>
          </>
        ) : null}

        {current.id === 'contact' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${id}-name`}
                className="mb-1.5 block text-label-s font-semibold text-mist-700"
              >
                {demo.steps.contact.name}
              </label>
              <input
                id={`${id}-name`}
                autoComplete="name"
                className={cn(input, errors.contact?.name ? 'border-coral' : 'border-mist-200')}
                {...register('contact.name')}
              />
              <FieldError
                id={`${id}-name-err`}
                {...(errors.contact?.name?.message ? { message: errors.contact.name.message } : {})}
              />
            </div>
            <div>
              <label
                htmlFor={`${id}-role`}
                className="mb-1.5 block text-label-s font-semibold text-mist-700"
              >
                {demo.steps.contact.role}
              </label>
              <input
                id={`${id}-role`}
                autoComplete="organization-title"
                className={cn(input, 'border-mist-200')}
                {...register('contact.role')}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`${id}-org`}
                className="mb-1.5 block text-label-s font-semibold text-mist-700"
              >
                {demo.steps.contact.organization}
              </label>
              <input
                id={`${id}-org`}
                autoComplete="organization"
                className={cn(
                  input,
                  errors.contact?.organization ? 'border-coral' : 'border-mist-200',
                )}
                {...register('contact.organization')}
              />
              <FieldError
                id={`${id}-org-err`}
                {...(errors.contact?.organization?.message
                  ? { message: errors.contact.organization.message }
                  : {})}
              />
            </div>
            <div>
              <label
                htmlFor={`${id}-email`}
                className="mb-1.5 block text-label-s font-semibold text-mist-700"
              >
                {demo.steps.contact.email}
              </label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                inputMode="email"
                className={cn(input, errors.contact?.email ? 'border-coral' : 'border-mist-200')}
                {...register('contact.email')}
              />
              <FieldError
                id={`${id}-email-err`}
                {...(errors.contact?.email?.message
                  ? { message: errors.contact.email.message }
                  : {})}
              />
            </div>
            <div>
              <label
                htmlFor={`${id}-wa`}
                className="mb-1.5 block text-label-s font-semibold text-mist-700"
              >
                {demo.steps.contact.whatsapp}
              </label>
              <input
                id={`${id}-wa`}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="0722 000 000"
                className={cn(input, errors.contact?.whatsapp ? 'border-coral' : 'border-mist-200')}
                {...register('contact.whatsapp')}
              />
              <FieldError
                id={`${id}-wa-err`}
                {...(errors.contact?.whatsapp?.message
                  ? { message: errors.contact.whatsapp.message }
                  : {})}
              />
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-label-s font-semibold text-mist-700">
                {demo.steps.contact.preferredChannel}
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {demo.options.preferredChannel.map((o) => (
                  <Choice
                    key={o.value}
                    name="contact.preferredChannel"
                    value={o.value}
                    label={o.label}
                    type="radio"
                    register={register}
                  />
                ))}
              </div>
            </fieldset>
            <div className="sm:col-span-2">
              <label className="flex min-h-11 items-start gap-3 text-body-s text-ink">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-iris-700"
                  {...register('consent')}
                />
                {demo.steps.contact.consent}
              </label>
              <FieldError
                id={`${id}-consent-err`}
                {...(errors.consent?.message ? { message: errors.consent.message } : {})}
              />
            </div>
          </div>
        ) : null}
      </div>

      {result && !result.ok ? (
        <p
          role="alert"
          className="mt-6 rounded-card border border-coral bg-white px-4 py-3 text-body-s text-coral"
        >
          {result.message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setStep((s) => Math.max(0, s - 1));
            }}
          >
            {demo.back}
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="submit"
          variant={step === total - 1 ? 'accent' : 'primary'}
          disabled={pending}
        >
          {step === total - 1 ? (pending ? demo.submitting : demo.submit) : demo.next}
        </Button>
      </div>
    </form>
  );
}
