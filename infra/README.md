# Infra Bicep

This folder contains a Bicep template (`main.bicep`) and a sample parameters file (`parameters.json`) to create an Azure App Service Plan (Linux), a Linux Web App with a system-assigned identity, and assign `AcrPull` role on an existing Azure Container Registry.

## Files
- `main.bicep` - Bicep template to create the App Service Plan, Web App, and role assignment.
- `parameters.json` - Sample parameters file. Update values before deploying.

## Prerequisites
- Azure CLI installed and logged in (`az login`).
- The target resource group already exists.
- An Azure Container Registry (ACR) exists and is accessible.

## Deploy using Azure CLI
1. Update `parameters.json` values to match your environment (resource group, ACR name, web app name, plan name, location).

2. Deploy the Bicep template:

```bash
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file infra/main.bicep \
  --parameters @infra/parameters.json
```

This will:
- Create an App Service Plan (Linux)
- Create a Linux Web App with a system-assigned managed identity
- Assign `AcrPull` role to the Web App identity for the specified ACR

## Using the GitHub Actions workflow
The repository includes `.github/workflows/deploy-azure.yml`, which will:
1. Deploy the Bicep template into the specified resource group
2. Build and push container images to ACR
3. Generate a `deploy-compose.yml` referencing the pushed images
4. Configure the Web App to use the compose file and restart it

Secrets required in GitHub repository settings:
- `AZURE_CREDENTIALS`: Service principal JSON for `azure/login` action
- `RESOURCE_GROUP`: Resource group name
- `WEBAPP_NAME`: Web App name
- `APP_SERVICE_PLAN`: App Service Plan name
- `LOCATION`: Azure location (e.g., `eastus`)
- `ACR_NAME`: ACR resource name
- `ACR_LOGIN_SERVER`: ACR login server (e.g., `myregistry.azurecr.io`)
- Optional (for credentials variant): `ACR_USERNAME`, `ACR_PASSWORD`

## Notes
- The Bicep template references an existing ACR by name. Do not enable anonymous pulls for the registry.
- Consider using a dedicated resource group for infra resources and least-privilege service principal for CI/CD.
- For production, consider a higher App Service SKU than `B1` and enable diagnostic logging.
