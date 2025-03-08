# Logout Endpoint

## Overview

Invalidate access and refresh tokens to securely log out users.

## Endpoint

```http
POST /auth/logout
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body Parameters

| Parameter    | Type   | Required | Description                 |
|--------------|--------|----------|-----------------------------||
| refreshToken | string | Yes      | Current refresh token       |

### Example Request

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Response

### Success Response (200 OK)

```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

### Error Responses

#### Invalid Token (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Invalid access token"
}
```

#### Missing Token (400 Bad Request)

```json
{
  "status": "error",
  "message": "Refresh token is required"
}
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](../../rate-limiting.md) for details.

## Notes

- Both access token and refresh token will be invalidated
- After logout, tokens cannot be reused
- For security purposes, clients should remove stored tokens