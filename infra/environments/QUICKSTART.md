# Environment Deployment Quick Reference

## � Initial Setup (One Time)

```bash
cd infra

# Initialize Terraform
terraform init

# Create workspaces (optional but recommended)
terraform workspace new production
terraform workspace new staging

# Verify workspaces
terraform workspace list
```

## 🚀 Staging Deployment

```bash
cd infra

# Manual (remember to switch workspace first)
terraform workspace select staging
terraform plan -var-file="environments/staging/staging.tfvars"
terraform apply -var-file="environments/staging/staging.tfvars"

# Show outputs
terraform output
```

## 🏭 Production Deployment

```bash
cd infra

# Manual (remember to switch workspace first)
terraform workspace select production
terraform plan -var-file="environments/production/production.tfvars"
terraform apply -var-file="environments/production/production.tfvars"

# Show outputs
terraform output
```

## 🔍 Check Current Workspace

Always verify which workspace you're in:

```bash
# Show current workspace
terraform workspace show

# List all workspaces (* indicates current)
terraform workspace list
```

## 🔄 Update ECS Service Only

Force new deployment (e.g., after pushing new image):

```bash
# Staging
terraform apply -var-file="environments/staging/staging.tfvars" \
  -target=aws_ecs_service.main

# Production
terraform apply -var-file="environments/production/production.tfvars" \
  -target=aws_ecs_service.main
```

## 📋 View Resources

```bash
# List all resources
terraform state list

# Show specific resource details
terraform state show aws_ecs_service.main
terraform state show aws_lb.main

# Show outputs
terraform output
```

## 🧹 Cleanup

```bash
# Destroy staging
terraform destroy -var-file="environments/staging/staging.tfvars"

# Destroy production
terraform destroy -var-file="environments/production/production.tfvars"
```

## 🔍 Troubleshooting

```bash
# Validate configuration
terraform validate

# Format configuration files
terraform fmt

# Refresh state
terraform refresh -var-file="environments/staging/staging.tfvars"

# Show plan in detail
terraform plan -var-file="environments/staging/staging.tfvars" -out=tfplan
terraform show tfplan
```
