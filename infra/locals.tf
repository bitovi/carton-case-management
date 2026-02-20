# Local values and validation
locals {
  # Current workspace name
  workspace = terraform.workspace

  # Validation: Ensure workspace matches environment variable
  # This prevents accidentally applying production config to staging workspace
  validate_workspace = (
    terraform.workspace == "default" || 
    terraform.workspace == var.environment
  ) ? true : file("ERROR: Workspace '${terraform.workspace}' does not match environment '${var.environment}'. Switch workspace with: terraform workspace select ${var.environment}")
  
  # Common tags that include both workspace and environment
  common_tags = merge(
    var.common_tags,
    {
      Workspace   = terraform.workspace
      Environment = var.environment
    }
  )
}
