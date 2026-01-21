@description('Name of the Web App to create')
param webAppName string

@description('Name of the App Service Plan to create')
param appServicePlanName string

@description('Azure location for resources')
param location string = resourceGroup().location

// Note: ACR is not created or referenced here to avoid cross-resource-group deployment scope issues.
// If you need to grant the Web App's identity AcrPull on an existing ACR, the CI workflow
// will perform that role assignment after the web app is created.

// App Service Plan (Linux)
resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Web App configured for Linux
resource web 'Microsoft.Web/sites@2022-03-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      // Sidecar-enabled custom containers are designated by linuxFxVersion=sitecontainers
      linuxFxVersion: 'sitecontainers'
    }
  }
}

// Note: role assignment to allow the Web App identity to pull from ACR is
// intentionally not performed in this template to avoid cross-scope deployment
// issues. The CI workflow or an administrator should assign the `AcrPull` role
// to the Web App's system-assigned identity on the ACR resource.

output webAppPrincipalId string = web.identity.principalId
