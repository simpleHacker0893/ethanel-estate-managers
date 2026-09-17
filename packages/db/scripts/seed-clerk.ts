import 'dotenv/config';

import { createClerkClient } from '@clerk/backend';

import { createDb } from '../client';
import { DEMO_PASSWORD, demoMemberships, demoOrganizations, demoUsers } from '../fixtures';

/**
 * Creates the demo accounts in Clerk and links them to the seeded database rows.
 *
 *   CLERK_SECRET_KEY=sk_… DATABASE_URL=postgres://… pnpm --filter @ethanel/db seed:clerk
 *
 * Idempotent: existing users are found by email and their password reset to the demo one;
 * existing organizations are found by slug; memberships are created or their role corrected.
 * Requires, in the Clerk dashboard: Email + Password sign-in enabled, and Organizations enabled.
 * Run `pnpm --filter @ethanel/db seed` first so the rows to link exist.
 */
async function main(): Promise<void> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  if (!secretKey) throw new Error('CLERK_SECRET_KEY is not set');
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  const clerk = createClerkClient({ secretKey });
  const db = createDb(databaseUrl);
  const clerkUserIdByFixtureId = new Map<string, string>();

  for (const demo of demoUsers) {
    const existing = await clerk.users.getUserList({ emailAddress: [demo.email], limit: 1 });
    const publicMetadata = { persona: demo.persona, demo: true };
    const user =
      existing.data[0] ??
      (await clerk.users.createUser({
        emailAddress: [demo.email],
        password: DEMO_PASSWORD,
        firstName: demo.firstName,
        lastName: demo.lastName,
        skipPasswordChecks: true,
        publicMetadata,
      }));
    if (existing.data[0]) {
      await clerk.users.updateUser(user.id, {
        password: DEMO_PASSWORD,
        skipPasswordChecks: true,
        publicMetadata,
      });
    }
    clerkUserIdByFixtureId.set(demo.id, user.id);
    await db.user.update({ where: { email: demo.email }, data: { clerkUserId: user.id } });
    console.warn(
      JSON.stringify({
        level: 'info',
        event: 'clerk_user',
        persona: demo.persona,
        clerkUserId: user.id,
      }),
    );
  }

  for (const demoOrganization of demoOrganizations) {
    const owner = demoMemberships.find(
      (m) => m.organizationId === demoOrganization.id && m.role === 'owner',
    );
    const createdBy = owner ? clerkUserIdByFixtureId.get(owner.userId) : undefined;
    if (!createdBy) throw new Error(`No owner for ${demoOrganization.slug}`);

    let organization;
    try {
      organization = await clerk.organizations.getOrganization({ slug: demoOrganization.slug });
    } catch {
      organization = await clerk.organizations.createOrganization({
        name: demoOrganization.name,
        slug: demoOrganization.slug,
        createdBy,
        publicMetadata: { kind: demoOrganization.kind, demo: true },
      });
    }
    await db.organization.update({
      where: { slug: demoOrganization.slug },
      data: { clerkOrganizationId: organization.id },
    });

    const current = await clerk.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
      limit: 100,
    });
    for (const membership of demoMemberships.filter(
      (m) => m.organizationId === demoOrganization.id,
    )) {
      const userId = clerkUserIdByFixtureId.get(membership.userId);
      if (!userId) continue;
      const found = current.data.find((m) => m.publicUserData?.userId === userId);
      if (!found) {
        await clerk.organizations.createOrganizationMembership({
          organizationId: organization.id,
          userId,
          role: membership.clerkRole,
        });
      } else if (found.role !== membership.clerkRole) {
        await clerk.organizations.updateOrganizationMembership({
          organizationId: organization.id,
          userId,
          role: membership.clerkRole,
        });
      }
    }
    console.warn(
      JSON.stringify({
        level: 'info',
        event: 'clerk_organization',
        slug: demoOrganization.slug,
        clerkOrganizationId: organization.id,
      }),
    );
  }

  await db.$disconnect();
  console.warn(
    JSON.stringify({
      level: 'info',
      event: 'clerk_seed_done',
      users: demoUsers.length,
      organizations: demoOrganizations.length,
      password: DEMO_PASSWORD,
    }),
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
