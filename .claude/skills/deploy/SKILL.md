---
name: deploy
description: "Deploy carton-case-management to AWS using Terraform and Docker/ECR. Use when asked to: deploy, deploy to staging, deploy to production, push to AWS, release the app, update the live environment, roll back a deployment, or run Terraform. Covers building and pushing Docker images to ECR and applying Terraform infrastructure changes."
argument-hint: "Where do you want to deploy? (e.g. staging, production, roll back staging)"
---

# Deploy

Deployments use Docker images pushed to AWS ECR, with infrastructure managed by Terraform workspaces.

## Before You Begin

Use the `vscode_askQuestions` tool to ask the user for their AWS account ID if it is not already known:

- **header:** `aws_account_id`
- **question:** "What is your AWS account ID? (12-digit number, e.g. 123456789012)"

Store the response as `AWS_ACCOUNT_ID` and substitute it wherever `${AWS_ACCOUNT_ID}` appears in the commands below.

**ECR repository:** `${AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app`

## Prerequisites

- AWS CLI configured with credentials (`AWS_PROFILE` or `TF_VARS_access_key` env vars)
- Terraform >= 1.0 installed
- Docker available

## Build and Push Docker Image

### Staging
```
docker build -t carton-case-management-app:staging .
docker tag carton-case-management-app:staging ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:staging
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:staging
```

### Production
```
docker build -t carton-case-management-app:production .
docker tag carton-case-management-app:production ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:production
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/carton-case-management-app:production
```

## Deploy with Terraform

All Terraform commands run from the `infra/` directory.

### Always verify your workspace first
```
cd infra
terraform workspace show
```

### Deploy to Staging
```
cd infra
terraform workspace select staging
terraform plan -var-file="environments/staging/staging.tfvars"
terraform apply -var-file="environments/staging/staging.tfvars"
```

### Deploy to Production
```
cd infra
terraform workspace select production
terraform plan -var-file="environments/production/production.tfvars"
terraform apply -var-file="environments/production/production.tfvars"
```

**Always run `terraform plan` and review the output before `terraform apply`.**

## Rolling Back

Update the `container_image` in the appropriate `.tfvars` file to the previous image tag, then reapply:

```
cd infra
terraform workspace select staging   # or production
terraform apply -var-file="environments/staging/staging.tfvars"
```

## Updating Only the ECS Service

To redeploy just the app container without touching other infrastructure:

```
terraform apply -var-file="environments/staging/staging.tfvars" -target=aws_ecs_service.main
```

## Troubleshooting

### Check current workspace
```
terraform workspace list
```

### View deployed resources
```
terraform state list
terraform state show aws_ecs_service.main
```

### Workspace mismatch error
If you see `ERROR: Workspace does not match environment`, switch to the correct workspace:
```
terraform workspace select <staging|production>
```
