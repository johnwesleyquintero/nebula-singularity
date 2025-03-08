# API Authentication

## Overview

Nebula Suite uses JWT (JSON Web Tokens) for API authentication. This guide explains how to authenticate your requests and manage API tokens.

## Authentication Methods

### Bearer Token Authentication

```http
GET /api/v1/resource
Authorization: Bearer your-token-here
```

### API Key Authentication

```http
GET /api/v1/resource
X-API-Key: your-api-key-here
```

## Getting Access Tokens

1. **Via Dashboard**:
   - Navigate to Settings > API Keys
   - Click "Generate New Token"
   - Copy and securely store your token

2. **Via Authentication API**:

```http
POST /api/v1/auth/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "access_token": "your-jwt-token",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Token Management

### Token Expiration
- Access tokens expire after 1 hour
- Refresh tokens expire after 30 days

### Refreshing Tokens

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

## Security Best Practices

1. **Store Tokens Securely**
   - Never expose tokens in client-side code
   - Use secure storage methods

2. **Token Rotation**
   - Regularly rotate API keys
   - Implement automatic token refresh

3. **Access Control**
   - Use minimum required permissions
   - Regularly audit token usage

## Error Handling

### Common Authentication Errors

```json
{
  "error": "invalid_token",
  "message": "Token has expired",
  "status": 401
}
```

| Error Code | Description |
|------------|-------------|
| 401        | Invalid or expired token |
| 403        | Insufficient permissions |

## Rate Limiting

Authenticated requests are subject to rate limiting:
- 1000 requests per hour for authenticated users
- 60 requests per hour for unauthenticated users

For more details, see our [Rate Limiting Guide](./rate-limiting.md).

## Support

For authentication issues:
1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Contact our support team