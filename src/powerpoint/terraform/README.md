# Terraform Infrastructure for PowerPoint Cloud Architect Add-in

This directory contains Terraform configuration to deploy the PowerPoint Add-in to Azure Static Web Apps.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Azure subscription

## Setup

### 1. Login to Azure

```bash
az login
az account set --subscription <subscription-id>
```

### 2. Initialize Terraform

```bash
terraform init
```

## Deployment

### Plan

Preview changes before applying:

```bash
terraform plan
```

### Apply

Create/update infrastructure:

```bash
terraform apply
```

Terraform will prompt for confirmation. Type `yes` to proceed.

### Destroy

Remove all resources:

```bash
terraform destroy
```

## Resources Created

- **Resource Group**: `rg-{codename}-{suffix}`
- **Static Web App**: `swa-{codename}-{suffix}`

## Outputs

After successful deployment, Terraform outputs:

| Output | Description |
|--------|-------------|
| `resource_group_name` | Azure Resource Group name |
| `static_web_app_name` | Static Web App name |
| `static_web_app_url` | Public URL of the Static Web App |
| `static_web_app_api_key` | Deployment token (sensitive) |
| `project_suffix` | Random suffix for resource naming |

### Get Outputs

```bash
# Get all outputs
terraform output

# Get specific output
terraform output static_web_app_url

# Get sensitive output
terraform output -raw static_web_app_api_key
```

## Variables

### Default Values

| Variable | Default | Description |
|----------|---------|-------------|
| `codename` | `pptcloudarch` | Project codename |
| `location` | `East Asia` | Azure region |
| `swa_location` | `East Asia` | Static Web App location |
| `environment` | `production` | Environment name |
| `sku_tier` | `Free` | Static Web App SKU tier |
| `sku_size` | `Free` | Static Web App SKU size |

### Override Variables

Create `terraform.tfvars`:

```hcl
codename    = "myproject"
location    = "West US"
environment = "development"
```

Or pass via command line:

```bash
terraform apply -var="codename=myproject"
```

## Static Web App SKUs

### Free Tier
- **Bandwidth**: 100 GB/month
- **Custom domains**: Not supported
- **SSL**: Automatic
- **API**: Not supported
- **Cost**: Free

### Standard Tier
- **Bandwidth**: Unlimited
- **Custom domains**: Supported
- **SSL**: Automatic
- **API**: Supported
- **Cost**: Pay per usage

To use Standard tier:

```hcl
sku_tier = "Standard"
sku_size = "Standard"
```

## Deployment After Infrastructure

Once infrastructure is created, deploy the application:

### Get Deployment Token

```bash
export DEPLOYMENT_TOKEN=$(terraform output -raw static_web_app_api_key)
```

### Deploy with SWA CLI

```bash
cd ..
npm install -g @azure/static-web-apps-cli
swa deploy \
  --app-location . \
  --output-location . \
  --deployment-token $DEPLOYMENT_TOKEN
```

### Update Manifest

Update `manifest.xml` with the Static Web App URL:

```bash
WEBAPP_URL=$(terraform output -raw static_web_app_url)
echo "Update manifest.xml with: https://$WEBAPP_URL"
```

## State Management

### Local State (Default)

Terraform state is stored locally in `terraform.tfstate`.

**Warning**: Do not commit `terraform.tfstate` to version control!

### Remote State (Recommended for Teams)

Use Azure Storage for remote state:

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstate"
    container_name       = "tfstate"
    key                  = "powerpoint-cloudarchitect.tfstate"
  }
}
```

Setup:

```bash
# Create storage account
az group create --name terraform-state-rg --location eastasia
az storage account create --name tfstate --resource-group terraform-state-rg --location eastasia --sku Standard_LRS
az storage container create --name tfstate --account-name tfstate
```

## Troubleshooting

### Error: Resource Already Exists

```
Error: A resource with the ID already exists
```

**Solution**: Import existing resource or use a different codename/suffix.

### Error: Quota Exceeded

```
Error: Quota exceeded for Static Web Apps
```

**Solution**: Check subscription limits or delete unused Static Web Apps.

### Error: Authentication Failed

```
Error: building account: could not acquire access token
```

**Solution**: Run `az login` and ensure correct subscription is selected.

## Best Practices

1. **Use Remote State**: For team collaboration
2. **Use Variables**: Keep configuration flexible
3. **Tag Resources**: For cost tracking and organization
4. **Use Workspaces**: For multiple environments
5. **Lock State**: Prevent concurrent modifications
6. **Review Plans**: Always review before applying

## Workspaces (Multiple Environments)

```bash
# Create development workspace
terraform workspace new development

# Switch to development
terraform workspace select development

# Apply with different variables
terraform apply -var="environment=development"

# List workspaces
terraform workspace list
```

## Cost Estimation

Before deployment, estimate costs:

```bash
terraform plan -out=plan.tfplan
terraform show -json plan.tfplan | jq '.planned_values.root_module.resources'
```

**Free Tier**: $0/month (with limits)
**Standard Tier**: ~$9/month + bandwidth costs

## Cleanup

Remove all resources:

```bash
terraform destroy -auto-approve
```

## Support

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
