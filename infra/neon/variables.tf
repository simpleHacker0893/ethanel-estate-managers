# infra/neon — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "project_name" { type = string }
variable "region_id" { type = string }
variable "pg_version" { type = number }
