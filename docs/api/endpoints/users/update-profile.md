# Update User Profile Endpoint

## Overview

Update the profile information for the currently authenticated user.

## Endpoint

```http
PUT /users/profile
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body Parameters

| Parameter  | Type   | Required | Description                 |
|------------|--------|----------|-----------------------------||
| firstName  | string | No       | User's first name          |
| lastName   | string | No       | User's last name           |
| company    | string | No       | User's company name        |

### Example Request

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "company": "New Company Inc"
}
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
    "lastName": "Smith",
    "company": "New Company Inc",
    "role": "admin",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
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

#### Invalid Request Format (400 Bad Request)

```json
{
  "status": "error",
  "message": "Invalid request format",
  "errors": [
    {
      "field": "firstName",
      "message": "First name must be between 2 and 50 characters"
    }
  ]
}
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](../../rate-limiting.md) for details.

## Notes

- Requires a valid access token
- Only provided fields will be updated
- Email and role cannot be updated through this endpoint
- Returns the complete updated profile