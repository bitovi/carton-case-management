# Multi-Environment Terraform Configuration

This infrastructure supports multiple environments (production and staging) that share common networking resources while maintaining separate application resources.

## Architecture Overview

### Shared Resources (Across All Environments)
- **VPC** (10.32.127.0/24)
- **Subnets** (2 public + 2 private across 2 AZs)
- **NAT Gateway** and **Internet Gateway**
- **ECS Cluster** (carton-case-management-cluster)
- **Security Groups** (ALB, ECS Tasks, EFS)
- **EFS File System** (app-data)
- **IAM Roles** (ECS Task Execution, Infrastructure)
- **ECR Repository**

### Environment-Specific Resources
- **Application Load Balancer** (ALB)
- **Target Group**
- **ALB Listeners** (HTTP/HTTPS)
- **ECS Service**
- **ECS Task Definition**
- **CloudWatch Log Group**
- **SSL Certificate** (via variable)
- **Container Image Tag**

## Directory Structure

```
infra/
├── environments/
│   ├── production/
│   │   └── production.tfvars    # Production-specific values
│   └── staging/
│       └── staging.tfvars        # Staging-specific values
├── *.tf                          # Terraform resource definitions
├── terraform.tfvars              # Default/local values (not for prod/staging)
└── README-ENVIRONMENTS.md        # This file
```

## Usage

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform installed (>= 1.0)
3. Separate SSL certificates created in ACM for production and staging
4. Container images tagged and pushed to ECR with environment-specific tags

### Setup Workspaces (Recommended - One Time)

Terraform workspaces provide state isolation between environments:

```bash
cd infra

# Run the setup script
./setup-workspaces.sh

# Or manually:
terraform init
terraform workspace new production
terraform workspace new staging
```

See [WORKSPACES.md](WORKSPACES.md) for detailed workspace documentation.

### Setup AWS Credentials

**Option 1: Environment Variables (Recommended for CI/CD)**
```bash
export TF_VARS_access_key="your-access-key"
export TF_VARS_secret_key="your-secret-key"
export TF_VARS_token="your-session-token"  # if using temporary credentials
```

**Option 2: AWS CLI Profile**
```bash
export AWS_PROFILE=your-profile-name
```

### Initialize Terraform (One Time)

```bash
cd infra
terraform init
```

### Deploy Staging Environment

**Manual deployment:**
```bash
terraform workspace select staging
terraform plan -var-file="environments/staging/staging.tfvars"
terraform apply -var-file="environments/staging/staging.tfvars"
```

### Deploy Production Environment

**Manual deployment:**
```bash
terraform workspace select production
terraform plan -var-file="environments/production/production.tfvars"
terraform apply -var-file="environments/production/production.tfvars"
```

### Check Current Workspace

Always verify which workspace you're in before running commands:

```bash
# Show current workspace
terraform workspace show

# List all workspaces (* indicates current)
terraform workspace list
```

For complete workspace documentation, see [WORKSPACES.md](WORKSPACES.md).

## Configuration Guide

### Environment Variables to Update

Edit the appropriate `.tfvars` file for your environment:

#### Production ([production.tfvars](environments/production/production.tfvars))
- `container_image`: Update to `...app:production` tag
- `ssl_certificate_arn`: Production SSL certificate ARN

#### Staging ([staging.tfvars](environments/staging/staging.tfvars))
- `container_image`: Update to `...app:staging` tag
- `ssl_certificate_arn`: Staging SSL certificate ARN

### Required SSL Certificates

Create SSL certificates in ACM for each environment:
- Production: `carton.bitovi.tools`
- Staging: `carton-staging.bitovi.tools`

Update the `ssl_certificate_arn` in each `.tfvars` file.

### Container Images

Tag and push images to ECR:
```bash
# Staging
docker tag your-image:latest 810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:staging
docker push 810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:staging

# Production
docker tag your-image:latest 810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:production
docker push 810329399955.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:production
```

## Deployment Workflow

### Initial Setup (First Time)

1. **Deploy shared infrastructure** (can use staging environment first):
   ```bash
   terraform apply -var-file="environments/staging/staging.tfvars"
   ```

2. **Deploy production** (shared resources already exist, only creates environment-specific):
   ```bash
   terraform apply -var-file="environments/production/production.tfvars"
   ```

### Updating an Environment

To update only staging:
```bash
terraform apply -var-file="environments/staging/staging.tfvars" -target=aws_ecs_service.main
```

To update only production:
```bash
terraform apply -var-file="environments/production/production.tfvars" -target=aws_ecs_service.main
```

### Rolling Back

Force new deployment with previous image:
```bash
# Update the container_image in the .tfvars file to the previous tag
terraform apply -var-file="environments/staging/staging.tfvars"
```

## Troubleshooting

### Workspace Mismatch Error

If you see: `ERROR: Workspace 'production' does not match environment 'staging'`

**Solution:**
```bash
# Switch to the correct workspace
terraform workspace select staging
```

### View Current State

```bash
# List all resources
terraform state list

# Show specific resource
terraform state show aws_ecs_service.main
```
