# services/

One folder per domain service. Each is a Fastify app on `@ethanel/chassis`, deployed from the
Helm library chart in `charts/service`, with **one Postgres schema and one DB role** of its own.

| Service         | Owns                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| `identity-svc`  | organizations, memberships, roles, Clerk sync, staff and caretaker accounts     |
| `property-svc`  | properties, units, plots, landlords, management agreements, leases, residents   |
| `listing-svc`   | marketplace listings, viewings, saved searches                                  |
| `money-svc`     | the ledger: postings, lease accounts, landlord statements, remittance schedules |
| `payments-svc`  | M-Pesa STK/Paybill/Till, receipts, reconciliation, payouts                      |
| `messaging-svc` | WhatsApp Cloud API sessions, templates, inbound intents (PAY, repair photos)    |
| `ops-svc`       | repair requests, work orders, caretaker assignments                             |
| `docs-svc`      | statements, receipts, Excel exports, document storage                           |
| `billing-svc`   | Ethanel's own subscriptions, per-unit pricing, API keys, demo requests          |

Rules every service README restates:

1. Owns one Postgres schema and one DB role. No cross-schema joins or foreign keys.
2. Reads other services only over their `/v1` REST API with an internal JWT.
3. Tenancy is `organization_id` + RLS; the chassis sets `app.organization_id` per transaction.
4. Money is `bigint` minor units. Keys are UUIDv7 generated in application code.
5. Side effects (jobs, webhooks out, messages) go through the transactional outbox → pg-boss.
