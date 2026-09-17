import { publicEnv } from '@/lib/env';

/**
 * Display string and wa.me link for the public WhatsApp number (+254722000000 unless
 * NEXT_PUBLIC_WHATSAPP_NUMBER overrides it). `message` is prefilled in the chat composer;
 * wa.me opens the WhatsApp app on phones and WhatsApp Web on desktop.
 */
export function whatsappContact(message?: string): { display: string; href: string } {
  const digits = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, '');
  const display = `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return { display, href: `https://wa.me/${digits}${query}` };
}
