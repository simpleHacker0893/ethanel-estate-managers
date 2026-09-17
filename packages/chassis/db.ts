import { NotImplementedError } from './ids';

/**
 * Prisma base client with the RLS hook.
 * Every transaction runs `SET LOCAL app.organization_id = $1` before any query; row-level security
 * policies on every tenant table compare against `current_setting('app.organization_id')`.
 * A query outside `withOrganization` sees zero tenant rows by construction.
 */
export interface TenantScope {
  readonly organizationId: string;
}

export function withOrganization<T>(
  _scope: TenantScope,
  _fn: (tx: unknown) => Promise<T>,
): Promise<T> {
  throw new NotImplementedError('chassis/db.withOrganization');
}
