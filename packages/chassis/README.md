# @ethanel/chassis

The runtime every Fastify service and worker is built on. One import gives a service its config,
logger, telemetry, probes, graceful shutdown, error envelope, internal JWT, job queue and a Prisma
client that refuses to run a tenant query outside an `organization_id` scope.

**Sprint 001**: module surface only. Every function throws `NotImplementedError`.
**Sprint 002**: implementation, with `identity-svc` as the first consumer.

| Module         | Owns                                                                                |
| -------------- | ----------------------------------------------------------------------------------- |
| `ids`          | UUIDv7 primary keys generated in application code                                   |
| `config`       | zod-validated env, read once at boot                                                |
| `logger`       | pino JSON logs with `service`, `organization_id`, `trace_id`                        |
| `otel`         | OpenTelemetry traces + metrics over OTLP                                            |
| `probes`       | `/healthz`, `/readyz`, `/startupz`                                                  |
| `shutdown`     | SIGTERM drain within the 30s grace period                                           |
| `errors`       | `{ error: { code, message, details?, traceId? } }` envelope                         |
| `internal-jwt` | short-lived service-to-service tokens carrying `organization_id`                    |
| `jobs`         | pg-boss in the service's own schema, fed by the transactional outbox                |
| `db`           | Prisma base client; `withOrganization()` sets `app.organization_id` per transaction |
