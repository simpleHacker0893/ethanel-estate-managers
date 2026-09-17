# infra/vpc — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "cidr_block" { type = string }
variable "azs" { type = list(string) }
