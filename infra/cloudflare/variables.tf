# infra/cloudflare — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "zone" { type = string }
variable "web_hostname" { type = string }
variable "gateway_hostname" { type = string }
