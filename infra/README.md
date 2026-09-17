# infra/ — OpenTofu

Modules, one folder each: `vpc`, `eks-auto`, `ecr`, `neon`, `secrets-manager`,
`external-secrets`, `cloudflare`. Sprint 001 fixes the module boundaries and variables; nothing is
applied. Sprint 002 adds the root stacks (`envs/staging`, `envs/production`), remote state and the
first apply.

Principles: one Neon project per environment; secrets live in Secrets Manager and reach pods via
External Secrets; Cloudflare fronts both hostnames; images live in ECR with scan-on-push; EKS Auto
Mode so no node groups are managed by hand.
