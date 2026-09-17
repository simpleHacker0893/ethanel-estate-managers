# infra/neon — OpenTofu module (placeholder)

One Neon project per environment; one branch per preview when enabled; roles and databases are created by the db migration runner, not here.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
