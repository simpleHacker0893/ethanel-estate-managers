# apps/gateway — placeholder (Sprint 003)

Fastify app on `@ethanel/chassis`. The only public entry point besides the web app.

Owns:

- **Public versioned REST** under `/v1`, documented from `@ethanel/contracts` (OpenAPI).
- **API keys** for organizations that integrate (issued by `billing-svc`, validated here).
- **All inbound webhooks**: M-Pesa (STK callbacks, C2B confirmations), WhatsApp Cloud API,
  Clerk. Each webhook is verified, persisted to an inbox table, acknowledged fast, then relayed
  to the owning service over its internal `/v1` API with an internal JWT.

Never owns domain logic and never opens a database connection other than its own `gateway`
schema (API keys, webhook inbox, idempotency keys).
