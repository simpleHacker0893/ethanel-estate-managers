/**
 * Deterministic demo data. Every id is fixed so seeds are idempotent, tests can reference rows,
 * and the same rows exist in Neon, in a local Postgres and in CI.
 *
 * Everything here is fictional and labelled "sample" on screen (QUESTIONS.md Q-06, Q-07).
 * Vocabulary: organization, resident, landlord, caretaker, property, unit, lease, posting.
 * Money is bigint minor units (KES cents).
 */

// UUIDv7-shaped, deterministic: a fixed time prefix, version 7, variant 8, then a 2-hex-digit
// kind code and a 10-hex-digit counter.
function fx(kind: number, n: number): string {
  const tail = kind.toString(16).padStart(2, '0') + n.toString(16).padStart(10, '0');
  return `0199e3a0-0000-7000-8000-${tail}`;
}

export const kinds = {
  organization: 1,
  user: 2,
  membership: 3,
  landlord: 4,
  property: 5,
  unit: 6,
  lease: 7,
  repairRequest: 8,
  posting: 9,
} as const;

export const ids = {
  org: { riverside: fx(kinds.organization, 1), savannah: fx(kinds.organization, 2) },
  user: {
    admin: fx(kinds.user, 1),
    staff: fx(kinds.user, 2),
    caretaker: fx(kinds.user, 3),
    landlord: fx(kinds.user, 4),
    resident: fx(kinds.user, 5),
    savannahOwner: fx(kinds.user, 6),
  },
  landlord: {
    grace: fx(kinds.landlord, 1),
    mwangi: fx(kinds.landlord, 2),
    savannah: fx(kinds.landlord, 3),
  },
  property: {
    riversideCourt: fx(kinds.property, 1),
    ridgewaysVillas: fx(kinds.property, 2),
    kitengela: fx(kinds.property, 3),
  },
} as const;

/** One password for every demo account. Shown on the landing page on purpose. */
export const DEMO_PASSWORD = 'Ethanel-demo-2026';

export type Persona = 'admin' | 'staff' | 'caretaker' | 'landlord' | 'resident' | 'savannahOwner';

export interface DemoUser {
  readonly id: string;
  readonly persona: Persona;
  readonly email: string;
  readonly fullName: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  /** Placeholder Clerk id used by local and CI sessions; the Clerk seed replaces it with the real `user_…`. */
  readonly clerkUserId: string;
  /** Where the app sends this persona after sign-in. */
  readonly home: string;
}

export const demoUsers: readonly DemoUser[] = [
  {
    id: ids.user.admin,
    persona: 'admin',
    email: 'demo.admin@ethanel.co.ke',
    fullName: 'Njeri Kamau',
    firstName: 'Njeri',
    lastName: 'Kamau',
    phone: '+254700000001',
    clerkUserId: 'user_demo_admin',
    home: '/org/riverside-lettings',
  },
  {
    id: ids.user.staff,
    persona: 'staff',
    email: 'demo.staff@ethanel.co.ke',
    fullName: 'Brian Otieno',
    firstName: 'Brian',
    lastName: 'Otieno',
    phone: '+254700000002',
    clerkUserId: 'user_demo_staff',
    home: '/org/riverside-lettings',
  },
  {
    id: ids.user.caretaker,
    persona: 'caretaker',
    email: 'demo.caretaker@ethanel.co.ke',
    fullName: 'Samuel Kiptoo',
    firstName: 'Samuel',
    lastName: 'Kiptoo',
    phone: '+254700000003',
    clerkUserId: 'user_demo_caretaker',
    home: '/org/riverside-lettings',
  },
  {
    id: ids.user.landlord,
    persona: 'landlord',
    email: 'demo.landlord@ethanel.co.ke',
    fullName: 'Grace Wanjiru',
    firstName: 'Grace',
    lastName: 'Wanjiru',
    phone: '+254700000004',
    clerkUserId: 'user_demo_landlord',
    home: '/landlord',
  },
  {
    id: ids.user.resident,
    persona: 'resident',
    email: 'demo.resident@ethanel.co.ke',
    fullName: 'Amina Wambui',
    firstName: 'Amina',
    lastName: 'Wambui',
    phone: '+254700000005',
    clerkUserId: 'user_demo_resident',
    home: '/me',
  },
  {
    id: ids.user.savannahOwner,
    persona: 'savannahOwner',
    email: 'demo.savannah@ethanel.co.ke',
    fullName: 'Peter Mutua',
    firstName: 'Peter',
    lastName: 'Mutua',
    phone: '+254700000006',
    clerkUserId: 'user_demo_savannah',
    home: '/org/savannah-land',
  },
];

