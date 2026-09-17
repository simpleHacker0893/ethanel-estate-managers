import { db, type Db } from './client';
import type { MembershipRole, OrganizationKind } from './prisma/generated/client';
import { withScope } from './scope';

/**
 * Data-access layer. Everything the web BFF reads goes through here, inside an RLS scope, and
 * returns narrow plain objects (no Prisma models, no relations) so route code never touches the
 * client. Money stays bigint minor units all the way to the formatter.
 */

export interface ActorMembership {
  readonly organizationId: string;
  readonly slug: string;
  readonly name: string;
  readonly kind: OrganizationKind;
  readonly role: MembershipRole;
}

export interface Actor {
  readonly userId: string;
  readonly clerkUserId: string;
  readonly email: string;
  readonly fullName: string;
  readonly memberships: readonly ActorMembership[];
  /** property.landlords rows this person is the landlord of. */
  readonly landlordIds: readonly string[];
  /** property.leases rows this person is the resident of, with the unit and property of each. */
  readonly leaseIds: readonly string[];
  readonly unitIds: readonly string[];
  readonly propertyIds: readonly string[];
}

async function buildActor(
  client: Db,
  user: { id: string; clerkUserId: string | null; email: string; fullName: string },
): Promise<Actor | null> {
  if (!user.clerkUserId) return null;
  const clerkUserId = user.clerkUserId;
  return withScope(client, { userId: user.id }, async (tx) => {
    const [memberships, landlords, leases] = await Promise.all([
      tx.membership.findMany({
        where: { userId: user.id },
        include: { organization: true },
        orderBy: { createdAt: 'asc' },
      }),
      tx.landlord.findMany({ where: { userId: user.id }, select: { id: true } }),
      tx.lease.findMany({
        where: { residentUserId: user.id },
        select: { id: true, unitId: true, propertyId: true },
      }),
    ]);
    return {
      userId: user.id,
      clerkUserId,
      email: user.email,
      fullName: user.fullName,
      memberships: memberships.map((m) => ({
        organizationId: m.organizationId,
        slug: m.organization.slug,
        name: m.organization.name,
        kind: m.organization.kind,
        role: m.role,
      })),
      landlordIds: landlords.map((l) => l.id),
      leaseIds: leases.map((l) => l.id),
      unitIds: [...new Set(leases.map((l) => l.unitId))],
      propertyIds: [...new Set(leases.map((l) => l.propertyId))],
    };
  });
}

/** The person behind a Clerk session, or null when this Clerk user is not linked yet. */
export async function findActorByClerkId(
  clerkUserId: string,
  client: Db = db(),
): Promise<Actor | null> {
  const user = await client.user.findUnique({ where: { clerkUserId } });
  return user ? buildActor(client, user) : null;
}

/**
 * First-contact linking: a user row seeded by email gets its Clerk id on first sign-in. Refuses
 * to steal a row already linked to another Clerk user.
 */
export async function linkClerkUserByEmail(
  email: string,
  clerkUserId: string,
  client: Db = db(),
): Promise<Actor | null> {
  const normalized = email.trim().toLowerCase();
  const user = await client.user.findUnique({ where: { email: normalized } });
  if (!user) return null;
  if (user.clerkUserId && user.clerkUserId !== clerkUserId) return null;
  const linked = user.clerkUserId
    ? user
    : await client.user.update({ where: { id: user.id }, data: { clerkUserId } });
  return buildActor(client, linked);
}

/** Where a person lands after sign-in: their first organization, else the landlord portal, else the resident surface. */
export function homeFor(actor: Actor): string | null {
  const first = actor.memberships[0];
  if (first) return `/org/${first.slug}`;
  if (actor.landlordIds.length > 0) return '/landlord';
  if (actor.leaseIds.length > 0) return '/me';
  return null;
}

export interface OrganizationSummary {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly kind: OrganizationKind;
}

