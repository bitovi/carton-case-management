# Production Environment Configuration
# To use: terraform plan -var-file="environments/production/production.tfvars"

aws_region   = "us-east-2"
project_name = "carton-case-mgmt"
environment  = "production"

# AWS Credentials (set via environment variables for production)
# export TF_VAR_access_key="your-access-key"
# export TF_VAR_secret_key="your-secret-key"
# export TF_VAR_token="your-session-token"

# Container Image - production tag
container_image = "810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:production"

# SSL Certificate ARN for `carton.bitovi.tools`
ssl_certificate_arn = "arn:aws:acm:us-east-2:810329399955:certificate/6b93cae5-23ed-4846-aa6a-0668d0f1bde5"

# Common tags for all resources
common_tags = {
  Project     = "carton-case-mgmt"
  Environment = "production"
  ManagedBy   = "terraform"
}
