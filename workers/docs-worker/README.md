# docs-worker — placeholder

pg-boss worker on `@ethanel/chassis`, sharing the `docs` schema and role with `docs-svc`.
Separate Deployment so it scales and restarts independently of the request path.

**Does:** drains the docs-svc outbox: PDF statement and receipt rendering, Excel export jobs, storage uploads.

No HTTP surface except probes. Never called by another service; only consumes its own queue.
