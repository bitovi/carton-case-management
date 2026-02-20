variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "carton-case-mgmt"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.32.127.0/24"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default = [
    "10.32.127.0/28",   # us-east-2a
    "10.32.127.16/28"   # us-east-2b
  ]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default = [
    "10.32.127.128/28", # us-east-2a
    "10.32.127.144/28"  # us-east-2b
  ]
}

variable "availability_zones" {
  description = "Availability zones for subnets"
  type        = list(string)
  default     = ["us-east-2a", "us-east-2b"]
}

variable "container_image" {
  description = "ECR container image URI"
  type        = string
  #default     = "810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:latest"
}

variable "container_cpu" {
  description = "CPU units for container (1024 = 1 vCPU)"
  type        = number
  default     = 1024
}

variable "container_memory" {
  description = "Memory for container in MB"
  type        = number
  default     = 3072
}

variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate for HTTPS listener"
  type        = string
  default     = "arn:aws:acm:us-east-2:810329399955:certificate/6b93cae5-23ed-4846-aa6a-0668d0f1bde5"
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "database_url" {
  description = "Database URL for the application"
  type        = string
  default     = "file:./db/dev.db"
  sensitive   = true
}

variable "access_key" {
  description = "Access key for AWS"
  type        = string
  sensitive   = true
}

variable "secret_key" {
  description = "Secret key for AWS"
  type        = string
  sensitive   = true
}

variable "token" {
  description = "Token for AWS"
  type        = string
  sensitive   = true
}