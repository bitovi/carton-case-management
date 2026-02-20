# Staging Environment Configuration
# To use: terraform plan -var-file="environments/staging/staging.tfvars"

aws_region   = "us-east-2"
project_name = "carton-case-mgmt"
environment  = "staging"

# AWS Credentials (set via environment variables for staging)
# export TF_VAR_access_key="your-access-key"
# export TF_VAR_secret_key="your-secret-key"
# export TF_VAR_token="your-session-token"

# Container Image - staging tag
container_image = "810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:staging"

# SSL Certificate ARN for `carton-staging.bitovi.tools`
ssl_certificate_arn = "arn:aws:acm:us-east-2:810329399955:certificate/2f12babe-6961-41a5-bd5e-61f3eb97bcc0"

# Common tags for all resources
common_tags = {
  Project     = "carton-case-mgmt"
  Environment = "staging"
  ManagedBy   = "terraform"
}
