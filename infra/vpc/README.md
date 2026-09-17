# infra/vpc — OpenTofu module (placeholder)

VPC with private subnets for EKS nodes, public subnets for the load balancer, NAT per AZ, flow logs on.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
