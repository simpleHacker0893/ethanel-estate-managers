/**
 * Analytics stub. Marketing events are recorded server-side later (gateway → billing-svc).
 * Nothing runs in the browser yet; this keeps call sites stable.
 */
export type AnalyticsEvent =
  { name: 'demo_requested'; source: 'landing' } | { name: 'marketplace_search'; intent: string };

export function track(_event: AnalyticsEvent): void {
  // no-op in Sprint 001
}
