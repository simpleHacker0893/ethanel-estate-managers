import { NotImplementedError } from './ids';

/**
 * Service-to-service auth: short-lived HS256/EdDSA JWTs minted by the caller with
 * `sub=<service>`, `aud=<callee>`, `organization_id` claim carried from the originating request.
 */
export interface InternalClaims {
  readonly sub: string;
  readonly aud: string;
  readonly organizationId?: string;
  readonly exp: number;
}

export function signInternal(_claims: Omit<InternalClaims, 'exp'>): Promise<string> {
  throw new NotImplementedError('chassis/internal-jwt.signInternal');
}

export function verifyInternal(_token: string, _audience: string): Promise<InternalClaims> {
  throw new NotImplementedError('chassis/internal-jwt.verifyInternal');
}
