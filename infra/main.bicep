@description('Name of the Web App to create')
param webAppName string

@description('Name of the App Service Plan to create')
param appServicePlanName string

@description('Azure location for resources')
param location string = resourceGroup().location

@description('Name of an existing Azure Container Registry')
param acrName string

@description('Resource group where the existing ACR lives (defaults to the current resource group)')
param acrResourceGroup string = resourceGroup().name

// Reference existing ACR
// Reference existing ACR (explicit resource group scope)
resource acr 'Microsoft.ContainerRegistry/registries@2022-02-01' existing = {
  scope: resourceGroup(acrResourceGroup)
  name: acrName
}

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
