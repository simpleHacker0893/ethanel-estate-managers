import { z } from 'zod';

import { kenyanPhoneSchema } from './phone';

/**
 * Book-a-demo questionnaire. Written like a business analyst's discovery call: who you are,
 * what you manage, what hurts today, what you need, how to reach you.
 */
export const organizationTypes = [
  'letting-firm',
  'land-selling-company',
  'landlord',
  'other',
] as const;
export const portfolioSizes = ['1-5', '6-20', '21-50', '51-150', '151-300', '301-plus'] as const;
export const questionnaireCounties = [
  'nairobi',
  'kiambu',
  'kajiado',
  'machakos',
  'mombasa',
  'nakuru',
  'kisumu',
  'uasin-gishu',
  'other',
] as const;
export const currentTools = ['spreadsheet', 'paper', 'other-software', 'none'] as const;
export const painPoints = [
  'arrears',
  'mpesa-reconciliation',
  'landlord-statements',
  'repairs',
  'vacancies',
  'caretaker-coordination',
  'deposits-and-site-visits',
  'other',
] as const;
export const featuresWanted = [
  'rent-collection',
  'landlord-statements',
  'repairs-work-orders',
  'whatsapp-channel',
  'marketplace-listings',
  'reports-exports',
  'public-api',
] as const;
export const mpesaSetups = ['own-paybill', 'own-till', 'none', 'unsure'] as const;
export const whatsappBusinessOptions = ['yes', 'no', 'unsure'] as const;
export const timelines = ['this-month', 'this-quarter', 'later-this-year', 'exploring'] as const;
export const preferredChannels = ['whatsapp', 'email', 'call'] as const;

export const demoQuestionnaireSchema = z
  .object({
    organizationType: z.enum(organizationTypes, { error: 'Pick the closest description' }),
    organizationTypeOther: z.string().trim().max(80).optional(),
    portfolioSize: z.enum(portfolioSizes, { error: 'Pick a size band' }),
    counties: z.array(z.enum(questionnaireCounties)).min(1, 'Pick at least one county').max(9),
    currentTools: z.array(z.enum(currentTools)).min(1, 'Pick at least one'),
    otherSoftwareName: z.string().trim().max(80).optional(),
    painPoints: z.array(z.enum(painPoints)).min(1, 'Pick at least one').max(4, 'Pick up to four'),
    painPointsOther: z.string().trim().max(200).optional(),
    featuresWanted: z.array(z.enum(featuresWanted)).max(7),
    mpesaSetup: z.enum(mpesaSetups, { error: 'Pick one' }),
    whatsappBusiness: z.enum(whatsappBusinessOptions, { error: 'Pick one' }),
    timeline: z.enum(timelines, { error: 'Pick one' }),
    contact: z.object({
      name: z.string().trim().min(2, 'Enter your name').max(80),
      role: z.string().trim().max(80).optional(),
      organization: z.string().trim().min(2, 'Enter your organization').max(120),
      email: z
        .string()
        .trim()
        .min(1, 'Enter your work email')
        .max(254)
        .pipe(z.email('Enter a valid email address'))
        .transform((v) => v.toLowerCase()),
      whatsapp: kenyanPhoneSchema,
      preferredChannel: z.enum(preferredChannels).default('whatsapp'),
    }),
    consent: z.literal(true, { error: 'We need your consent to contact you' }),
    /** Optional attribution, e.g. the pricing tier the visitor came from. */
    tier: z.enum(['free', 'starter', 'growth', 'enterprise']).optional(),
    source: z.literal('demo').default('demo'),
  })
  .superRefine((value, ctx) => {
    if (value.organizationType === 'other' && !value.organizationTypeOther) {
      ctx.addIssue({
        code: 'custom',
        path: ['organizationTypeOther'],
        message: 'Tell us what you do',
      });
    }
    if (value.currentTools.includes('other-software') && !value.otherSoftwareName) {
      ctx.addIssue({ code: 'custom', path: ['otherSoftwareName'], message: 'Which software?' });
    }
    if (value.painPoints.includes('other') && !value.painPointsOther) {
      ctx.addIssue({ code: 'custom', path: ['painPointsOther'], message: 'Tell us what hurts' });
    }
  });

export type DemoQuestionnaireInput = z.input<typeof demoQuestionnaireSchema>;
export type DemoQuestionnaire = z.output<typeof demoQuestionnaireSchema>;

export type DemoQuestionnaireResult =
  { ok: true } | { ok: false; error: 'invalid' | 'rate_limited' | 'unavailable'; message: string };

/** Step → fields, so the client validates one step at a time with react-hook-form's trigger(). */
export const demoQuestionnaireSteps = [
  {
    id: 'organization',
    fields: ['organizationType', 'organizationTypeOther', 'portfolioSize', 'counties'],
  },
  { id: 'today', fields: ['currentTools', 'otherSoftwareName', 'painPoints', 'painPointsOther'] },
  { id: 'needs', fields: ['featuresWanted', 'mpesaSetup', 'whatsappBusiness', 'timeline'] },
  {
    id: 'contact',
    fields: [
      'contact.name',
      'contact.role',
      'contact.organization',
      'contact.email',
      'contact.whatsapp',
      'contact.preferredChannel',
      'consent',
    ],
  },
] as const;
export type DemoQuestionnaireStepId = (typeof demoQuestionnaireSteps)[number]['id'];
