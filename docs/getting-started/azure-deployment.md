# Azure Deployment Guide

## Prerequisites
- Azure account with active subscription
- Azure CLI installed
- Node.js environment

## Setup Azure Resources

### 1. Azure App Service Setup
```bash
# Login to Azure
az login

# Create resource group
az group create --name nebula-saas-rg --location eastus

# Create App Service plan
az appservice plan create --name nebula-saas-plan --resource-group nebula-saas-rg --sku B1

# Create web app
az webapp create --name your-app-name --resource-group nebula-saas-rg --plan nebula-saas-plan
```

### 2. Environment Configuration
1. Configure application settings:
```bash
az webapp config appsettings set --resource-group nebula-saas-rg --name your-app-name --settings WEBSITE_NODE_DEFAULT_VERSION=18.x
```

2. Set up environment variables through Azure Portal:
- Navigate to your App Service
- Go to Settings > Configuration
- Add necessary environment variables

## Deployment Methods

### 1. Azure DevOps Pipeline
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: |
    npm install
    npm run build
  displayName: 'npm install and build'

- task: AzureWebApp@1
  inputs:
    azureSubscription: 'Your-Azure-Subscription'
    appName: 'your-app-name'
    package: '.'
```

### 2. GitHub Actions Deployment
```yaml
name: Azure Deployment

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: npm install and build
      run: |
        npm install
        npm run build
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'your-app-name'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: '.'
```

## Monitoring and Logging

### 1. Application Insights
1. Create Application Insights resource:
```bash
az monitor app-insights component create --app your-insights-name --location eastus --resource-group nebula-saas-rg
```

2. Add instrumentation key to your application

### 2. Log Analytics
- Enable Log Analytics workspace
- Configure diagnostic settings

## Security Configuration

### 1. SSL/TLS Configuration
- Enable HTTPS Only
- Configure minimum TLS version

### 2. Network Security
- Configure network access restrictions
- Set up Azure Front Door (optional)

## Scaling Configuration

### 1. Auto-scaling Rules
```bash
az monitor autoscale create --resource-group nebula-saas-rg --name autoscale-settings --resource your-app-name --min-count 1 --max-count 5 --count 1
```

### 2. Performance Optimization
- Enable compression
- Configure caching rules
- Set up CDN

## Backup and Disaster Recovery

### 1. Backup Configuration
- Configure automated backups
- Set retention policies

### 2. Disaster Recovery
- Set up geo-replication
- Configure failover settings

## Troubleshooting

### Common Issues
1. Deployment failures
   - Check deployment logs
   - Verify build configuration

2. Performance issues
   - Monitor Application Insights
   - Check resource utilization

### Support Resources
- Azure Documentation
- Azure Support Portal
- Community Forums