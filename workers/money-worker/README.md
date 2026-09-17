# money-worker — placeholder

pg-boss worker on `@ethanel/chassis`, sharing the `money` schema and role with `money-svc`.
Separate Deployment so it scales and restarts independently of the request path.

**Does:** drains the money-svc outbox: month-end rent due postings, remittance schedules, statement generation triggers.

No HTTP surface except probes. Never called by another service; only consumes its own queue.