export interface DemoOrganization {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly kind: 'letting_firm' | 'land_company' | 'landlord';
  /** Clerk organization slug is the same as ours. */
  readonly clerkOrganizationId: string;
}

export const demoOrganizations: readonly DemoOrganization[] = [
  {
    id: ids.org.riverside,
    slug: 'riverside-lettings',
    name: 'Riverside Lettings',
    kind: 'letting_firm',
    clerkOrganizationId: 'org_demo_riverside',
  },
  {
    id: ids.org.savannah,
    slug: 'savannah-land',
    name: 'Savannah Land Co.',
    kind: 'land_company',
    clerkOrganizationId: 'org_demo_savannah',
  },
];

export type MembershipRole = 'owner' | 'admin' | 'staff' | 'caretaker';

export interface DemoMembership {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly role: MembershipRole;
  /** Clerk organization role the seed assigns. Custom roles are not required. */
  readonly clerkRole: 'org:admin' | 'org:member';
}

export const demoMemberships: readonly DemoMembership[] = [
  {
    id: fx(kinds.membership, 1),
    organizationId: ids.org.riverside,
    userId: ids.user.admin,
    role: 'owner',
    clerkRole: 'org:admin',
  },
  {
    id: fx(kinds.membership, 2),
    organizationId: ids.org.riverside,
    userId: ids.user.staff,
    role: 'staff',
    clerkRole: 'org:member',
  },
  {
    id: fx(kinds.membership, 3),
    organizationId: ids.org.riverside,
    userId: ids.user.caretaker,
    role: 'caretaker',
    clerkRole: 'org:member',
  },
  {
    id: fx(kinds.membership, 4),
    organizationId: ids.org.savannah,
    userId: ids.user.savannahOwner,
    role: 'owner',
    clerkRole: 'org:admin',
  },
];

export interface Row {
  readonly schema: 'identity' | 'property' | 'money';
  readonly table: string;
  /** null for global rows (organizations, users). */
  readonly organizationId: string | null;
  readonly values: Readonly<Record<string, string | number | bigint | boolean | null>>;
}

const KES = (shillings: number): bigint => BigInt(shillings) * 100n;

