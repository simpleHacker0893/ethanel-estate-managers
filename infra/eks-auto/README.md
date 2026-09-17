# infra/eks-auto — OpenTofu module (placeholder)

EKS cluster in Auto Mode: managed node capacity, Pod Identity, KMS-encrypted secrets, control-plane logs shipped.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
