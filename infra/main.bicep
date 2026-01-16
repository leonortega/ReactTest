@description('Name of the Web App to create')
param webAppName string

@description('Name of the App Service Plan to create')
param appServicePlanName string

@description('Azure location for resources')
param location string = resourceGroup().location

@description('Name of an existing Azure Container Registry')
param acrName string

// Reference existing ACR
resource acr 'Microsoft.ContainerRegistry/registries@2022-02-01' existing = {
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
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(web.id, acr.id, 'AcrPull')
  scope: acr
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: web.identity.principalId
  }
}

output webAppPrincipalId string = web.identity.principalId
