# Get User Profile Endpoint

## Overview

Retrieve the profile information for the currently authenticated user.

## Endpoint

```http
GET /users/profile
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Parameters

None

### Example Request

```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "id": "usr_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Inc",
    "role": "admin",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Error Responses

#### Unauthorized (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Invalid or expired access token"
}
```

#### User Not Found (404 Not Found)

```json
{
  "status": "error",
  "message": "User profile not found"
}
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](../../rate-limiting.md) for details.

## Notes

- Requires a valid access token
- Returns the complete profile information for the authenticated user
- Sensitive information like password hashes are never returned