/** Google Maps search URL at a coordinate. Opens the Maps app on phones, the site on desktop. */
export function mapsSearchUrl({ lat, lng }: { lat: number; lng: number }): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lng.toFixed(5)}`;
}
