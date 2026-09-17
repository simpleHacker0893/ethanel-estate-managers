import { z } from 'zod';

/**
 * Kenyan mobile numbers, normalised to E.164 (+2547XXXXXXXX / +2541XXXXXXXX).
 * Accepts 07XX XXX XXX, 01XX…, 2547…, +2547…, with spaces, dashes or dots.
 */
export const kenyanPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Enter a WhatsApp number')
  .transform((raw) => raw.replace(/[\s().-]/g, ''))
  .transform((digits) => {
    if (/^0[17]\d{8}$/.test(digits)) return `+254${digits.slice(1)}`;
    if (/^254[17]\d{8}$/.test(digits)) return `+${digits}`;
    return digits;
  })
  .pipe(z.string().regex(/^\+254[17]\d{8}$/, 'Enter a Kenyan mobile number, e.g. 0722 000 000'));

export type KenyanPhone = z.output<typeof kenyanPhoneSchema>;
