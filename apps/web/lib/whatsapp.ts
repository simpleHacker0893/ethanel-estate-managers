import { publicEnv } from '@/lib/env';
import { site } from '@/content/site';

/** Display string and wa.me link for the public WhatsApp number, or a visible placeholder. */
export function whatsappContact(): { display: string; href: string | null } {
  const number = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return { display: site.whatsappPlaceholder, href: null };
  const digits = number.replace(/\D/g, '');
  const display = `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  return { display, href: `https://wa.me/${digits}` };
}
