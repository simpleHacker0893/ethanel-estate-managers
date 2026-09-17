-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "identity";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "money";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "property";

-- CreateEnum
CREATE TYPE "identity"."OrganizationKind" AS ENUM ('letting_firm', 'land_company', 'landlord');

-- CreateEnum
CREATE TYPE "identity"."MembershipRole" AS ENUM ('owner', 'admin', 'staff', 'caretaker');

-- CreateEnum
CREATE TYPE "property"."PropertyKind" AS ENUM ('building', 'estate', 'land');

-- CreateEnum
CREATE TYPE "property"."UnitStatus" AS ENUM ('occupied', 'vacant', 'notice');

-- CreateEnum
CREATE TYPE "property"."LeaseStatus" AS ENUM ('active', 'notice', 'ended');

-- CreateEnum
CREATE TYPE "property"."RepairRequestStatus" AS ENUM ('open', 'work_order', 'closed');

-- CreateEnum
CREATE TYPE "money"."PostingKind" AS ENUM ('rent_due', 'payment', 'agency_fee', 'remittance', 'reversal');

-- CreateTable
CREATE TABLE "identity"."organizations" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "identity"."OrganizationKind" NOT NULL,
    "clerk_organization_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "clerk_user_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity"."memberships" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "identity"."MembershipRole" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property"."landlords" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "agency_fee_bps" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landlords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property"."properties" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "landlord_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "property"."PropertyKind" NOT NULL,
    "town" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property"."units" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "landlord_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "rent_minor" BIGINT NOT NULL,
    "status" "property"."UnitStatus" NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property"."leases" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "landlord_id" UUID NOT NULL,
    "resident_user_id" UUID,
    "resident_name" TEXT NOT NULL,
    "resident_phone" TEXT,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE,
    "rent_minor" BIGINT NOT NULL,
    "status" "property"."LeaseStatus" NOT NULL,

    CONSTRAINT "leases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property"."repair_requests" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "lease_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "property"."RepairRequestStatus" NOT NULL,
    "raised_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "repair_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "money"."postings" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "lease_id" UUID,
    "landlord_id" UUID,
    "kind" "money"."PostingKind" NOT NULL,
    "amount_minor" BIGINT NOT NULL,
    "reference" TEXT NOT NULL,
    "reverses_posting_id" UUID,
    "posted_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "postings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "identity"."organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_organization_id_key" ON "identity"."organizations"("clerk_organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "identity"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "identity"."users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "memberships_user_id_idx" ON "identity"."memberships"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_organization_id_user_id_key" ON "identity"."memberships"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "landlords_organization_id_idx" ON "property"."landlords"("organization_id");

-- CreateIndex
CREATE INDEX "landlords_user_id_idx" ON "property"."landlords"("user_id");

-- CreateIndex
CREATE INDEX "properties_organization_id_idx" ON "property"."properties"("organization_id");

-- CreateIndex
CREATE INDEX "units_organization_id_idx" ON "property"."units"("organization_id");

-- CreateIndex
CREATE INDEX "units_landlord_id_idx" ON "property"."units"("landlord_id");

-- CreateIndex
CREATE UNIQUE INDEX "units_property_id_label_key" ON "property"."units"("property_id", "label");

-- CreateIndex
CREATE INDEX "leases_organization_id_idx" ON "property"."leases"("organization_id");

-- CreateIndex
CREATE INDEX "leases_resident_user_id_idx" ON "property"."leases"("resident_user_id");

-- CreateIndex
CREATE INDEX "leases_landlord_id_idx" ON "property"."leases"("landlord_id");

-- CreateIndex
CREATE INDEX "repair_requests_organization_id_idx" ON "property"."repair_requests"("organization_id");

-- CreateIndex
CREATE INDEX "postings_organization_id_posted_at_idx" ON "money"."postings"("organization_id", "posted_at");

-- CreateIndex
CREATE INDEX "postings_lease_id_idx" ON "money"."postings"("lease_id");

-- CreateIndex
CREATE INDEX "postings_landlord_id_idx" ON "money"."postings"("landlord_id");

-- AddForeignKey
ALTER TABLE "identity"."memberships" ADD CONSTRAINT "memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "identity"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity"."memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property"."properties" ADD CONSTRAINT "properties_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "property"."landlords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property"."units" ADD CONSTRAINT "units_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property"."leases" ADD CONSTRAINT "leases_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "property"."units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property"."repair_requests" ADD CONSTRAINT "repair_requests_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "property"."leases"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ------------------------------------------------------------------------------------------
-- Row-level security. Tenancy is organization_id; the application sets these transaction-local
-- settings through @ethanel/db `withScope()` before any query:
--   app.organization_id  the organization the caller is acting inside (staff, caretakers)
--   app.user_id          identity.users.id of the caller (their own memberships, landlord and lease rows)
--   app.landlord_ids     comma-separated property.landlords.id the caller may read as a landlord
--   app.lease_ids        comma-separated property.leases.id the caller may read as a resident
--   app.unit_ids         comma-separated property.units.id of those leases
--   app.property_ids     comma-separated property.properties.id of those leases
-- FORCE applies the policies to the table owner too, so a query outside withScope() sees no
-- tenant rows even on the owner connection. Writes always require the organization scope.
-- Every policy reads only its own table's columns plus the settings above: no subqueries, no
-- joins, no helper functions, nothing across schemas. Cross-table scope travels as settings
-- (denormalised copies of landlord_id / property_id on units and leases exist for this reason).
-- ------------------------------------------------------------------------------------------

-- identity.memberships
ALTER TABLE "identity"."memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "identity"."memberships" FORCE ROW LEVEL SECURITY;
CREATE POLICY memberships_read ON "identity"."memberships" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR user_id = NULLIF(current_setting('app.user_id', true), '')::uuid
);
CREATE POLICY memberships_write ON "identity"."memberships" FOR ALL
  USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

