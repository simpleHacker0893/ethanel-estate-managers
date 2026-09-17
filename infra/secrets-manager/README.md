# infra/secrets-manager — OpenTofu module (placeholder)

AWS Secrets Manager entries for every runtime secret (Neon connection strings, Clerk, M-Pesa, WhatsApp, internal JWT key). Values are never in code.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
