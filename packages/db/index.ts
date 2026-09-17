/**
 * @ethanel/db — conventions and tooling for schema-per-service on one Neon project.
 * Sprint 001: conventions documented in README.md; no schema, no client.
 * Sprint 002: `identity` schema, migration runner, RLS policy template, seed fixtures.
 */
export const SCHEMA_PER_SERVICE = [
  'identity',
  'property',
  'listing',
  'money',
  'payments',
  'messaging',
  'ops',
  'docs',
  'billing',
] as const;

export type ServiceSchema = (typeof SCHEMA_PER_SERVICE)[number];