/** Organizations are the tenant itself, not a tenant table: readable by slug without a scope. */
export async function organizationBySlug(
  slug: string,
  client: Db = db(),
): Promise<OrganizationSummary | null> {
  const organization = await client.organization.findUnique({ where: { slug } });
  return organization
    ? {
        id: organization.id,
        slug: organization.slug,
        name: organization.name,
        kind: organization.kind,
      }
    : null;
}

export interface RentRun {
  /** Month label, e.g. "September 2026", from the latest rent-due posting. */
  readonly month: string;
  readonly expectedMinor: bigint;
  readonly collectedMinor: bigint;
  readonly outstandingMinor: bigint;
  readonly leasesTotal: number;
  readonly leasesPaid: number;
}

export interface PropertySummary {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly town: string;
  readonly county: string;
  readonly landlordName: string;
  readonly units: number;
  readonly occupied: number;
  readonly vacant: number;
}

export interface PostingLine {
  readonly id: string;
  readonly kind: string;
  readonly amountMinor: bigint;
  readonly reference: string;
  readonly postedAt: Date;
  readonly reversesPostingId: string | null;
  readonly leaseLabel: string | null;
}

export interface RepairLine {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly raisedAt: Date;
  readonly unitLabel: string;
  readonly propertyName: string;
}

export interface OrganizationDashboard {
  readonly organization: OrganizationSummary;
  readonly rentRun: RentRun | null;
  readonly properties: readonly PropertySummary[];
  readonly recentPostings: readonly PostingLine[];
  readonly repairs: readonly RepairLine[];
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function monthBounds(date: Date): { from: Date; to: Date } {
  const from = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const to = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  return { from, to };
}

function sum(values: readonly bigint[]): bigint {
  return values.reduce((total, value) => total + value, 0n);
}

/** Live read for `/org/[slug]`. Never cached (a stale figure costs money). */
export async function organizationDashboard(
  organization: OrganizationSummary,
  client: Db = db(),
): Promise<OrganizationDashboard> {
  const organizationId = organization.id;
  // Every query names the organization explicitly; RLS is the backstop, never the only filter.
  return withScope(client, { organizationId }, async (tx) => {
    const [properties, latestDue, repairs] = await Promise.all([
      tx.property.findMany({
        where: { organizationId },
        include: { landlord: true, units: { select: { status: true } } },
        orderBy: { name: 'asc' },
      }),
      tx.posting.findFirst({
        where: { organizationId, kind: 'rent_due' },
        orderBy: { postedAt: 'desc' },
      }),
      tx.repairRequest.findMany({
        where: { organizationId, status: { not: 'closed' } },
        include: { lease: { include: { unit: { include: { property: true } } } } },
        orderBy: { raisedAt: 'desc' },
        take: 10,
      }),
    ]);

    let rentRun: RentRun | null = null;
    if (latestDue) {
      const { from, to } = monthBounds(latestDue.postedAt);
      const postings = await tx.posting.findMany({
        where: {
          organizationId,
          postedAt: { gte: from, lt: to },
          kind: { in: ['rent_due', 'payment'] },
        },
      });
      const due = postings.filter((p) => p.kind === 'rent_due');
      const paid = postings.filter((p) => p.kind === 'payment');
      const expectedMinor = sum(due.map((p) => p.amountMinor));
      const collectedMinor = sum(paid.map((p) => p.amountMinor));
      rentRun = {
        month: monthLabel(latestDue.postedAt),
        expectedMinor,
        collectedMinor,
        outstandingMinor: expectedMinor - collectedMinor,
        leasesTotal: new Set(due.map((p) => p.leaseId)).size,
        leasesPaid: new Set(paid.map((p) => p.leaseId)).size,
      };
    }

    const recent = await tx.posting.findMany({
      where: { organizationId },
      orderBy: { postedAt: 'desc' },
      take: 8,
    });
    const leaseIds = recent.map((p) => p.leaseId).filter((id): id is string => id !== null);
    const leases = await tx.lease.findMany({
      where: { organizationId, id: { in: leaseIds } },
      include: { unit: { include: { property: true } } },
    });
    const leaseLabel = new Map(
      leases.map((l) => [l.id, `${l.unit.property.name} · ${l.unit.label}`]),
    );

    return {
      organization,
      rentRun,
      properties: properties.map((p) => ({
        id: p.id,
        name: p.name,
        kind: p.kind,
        town: p.town,
        county: p.county,
        landlordName: p.landlord.name,
        units: p.units.length,
        occupied: p.units.filter((u) => u.status !== 'vacant').length,
        vacant: p.units.filter((u) => u.status === 'vacant').length,
      })),
      recentPostings: recent.map((p) => ({
        id: p.id,
        kind: p.kind,
        amountMinor: p.amountMinor,
        reference: p.reference,
        postedAt: p.postedAt,
        reversesPostingId: p.reversesPostingId,
        leaseLabel: p.leaseId ? (leaseLabel.get(p.leaseId) ?? null) : null,
      })),
      repairs: repairs.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        raisedAt: r.raisedAt,
        unitLabel: r.lease.unit.label,
        propertyName: r.lease.unit.property.name,
      })),
    };
  });
}

