# Change Password Endpoint

## Overview

Allow authenticated users to update their password.

## Endpoint

```http
POST /users/change-password
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body Parameters

| Parameter     | Type   | Required | Description                 |
|---------------|--------|----------|-----------------------------||
| currentPassword | string | Yes      | User's current password     |
| newPassword    | string | Yes      | User's new password         |

### Example Request

```json
{
  "currentPassword": "current-password",
  "newPassword": "new-secure-password"
}
```

## Response

### Success Response (200 OK)

```json
{
  "status": "success",
  "message": "Password successfully updated"
}
```

### Error Responses

#### Invalid Current Password (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Current password is incorrect"
}
```

#### Invalid Password Format (400 Bad Request)

```json
{
  "status": "error",
  "message": "Invalid password format",
  "errors": [
    {
      "field": "newPassword",
      "message": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
  ]
}
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](../../rate-limiting.md) for details.

## Notes

- Requires a valid access token
- The new password must meet the system's password requirements
- After password change, existing sessions remain valid
- For security purposes, consider implementing automatic logout of other sessions