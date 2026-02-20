terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "bitovi-carton-tf-state"
    key    = "terraform.tfstate"
    region = "us-east-2"
  }
}

provider "aws" {
  region = var.aws_region
  access_key = var.access_key
  secret_key = var.secret_key
  token = var.token
  default_tags {
    tags = var.common_tags
  }
}
