# billing-svc — placeholder

Fastify service on `@ethanel/chassis`. Implemented in a later sprint (see `.docs/sprints/`).

**Owns:** Ethanel's own subscriptions and per-unit pricing, API keys, demo requests.

## Contract every service honours

- Owns exactly one Postgres schema (`billing`) and one DB role (`billing_svc`).
- No cross-schema joins or foreign keys. Other services' data is read only over their `/v1` REST
  API, authenticated with an internal JWT that carries the caller and the `organization_id`.
- Tenancy is `organization_id` + row-level security. The chassis sets
  `app.organization_id` per transaction; a query outside that scope sees no tenant rows.
- Money is `bigint` minor units (KES cents). Keys are UUIDv7 generated in application code.
- Side effects go through the transactional outbox and pg-boss in this schema.
- Exposes `/healthz`, `/readyz`, `/startupz`; deployed via `charts/service`.
