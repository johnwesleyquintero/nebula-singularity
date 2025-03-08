# Google Cloud Platform Deployment Guide

## Prerequisites
- Google Cloud Platform account
- Google Cloud SDK installed
- Node.js environment

## Setup GCP Resources

### 1. Initial Setup
```bash
# Initialize Google Cloud SDK
gcloud init

# Set project ID
gcloud config set project your-project-id

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### 2. Environment Configuration
1. Set up environment variables:
```bash
gcloud secrets create NEXT_PUBLIC_API_URL --data-file=".env.production"
```

2. Configure service account:
```bash
gcloud iam service-accounts create nebula-saas-sa
gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:nebula-saas-sa@your-project-id.iam.gserviceaccount.com" \
    --role="roles/run.invoker"
```

## Deployment Methods

### 1. Cloud Run Deployment
```bash
# Build container
gcloud builds submit --tag gcr.io/your-project-id/nebula-saas

# Deploy to Cloud Run
gcloud run deploy nebula-saas \
    --image gcr.io/your-project-id/nebula-saas \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### 2. Cloud Build with GitHub
```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['install']

  # Run tests
  - name: 'node:18'
    entrypoint: npm
    args: ['test']

  # Build the application
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']

  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/nebula-saas', '.']

  # Push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/nebula-saas']

  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'nebula-saas'
      - '--image'
      - 'gcr.io/$PROJECT_ID/nebula-saas'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
```

## Monitoring and Logging

### 1. Cloud Monitoring
1. Set up monitoring:
```bash
gcloud monitoring dashboards create --config-from-file=dashboard.json
```

2. Configure alerts:
```bash
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

### 2. Cloud Logging
- Enable Cloud Logging API
- Configure log exports to BigQuery/Cloud Storage
- Set up log-based metrics

## Security Configuration

### 1. Cloud Armor (WAF)
```bash
gcloud compute security-policies create nebula-saas-policy
gcloud compute security-policies rules create 1000 \
    --security-policy nebula-saas-policy \
    --expression="evaluatePreconfiguredExpr('xss-stable')" \
    --action="deny-403"
```

### 2. Identity and Access Management
- Configure service accounts
- Set up Cloud KMS for secrets
- Enable Cloud Identity-Aware Proxy

## Scaling Configuration

### 1. Auto-scaling Settings
```bash
gcloud run services update nebula-saas \
    --min-instances=1 \
    --max-instances=10 \
    --concurrency=80
```

### 2. Load Balancing
- Set up Cloud Load Balancing
- Configure CDN
- Enable Cloud CDN

## Backup and Disaster Recovery

### 1. Backup Strategy
- Configure Cloud Storage buckets for backups
- Set up scheduled backups
- Implement backup rotation

### 2. Disaster Recovery
- Configure multi-region deployment
- Set up failover procedures
- Test recovery processes

## Cost Optimization

### 1. Resource Management
- Set up budget alerts
- Configure auto-scaling policies
- Implement resource cleanup

### 2. Cost Monitoring
- Enable detailed billing export
- Set up cost allocation tags
- Monitor resource utilization

## Troubleshooting

### Common Issues
1. Deployment failures
   - Check Cloud Build logs
   - Verify container configuration
   - Check IAM permissions

2. Performance issues
   - Monitor Cloud Trace
   - Check Cloud Profiler
   - Analyze Cloud Monitoring metrics

### Support Resources
- GCP Documentation
- Cloud Support
- GCP Community Forums