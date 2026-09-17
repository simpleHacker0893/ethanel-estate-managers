# infra/cloudflare — OpenTofu module (placeholder)

DNS zone, proxied records for the web and gateway hostnames, WAF managed rules, rate limiting on /v1 and the webhook paths, origin certificate.

Sprint 001 declares the module boundary and its variables only. Apply happens in Sprint 002 with
a remote state backend (S3 + DynamoDB lock) and one workspace per environment.
