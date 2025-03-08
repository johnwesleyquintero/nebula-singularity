# Refresh Token Endpoint

## Overview

The refresh token endpoint allows you to obtain a new access token using a valid refresh token.

## Endpoint

```http
POST /api/v1/auth/refresh
```

## Authentication

No authentication required.

## Request

### Headers

```http
Content-Type: application/json
```

### Body

```json
{
  "refresh_token": "your-refresh-token-here"
}
```

### Parameters

| Parameter     | Type   | Required | Description |
|--------------|--------|----------|-------------|
| refresh_token| string | Yes      | Valid refresh token obtained from login |

## Response

### Success Response

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Invalid or expired refresh token"
  }
}
```

## Error Codes

| Code                  | Status | Description |
|-----------------------|---------|-------------|
| INVALID_REFRESH_TOKEN | 401     | Invalid or expired refresh token |
| TOKEN_REVOKED         | 401     | Token has been revoked |
| VALIDATION_ERROR      | 400     | Invalid request parameters |

## Example

### cURL

```bash
curl -X POST https://api.nebulasuite.com/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your-refresh-token-here"
  }'
```

### JavaScript

```javascript
const response = await fetch('https://api.nebulasuite.com/v1/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refresh_token: 'your-refresh-token-here'
  })
});

const data = await response.json();
```

## Notes

- New access tokens are valid for 1 hour
- Refresh tokens are valid for 30 days
- A refresh token can only be used once
- Using a refresh token automatically invalidates the previous access token