export interface MemberLine {
  readonly userId: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: MembershipRole;
}

/** Members of an organization, for the settings page (owner/admin only; enforced by the caller). */
export async function organizationMembers(
  organizationId: string,
  client: Db = db(),
): Promise<readonly MemberLine[]> {
  return withScope(client, { organizationId }, async (tx) => {
    const memberships = await tx.membership.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    return memberships.map((m) => ({
      userId: m.userId,
      fullName: m.user.fullName,
      email: m.user.email,
      role: m.role,
    }));
  });
}

export interface LandlordStatement {
  readonly landlordId: string;
  readonly landlordName: string;
  readonly agencyFeeBps: number;
  readonly month: string | null;
  readonly collectedMinor: bigint;
  readonly feesMinor: bigint;
  readonly remittedMinor: bigint;
  readonly properties: readonly PropertySummary[];
  readonly postings: readonly PostingLine[];
}

/** Live read for `/landlord`: only rows the landlord policies expose to this person. */
export async function landlordPortal(
  actor: Actor,
  client: Db = db(),
): Promise<readonly LandlordStatement[]> {
  if (actor.landlordIds.length === 0) return [];
  return withScope(client, { userId: actor.userId, landlordIds: actor.landlordIds }, async (tx) => {
    const landlords = await tx.landlord.findMany({
      where: { id: { in: [...actor.landlordIds] } },
      include: { properties: { include: { units: { select: { status: true } } } } },
    });
    const statements: LandlordStatement[] = [];
    for (const landlord of landlords) {
      const latest = await tx.posting.findFirst({
        where: { landlordId: landlord.id },
        orderBy: { postedAt: 'desc' },
      });
      let month: string | null = null;
      let inMonth: { kind: string; amountMinor: bigint }[] = [];
      let lines: PostingLine[] = [];
      if (latest) {
        const { from, to } = monthBounds(latest.postedAt);
        const postings = await tx.posting.findMany({
          where: { landlordId: landlord.id, postedAt: { gte: from, lt: to } },
          orderBy: { postedAt: 'desc' },
        });
        month = monthLabel(latest.postedAt);
        inMonth = postings;
        lines = postings.slice(0, 12).map((p) => ({
          id: p.id,
          kind: p.kind,
          amountMinor: p.amountMinor,
          reference: p.reference,
          postedAt: p.postedAt,
          reversesPostingId: p.reversesPostingId,
          leaseLabel: null,
        }));
      }
      const fees = sum(inMonth.filter((p) => p.kind === 'agency_fee').map((p) => p.amountMinor));
      const reversedFees = sum(
        inMonth.filter((p) => p.kind === 'reversal').map((p) => p.amountMinor),
      );
      statements.push({
        landlordId: landlord.id,
        landlordName: landlord.name,
        agencyFeeBps: landlord.agencyFeeBps,
        month,
        collectedMinor: sum(inMonth.filter((p) => p.kind === 'payment').map((p) => p.amountMinor)),
        feesMinor: fees - reversedFees,
        remittedMinor: sum(
          inMonth.filter((p) => p.kind === 'remittance').map((p) => p.amountMinor),
        ),
        properties: landlord.properties.map((p) => ({
          id: p.id,
          name: p.name,
          kind: p.kind,
          town: p.town,
          county: p.county,
          landlordName: landlord.name,
          units: p.units.length,
          occupied: p.units.filter((u) => u.status !== 'vacant').length,
          vacant: p.units.filter((u) => u.status === 'vacant').length,
        })),
        postings: lines,
      });
    }
    return statements;
  });
}

