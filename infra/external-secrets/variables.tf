# infra/external-secrets — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "cluster_name" { type = string }
variable "namespace" { type = string }
