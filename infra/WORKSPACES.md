# Terraform Workspaces Implementation Guide

## Overview

Terraform workspaces provide state isolation for different environments. Each workspace maintains its own `terraform.tfstate` file, preventing accidental cross-environment changes.

## Workspace Structure

```
infra/
├── terraform.tfstate.d/
│   ├── production/
│   │   └── terraform.tfstate     # Production state
│   └── staging/
│       └── terraform.tfstate     # Staging state
└── terraform.tfstate              # Default workspace (unused)
```

## Quick Reference

### Common Workspace Commands

```bash
# List all workspaces (* indicates current)
terraform workspace list

# Show current workspace
terraform workspace show

# Create new workspace
terraform workspace new production
terraform workspace new staging

# Switch workspace
terraform workspace select production
terraform workspace select staging

# Delete workspace (must be empty and not current)
terraform workspace delete <name>
```

## Initial Setup (One-Time)

### Step 1: Create Workspaces

```bash
cd infra

# Create production workspace
terraform workspace new production

# Create staging workspace  
terraform workspace new staging

# Verify workspaces
terraform workspace list
```

### Step 2: Deploy Each Environment

Once workspaces are set up:

```bash
# Deploy Staging
terraform workspace select staging
terraform plan -var-file="environments/staging/staging.tfvars"
terraform apply -var-file="environments/staging/staging.tfvars"

# Deploy Production
terraform workspace select production
terraform plan -var-file="environments/production/production.tfvars"
terraform apply -var-file="environments/production/production.tfvars"
```

## Daily Usage

```bash
# Always remember to select the correct workspace first!
terraform workspace select staging
terraform plan -var-file="environments/staging/staging.tfvars"
terraform apply -var-file="environments/staging/staging.tfvars"

terraform workspace select production
terraform plan -var-file="environments/production/production.tfvars"
terraform apply -var-file="environments/production/production.tfvars"
```
