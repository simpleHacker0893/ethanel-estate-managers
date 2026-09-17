# infra/eks-auto — variables only in Sprint 001. Resources arrive in Sprint 002.

variable "environment" {
  description = "staging | production"
  type        = string
}

variable "cluster_name" { type = string }
variable "kubernetes_version" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