-- property.landlords
ALTER TABLE "property"."landlords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property"."landlords" FORCE ROW LEVEL SECURITY;
CREATE POLICY landlords_read ON "property"."landlords" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR user_id = NULLIF(current_setting('app.user_id', true), '')::uuid
);
CREATE POLICY landlords_write ON "property"."landlords" FOR ALL
  USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

-- property.properties
ALTER TABLE "property"."properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property"."properties" FORCE ROW LEVEL SECURITY;
CREATE POLICY properties_read ON "property"."properties" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR landlord_id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.landlord_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
  OR id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.property_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
);
CREATE POLICY properties_write ON "property"."properties" FOR ALL
  USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

-- property.units
ALTER TABLE "property"."units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property"."units" FORCE ROW LEVEL SECURITY;
CREATE POLICY units_read ON "property"."units" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR landlord_id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.landlord_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
  OR id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.unit_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
);
CREATE POLICY units_write ON "property"."units" FOR ALL
  USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

-- property.leases
ALTER TABLE "property"."leases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property"."leases" FORCE ROW LEVEL SECURITY;
CREATE POLICY leases_read ON "property"."leases" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR resident_user_id = NULLIF(current_setting('app.user_id', true), '')::uuid
  OR landlord_id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.landlord_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
);
CREATE POLICY leases_write ON "property"."leases" FOR ALL
  USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

-- property.repair_requests
ALTER TABLE "property"."repair_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property"."repair_requests" FORCE ROW LEVEL SECURITY;
CREATE POLICY repair_requests_read ON "property"."repair_requests" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR lease_id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.lease_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
);
CREATE POLICY repair_requests_write ON "property"."repair_requests" FOR ALL
  USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

-- money.postings: append-only. SELECT and INSERT policies only; with FORCE ROW LEVEL SECURITY
-- and no UPDATE/DELETE policy, no role short of a superuser can change or remove a posting.
ALTER TABLE "money"."postings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "money"."postings" FORCE ROW LEVEL SECURITY;
CREATE POLICY postings_read ON "money"."postings" FOR SELECT USING (
  organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  OR landlord_id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.landlord_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
  OR lease_id = ANY (COALESCE(string_to_array(NULLIF(current_setting('app.lease_ids', true), ''), ',')::uuid[], ARRAY[]::uuid[]))
);
CREATE POLICY postings_insert ON "money"."postings" FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);
