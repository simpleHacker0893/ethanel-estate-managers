# payments-worker — placeholder

pg-boss worker on `@ethanel/chassis`, sharing the `payments` schema and role with `payments-svc`.
Separate Deployment so it scales and restarts independently of the request path.

**Does:** drains the payments-svc outbox: STK push retries, reconciliation sweeps, payout batches.

No HTTP surface except probes. Never called by another service; only consumes its own queue.
