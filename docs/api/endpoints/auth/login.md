# Login Endpoint

## Overview

The login endpoint authenticates users and provides access tokens for API usage.

## Endpoint

```http
POST /api/v1/auth/token
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
  "email": "user@example.com",
  "password": "your-password"
}
```

### Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| email     | string | Yes      | User's email address |
| password  | string | Yes      | User's password |

## Response

### Success Response

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

## Error Codes

| Code                | Status | Description |
|---------------------|---------|-------------|
| INVALID_CREDENTIALS | 401     | Invalid email or password |
| ACCOUNT_LOCKED      | 403     | Account is locked due to too many failed attempts |
| VALIDATION_ERROR    | 400     | Invalid request parameters |

## Example

### cURL

```bash
curl -X POST https://api.nebulasuite.com/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

### JavaScript

```javascript
const response = await fetch('https://api.nebulasuite.com/v1/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'your-password'
  })
});

const data = await response.json();
```

## Notes

- Tokens expire after 1 hour
- Use the refresh token endpoint to obtain a new access token
- Rate limiting applies to failed login attempts