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
      // A placeholder container image; will be replaced when deploying the compose file
      linuxFxVersion: 'DOCKER|mcr.microsoft.com/azure-app-service/static:latest'
    }
  }
}

// Assign AcrPull to the Web App's system assigned identity so App Service can pull images from the ACR
// This operation targets the ACR's resource group scope, so we implement it via a module
module assignAcrPull 'assignAcrPull.bicep' = {
  name: 'assignAcrPull'
  scope: resourceGroup(acrResourceGroup)
  params: {
    acrName: acrName
    webPrincipalId: web.identity.principalId
  }
  dependsOn: [
    web
  ]
}

output webAppPrincipalId string = web.identity.principalId
