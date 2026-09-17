/**
 * KES formatting for bigint minor units (cents). Whole shillings with thousands separators;
 * cents only when they are not zero. This file may not use `number` (see eslint money rule).
 */
export function formatKes(minor: bigint): string {
  const negative = minor < 0n;
  const absolute = negative ? -minor : minor;
  const shillings = (absolute / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const cents = absolute % 100n;
  const fraction = cents === 0n ? '' : `.${cents.toString().padStart(2, '0')}`;
  return `${negative ? '-' : ''}KES ${shillings}${fraction}`;
}

/** Whole percent of `part` over `whole`, as a string, without floating point. */
export function percentOf(part: bigint, whole: bigint): string {
  if (whole <= 0n) return '0';
  return ((part * 100n) / whole).toString();
}
