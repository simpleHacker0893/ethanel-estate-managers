# infra/ecr — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "repositories" { type = list(string) }