/** Every row the seed writes, in dependency order. */
export function fixtureRows(): Row[] {
  const rows: Row[] = [];
  const push = (
    schema: Row['schema'],
    table: string,
    organizationId: string | null,
    values: Row['values'],
  ) => {
    rows.push({ schema, table, organizationId, values });
  };

  for (const o of demoOrganizations) {
    push('identity', 'organizations', null, {
      id: o.id,
      slug: o.slug,
      name: o.name,
      kind: o.kind,
      clerk_organization_id: o.clerkOrganizationId,
    });
  }
  for (const u of demoUsers) {
    push('identity', 'users', null, {
      id: u.id,
      email: u.email,
      full_name: u.fullName,
      phone: u.phone,
      clerk_user_id: u.clerkUserId,
    });
  }
  for (const m of demoMemberships) {
    push('identity', 'memberships', m.organizationId, {
      id: m.id,
      organization_id: m.organizationId,
      user_id: m.userId,
      role: m.role,
    });
  }

  // ---- Riverside Lettings ---------------------------------------------------------------
  const R = ids.org.riverside;
  push('property', 'landlords', R, {
    id: ids.landlord.grace,
    organization_id: R,
    user_id: ids.user.landlord,
    name: 'Grace Wanjiru',
    phone: '+254700000004',
    agency_fee_bps: 800,
  });
  push('property', 'landlords', R, {
    id: ids.landlord.mwangi,
    organization_id: R,
    user_id: null,
    name: 'Mwangi Family Trust',
    phone: '+254700000104',
    agency_fee_bps: 1000,
  });
  push('property', 'properties', R, {
    id: ids.property.riversideCourt,
    organization_id: R,
    landlord_id: ids.landlord.grace,
    name: 'Riverside Court',
    kind: 'building',
    town: 'Kilimani',
    county: 'Nairobi',
  });
  push('property', 'properties', R, {
    id: ids.property.ridgewaysVillas,
    organization_id: R,
    landlord_id: ids.landlord.mwangi,
    name: 'Ridgeways Villas',
    kind: 'estate',
    town: 'Ridgeways',
    county: 'Nairobi',
  });

  interface UnitSpec {
    n: number;
    property: string;
    label: string;
    bedrooms: number;
    rent: number;
    resident?: { name: string; phone: string; userId?: string };
    status: 'occupied' | 'vacant' | 'notice';
    paid?: boolean;
    ref?: string;
  }
  const units: UnitSpec[] = [
    {
      n: 1,
      property: ids.property.riversideCourt,
      label: 'A1',
      bedrooms: 2,
      rent: 45_000,
      resident: { name: 'Joseph Mwangi', phone: '+254711000001' },
      status: 'occupied',
      paid: true,
      ref: 'RJ3K7A1M2P',
    },
    {
      n: 2,
      property: ids.property.riversideCourt,
      label: 'A2',
      bedrooms: 2,
      rent: 45_000,
      resident: { name: 'Faith Achieng', phone: '+254711000002' },
      status: 'occupied',
      paid: true,
      ref: 'RJ3K7B4N8Q',
    },
    {
      n: 3,
      property: ids.property.riversideCourt,
      label: 'A3',
      bedrooms: 1,
      rent: 38_000,
      resident: { name: 'Kevin Omondi', phone: '+254711000003' },
      status: 'occupied',
      paid: false,
    },
    {
      n: 4,
      property: ids.property.riversideCourt,
      label: 'A4',
      bedrooms: 1,
      rent: 38_000,
      status: 'vacant',
    },
    {
      n: 5,
      property: ids.property.riversideCourt,
      label: 'B1',
      bedrooms: 3,
      rent: 62_000,
      resident: { name: 'Mercy Njoroge', phone: '+254711000005' },
      status: 'occupied',
      paid: true,
      ref: 'RJ3K7C9R1S',
    },
    {
      n: 6,
      property: ids.property.riversideCourt,
      label: 'B2',
      bedrooms: 3,
      rent: 62_000,
      resident: { name: 'Daniel Kariuki', phone: '+254711000006' },
      status: 'notice',
      paid: true,
      ref: 'RJ3K7D2T5U',
    },
    {
      n: 7,
      property: ids.property.riversideCourt,
      label: 'B3',
      bedrooms: 2,
      rent: 45_000,
      resident: { name: 'Lucy Wairimu', phone: '+254711000007' },
      status: 'occupied',
      paid: false,
    },
    {
      n: 8,
      property: ids.property.riversideCourt,
      label: 'B4',
      bedrooms: 2,
      rent: 45_000,
      resident: { name: 'Amina Wambui', phone: '+254700000005', userId: ids.user.resident },
      status: 'occupied',
      paid: true,
      ref: 'RJ3K7E6V9W',
    },
    {
      n: 9,
      property: ids.property.ridgewaysVillas,
      label: 'Villa 1',
      bedrooms: 4,
      rent: 120_000,
      resident: { name: 'Hassan Abdi', phone: '+254711000009' },
      status: 'occupied',
      paid: true,
      ref: 'RJ3K7F1X4Y',
    },
    {
      n: 10,
      property: ids.property.ridgewaysVillas,
      label: 'Villa 2',
      bedrooms: 4,
      rent: 120_000,
      resident: { name: 'Esther Muthoni', phone: '+254711000010' },
      status: 'occupied',
      paid: false,
    },
    {
      n: 11,
      property: ids.property.ridgewaysVillas,
      label: 'Villa 3',
      bedrooms: 4,
      rent: 120_000,
      status: 'vacant',
    },
    {
      n: 12,
      property: ids.property.ridgewaysVillas,
      label: 'Villa 4',
      bedrooms: 3,
      rent: 95_000,
      resident: { name: 'George Kimani', phone: '+254711000012' },
      status: 'occupied',
      paid: true,
      ref: 'RJ3K7G8Z2A',
    },
  ];

  let postingN = 0;
  const posting = (values: Omit<Row['values'], 'id' | 'organization_id'>) => {
    postingN += 1;
    push('money', 'postings', R, {
      id: fx(kinds.posting, postingN),
      organization_id: R,
      ...values,
    });
  };

  for (const u of units) {
    const unitId = fx(kinds.unit, u.n);
    const landlordId =
      u.property === ids.property.riversideCourt ? ids.landlord.grace : ids.landlord.mwangi;
    push('property', 'units', R, {
      id: unitId,
      organization_id: R,
      property_id: u.property,
      landlord_id: landlordId,
      label: u.label,
      bedrooms: u.bedrooms,
      rent_minor: KES(u.rent),
      status: u.status,
    });
    if (!u.resident) continue;
    const leaseId = fx(kinds.lease, u.n);
    push('property', 'leases', R, {
      id: leaseId,
      organization_id: R,
      unit_id: unitId,
      property_id: u.property,
      landlord_id: landlordId,
      resident_user_id: u.resident.userId ?? null,
      resident_name: u.resident.name,
      resident_phone: u.resident.phone,
      starts_on: '2025-10-01',
      ends_on: u.status === 'notice' ? '2026-10-31' : null,
      rent_minor: KES(u.rent),
      status: u.status === 'notice' ? 'notice' : 'active',
    });
    posting({
      lease_id: leaseId,
      landlord_id: landlordId,
      kind: 'rent_due',
      amount_minor: KES(u.rent),
      reference: 'Rent due, September 2026',
      reverses_posting_id: null,
      posted_at: '2026-09-01T06:00:00Z',
    });
    if (u.paid) {
      posting({
        lease_id: leaseId,
        landlord_id: landlordId,
        kind: 'payment',
        amount_minor: KES(u.rent),
        reference: `M-Pesa ${u.ref ?? ''}`.trim(),
        reverses_posting_id: null,
        posted_at: `2026-09-0${(u.n % 4) + 2}T09:1${u.n % 10}:00Z`,
      });
      const feeBps = landlordId === ids.landlord.grace ? 800n : 1000n;
      posting({
        lease_id: leaseId,
        landlord_id: landlordId,
        kind: 'agency_fee',
        amount_minor: (KES(u.rent) * feeBps) / 10_000n,
        reference: 'Agency fee per management agreement',
        reverses_posting_id: null,
        posted_at: `2026-09-0${(u.n % 4) + 2}T09:2${u.n % 10}:00Z`,
      });
    }
  }
  // A duplicate fee and its reversal, so the ledger shows a correction (never an edit).
  const b4Lease = fx(kinds.lease, 8);
  posting({
    lease_id: b4Lease,
    landlord_id: ids.landlord.grace,
    kind: 'agency_fee',
    amount_minor: KES(3_600),
    reference: 'Agency fee per management agreement (duplicate)',
    reverses_posting_id: null,
    posted_at: '2026-09-04T10:00:00Z',
  });
  const duplicateId = fx(kinds.posting, postingN);
  posting({
    lease_id: b4Lease,
    landlord_id: ids.landlord.grace,
    kind: 'reversal',
    amount_minor: KES(3_600),
    reference: 'Reverses duplicate agency fee',
    reverses_posting_id: duplicateId,
    posted_at: '2026-09-04T10:05:00Z',
  });
  // Remittance to Grace Wanjiru for Riverside Court, 5 September.
  posting({
    lease_id: null,
    landlord_id: ids.landlord.grace,
    kind: 'remittance',
    amount_minor: KES(238_280),
    reference: 'Remittance, Riverside Court, September 2026',
    reverses_posting_id: null,
    posted_at: '2026-09-05T08:00:00Z',
  });

  push('property', 'repair_requests', R, {
    id: fx(kinds.repairRequest, 1),
    organization_id: R,
    lease_id: b4Lease,
    title: 'Kitchen tap leaking under the sink',
    status: 'work_order',
    raised_at: '2026-09-10T07:30:00Z',
  });
  push('property', 'repair_requests', R, {
    id: fx(kinds.repairRequest, 2),
    organization_id: R,
    lease_id: fx(kinds.lease, 1),
    title: 'Corridor light on floor 1 not working',
    status: 'open',
    raised_at: '2026-09-14T18:10:00Z',
  });
  push('property', 'repair_requests', R, {
    id: fx(kinds.repairRequest, 3),
    organization_id: R,
    lease_id: fx(kinds.lease, 9),
    title: 'Gate motor jammed',
    status: 'closed',
    raised_at: '2026-08-28T11:00:00Z',
  });

  // ---- Savannah Land Co. (a second organization, so tenancy isolation is testable) ----------
  const S = ids.org.savannah;
  push('property', 'landlords', S, {
    id: ids.landlord.savannah,
    organization_id: S,
    user_id: null,
    name: 'Savannah Land Co. (own stock)',
    phone: '+254700000106',
    agency_fee_bps: 0,
  });
  push('property', 'properties', S, {
    id: ids.property.kitengela,
    organization_id: S,
    landlord_id: ids.landlord.savannah,
    name: 'Kitengela Gardens Phase 2',
    kind: 'land',
    town: 'Kitengela',
    county: 'Kajiado',
  });
  push('property', 'units', S, {
    id: fx(kinds.unit, 101),
    organization_id: S,
    property_id: ids.property.kitengela,
    landlord_id: ids.landlord.savannah,
    label: 'Plot 12',
    bedrooms: 0,
    rent_minor: 0n,
    status: 'vacant',
  });
  push('property', 'units', S, {
    id: fx(kinds.unit, 102),
    organization_id: S,
    property_id: ids.property.kitengela,
    landlord_id: ids.landlord.savannah,
    label: 'Plot 13',
    bedrooms: 0,
    rent_minor: 0n,
    status: 'vacant',
  });

  return rows;
}

function literal(value: string | number | bigint | boolean | null): string {
  if (value === null) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number' || typeof value === 'bigint') return value.toString();
  return `'${value.replace(/'/g, "''")}'`;
}

/** `INSERT … ON CONFLICT DO NOTHING` for one row; safe to re-run. */
export function rowToSql(row: Row): string {
  const columns = Object.keys(row.values);
  const values = columns.map((c) => literal(row.values[c] ?? null));
  return `INSERT INTO "${row.schema}"."${row.table}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;`;
}

/**
 * The whole seed as SQL, grouped by organization with the RLS scope set before each group.
 * Used by `pnpm --filter @ethanel/db seed:sql` (psql, the Neon console or the Neon MCP).
 */
export function seedSql(): string {
  const rows = fixtureRows();
  const out: string[] = ['BEGIN;'];
  let current: string | null | undefined;
  for (const row of rows) {
    if (row.organizationId !== current) {
      current = row.organizationId;
      out.push(`SELECT set_config('app.organization_id', '${current ?? ''}', true);`);
    }
    out.push(rowToSql(row));
  }
  out.push('COMMIT;');
  return out.join('\n');
}
