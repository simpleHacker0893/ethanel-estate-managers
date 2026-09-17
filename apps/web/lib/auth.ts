import 'server-only';

import { auth, currentUser } from '@clerk/nextjs/server';
import { forbidden, redirect } from 'next/navigation';
import { cache } from 'react';

import {
  findActorByClerkId,
  linkClerkUserByEmail,
  organizationBySlug,
  type Actor,
  type ActorMembership,
  type OrganizationSummary,
} from '@ethanel/db';

/**
 * Data Access Layer for authentication and authorization.
 *
 * Clerk answers "who is signed in" (session verified in proxy.ts and here). The database answers
 * "what may they see": a membership row for the organization, a landlord row, a lease row. Every
 * guard reads the request session, so callers sit behind <Suspense> (Cache Components).
 * `redirect()` and `forbidden()` throw; never call them inside try/catch. Under Cache Components
 * a refusal renders app/forbidden.tsx with status 200 (the shell has streamed); see ADR-001.
 */

/** The signed-in person resolved against identity.users, or null when signed out. */
export const getActor = cache(async (): Promise<Actor | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  const actor = await findActorByClerkId(userId);
  if (actor) return actor;

  // First contact: a row seeded by email is linked to this Clerk user once. The lookup needs
  // Clerk's API; if that is unreachable the person is treated as unknown (403), never as staff.
  let email: string | undefined;
  try {
    const user = await currentUser();
    email = user?.primaryEmailAddress?.emailAddress;
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: 'warn',
        event: 'clerk_current_user_failed',
        message: error instanceof Error ? error.message : 'unknown',
      }),
    );
    return null;
  }
  return email ? linkClerkUserByEmail(email, userId) : null;
});

/** Signed in and known to Ethanel, or redirected to sign-in / refused. */
export async function requireActor(): Promise<Actor> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const actor = await getActor();
  if (!actor) forbidden();
  return actor;
}

export type StaffRole = ActorMembership['role'];

export interface OrganizationAccess {
  readonly actor: Actor;
  readonly organization: OrganizationSummary;
  readonly membership: ActorMembership;
}

/**
 * `/org/[orgSlug]` guard. Unknown organization → 404-like forbidden (no enumeration); known
 * organization without a membership → 403; membership without one of `roles` → 403.
 */
export const requireOrganizationAccess = cache(
  async (orgSlug: string, roles?: readonly StaffRole[]): Promise<OrganizationAccess> => {
    const actor = await requireActor();
    const organization = await organizationBySlug(orgSlug);
    if (!organization) forbidden();
    const membership = actor.memberships.find((m) => m.organizationId === organization.id);
    if (!membership) forbidden();
    if (roles && !roles.includes(membership.role)) forbidden();
    return { actor, organization, membership };
  },
);

/** `/landlord` guard: the person must be the landlord of at least one property. */
export async function requireLandlord(): Promise<Actor> {
  const actor = await requireActor();
  if (actor.landlordIds.length === 0) forbidden();
  return actor;
}

/** `/me` guard: the person must be the resident on at least one lease. */
export async function requireResident(): Promise<Actor> {
  const actor = await requireActor();
  if (actor.leaseIds.length === 0) forbidden();
  return actor;
}
