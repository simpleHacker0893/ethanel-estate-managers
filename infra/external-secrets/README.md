# infra/external-secrets — OpenTofu module (placeholder)

External Secrets Operator on the cluster with a ClusterSecretStore backed by Secrets Manager via Pod Identity.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
