/**
 * Primary keys are UUIDv7, generated in application code, never by the database.
 * UUIDv7 is time-ordered so B-tree inserts stay append-mostly and rows sort by creation.
 *
 * Implementation note (Sprint 002): use `crypto.randomUUID` only for v4 needs; v7 comes from
 * a tiny in-house encoder over `crypto.getRandomValues` + `Date.now()` to avoid a dependency.
 */
export type Uuid = string & { readonly __brand: 'Uuid' };

export function newId(): Uuid {
  throw new NotImplementedError('chassis/ids.newId');
}

export function isUuid(value: unknown): value is Uuid {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

export class NotImplementedError extends Error {
  override readonly name = 'NotImplementedError';
  constructor(surface: string) {
    super(`${surface} is stubbed in Sprint 001 and implemented in Sprint 002.`);
  }
}
