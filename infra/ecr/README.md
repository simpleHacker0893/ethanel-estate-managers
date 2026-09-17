# infra/ecr — OpenTofu module (placeholder)

One ECR repository per image (web, gateway, each service and worker) with scan-on-push and a lifecycle policy keeping the last 30 tags.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
