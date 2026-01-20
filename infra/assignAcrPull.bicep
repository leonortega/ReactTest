@description('Name of the existing ACR')
param acrName string

@description('Principal Id of the Web App system assigned identity')
param webPrincipalId string

resource acr 'Microsoft.ContainerRegistry/registries@2022-02-01' existing = {
  name: acrName
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(acr.id, webPrincipalId, 'AcrPull')
  scope: acr
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: webPrincipalId
  }
}
