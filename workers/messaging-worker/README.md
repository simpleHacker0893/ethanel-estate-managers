# messaging-worker — placeholder

pg-boss worker on `@ethanel/chassis`, sharing the `messaging` schema and role with `messaging-svc`.
Separate Deployment so it scales and restarts independently of the request path.

**Does:** drains the messaging-svc outbox: WhatsApp sends with rate limiting, template status sync, delivery receipts.

No HTTP surface except probes. Never called by another service; only consumes its own queue.
