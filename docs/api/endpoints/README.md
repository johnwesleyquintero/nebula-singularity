# API Endpoints

## Overview

This section documents all available endpoints in the Nebula Suite API. Each endpoint includes detailed information about request/response formats, authentication requirements, and usage examples.

## Base URL

```
https://api.nebulasuite.com/v1
```

## Available Endpoints

### Authentication
- [Login](/auth/login.md) - Obtain access tokens
- [Refresh Token](/auth/refresh.md) - Refresh expired access tokens
- [Logout](/auth/logout.md) - Invalidate tokens

### User Management
- [Get User Profile](/users/get-profile.md) - Retrieve user information
- [Update Profile](/users/update-profile.md) - Update user details
- [Change Password](/users/change-password.md) - Update user password

### Analytics
- [Dashboard Metrics](/analytics/dashboard.md) - Get dashboard analytics
- [Performance Reports](/analytics/reports.md) - Generate performance reports
- [Campaign Statistics](/analytics/campaigns.md) - View campaign metrics

### Products
- [List Products](/products/list.md) - Get all products
- [Product Details](/products/details.md) - Get single product
- [Create Product](/products/create.md) - Add new product
- [Update Product](/products/update.md) - Modify product
- [Delete Product](/products/delete.md) - Remove product

## Request Format

All POST requests should use JSON:

```http
Content-Type: application/json
```

## Response Format

All responses are in JSON format:

```json
{
  "status": "success",
  "data": {},
  "message": "Operation successful"
}
```

## Error Responses

Error responses follow a consistent format:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Pagination

Endpoints that return lists support pagination:

```http
GET /api/v1/products?page=1&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 48,
    "items_per_page": 10
  }
}
```

## Rate Limiting

See our [Rate Limiting Guide](../rate-limiting.md) for details about request limits and throttling.

## Need Help?

- Check our [API Troubleshooting Guide](../troubleshooting.md)
- Contact our support team