import type { Db } from './client';
import type { PrismaClient } from './prisma/generated/client';

/**
 * Transaction-local tenancy scope. Every tenant table's RLS policy compares against these
 * settings; a transaction that sets none of them sees zero tenant rows by construction.
 */
export interface Scope {
  /** identity.organizations.id the caller acts inside (staff, caretakers, seeds). */
  readonly organizationId?: string;
  /** identity.users.id of the caller; unlocks their own memberships, landlord and lease rows. */
  readonly userId?: string;
  /** property.landlords.id rows the caller may read as a landlord. */
  readonly landlordIds?: readonly string[];
  /** property.leases.id rows the caller may read as a resident. */
  readonly leaseIds?: readonly string[];
  /** property.units.id rows the caller may read as a resident (the units of their leases). */
  readonly unitIds?: readonly string[];
  /** property.properties.id rows the caller may read as a resident. */
  readonly propertyIds?: readonly string[];
}

/** The client handed to the callback: a Prisma transaction with the scope already applied. */
export type ScopedTx = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertUuid(value: string, name: string): string {
  if (!UUID.test(value)) throw new Error(`withScope: ${name} is not a UUID`);
  return value.toLowerCase();
}

function csv(ids: readonly string[] | undefined, name: string): string {
  return (ids ?? []).map((id) => assertUuid(id, name)).join(',');
}

/**
 * Runs `fn` inside one transaction with `SET LOCAL`-equivalent settings applied first
 * (`set_config(..., true)` is transaction-local, so it is safe over the pooled endpoint).
 */
export async function withScope<T>(
  client: Db,
  scope: Scope,
  fn: (tx: ScopedTx) => Promise<T>,
): Promise<T> {
  const organizationId = scope.organizationId
    ? assertUuid(scope.organizationId, 'organizationId')
    : '';
  const userId = scope.userId ? assertUuid(scope.userId, 'userId') : '';
  const landlordIds = csv(scope.landlordIds, 'landlordIds');
  const leaseIds = csv(scope.leaseIds, 'leaseIds');
  const unitIds = csv(scope.unitIds, 'unitIds');
  const propertyIds = csv(scope.propertyIds, 'propertyIds');

  return client.$transaction(async (tx) => {
    await tx.$executeRaw`
      SELECT set_config('app.organization_id', ${organizationId}, true),
             set_config('app.user_id', ${userId}, true),
             set_config('app.landlord_ids', ${landlordIds}, true),
             set_config('app.lease_ids', ${leaseIds}, true),
             set_config('app.unit_ids', ${unitIds}, true),
             set_config('app.property_ids', ${propertyIds}, true)
    `;
    return fn(tx);
  });
}
