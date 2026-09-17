# infra/secrets-manager — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "secret_names" { type = list(string) }
variable "kms_key_arn" { type = string }