export interface ResidentLease {
  readonly leaseId: string;
  readonly propertyName: string;
  readonly unitLabel: string;
  readonly town: string;
  readonly rentMinor: bigint;
  readonly status: string;
  readonly dueMinor: bigint;
  readonly paidMinor: bigint;
  readonly month: string | null;
  readonly organizationName: string;
  readonly postings: readonly PostingLine[];
  readonly repairs: readonly RepairLine[];
}

/** Live read for `/me`: the resident's own leases and nothing else. */
export async function residentHome(
  actor: Actor,
  client: Db = db(),
): Promise<readonly ResidentLease[]> {
  if (actor.leaseIds.length === 0) return [];
  const organizations = await client.organization.findMany();
  const orgName = new Map(organizations.map((o) => [o.id, o.name]));
  const scope = {
    userId: actor.userId,
    leaseIds: actor.leaseIds,
    unitIds: actor.unitIds,
    propertyIds: actor.propertyIds,
  };
  return withScope(client, scope, async (tx) => {
    const leases = await tx.lease.findMany({
      where: { id: { in: [...actor.leaseIds] } },
      include: {
        unit: { include: { property: true } },
        repairRequests: { orderBy: { raisedAt: 'desc' } },
      },
    });
    const result: ResidentLease[] = [];
    for (const lease of leases) {
      const postings = await tx.posting.findMany({
        where: { leaseId: lease.id },
        orderBy: { postedAt: 'desc' },
      });
      const latestDue = postings.find((p) => p.kind === 'rent_due');
      let dueMinor = 0n;
      let paidMinor = 0n;
      let month: string | null = null;
      if (latestDue) {
        const { from, to } = monthBounds(latestDue.postedAt);
        const inMonth = postings.filter((p) => p.postedAt >= from && p.postedAt < to);
        dueMinor = sum(inMonth.filter((p) => p.kind === 'rent_due').map((p) => p.amountMinor));
        paidMinor = sum(inMonth.filter((p) => p.kind === 'payment').map((p) => p.amountMinor));
        month = monthLabel(latestDue.postedAt);
      }
      result.push({
        leaseId: lease.id,
        propertyName: lease.unit.property.name,
        unitLabel: lease.unit.label,
        town: lease.unit.property.town,
        rentMinor: lease.rentMinor,
        status: lease.status,
        dueMinor,
        paidMinor,
        month,
        organizationName: orgName.get(lease.organizationId) ?? 'Your agency',
        postings: postings.slice(0, 8).map((p) => ({
          id: p.id,
          kind: p.kind,
          amountMinor: p.amountMinor,
          reference: p.reference,
          postedAt: p.postedAt,
          reversesPostingId: p.reversesPostingId,
          leaseLabel: null,
        })),
        repairs: lease.repairRequests.map((r) => ({
          id: r.id,
          title: r.title,
          status: r.status,
          raisedAt: r.raisedAt,
          unitLabel: lease.unit.label,
          propertyName: lease.unit.property.name,
        })),
      });
    }
    return result;
  });
}
