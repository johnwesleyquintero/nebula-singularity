# Dashboard Metrics Endpoint

## Overview

Retrieve analytics metrics for the dashboard overview.

## Endpoint

```http
GET /analytics/dashboard
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Parameters

| Parameter | Type   | Required | Description                 |
|-----------|--------|----------|-----------------------------||
| startDate | string | No       | Start date (YYYY-MM-DD)     |
| endDate   | string | No       | End date (YYYY-MM-DD)       |
| timezone  | string | No       | Timezone (default: UTC)     |

### Example Request

```http
GET /analytics/dashboard?startDate=2024-01-01&endDate=2024-01-31&timezone=America/New_York
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalRevenue": 125000.50,
      "totalOrders": 1250,
      "averageOrderValue": 100.40,
      "conversionRate": 2.5
    },
    "trends": {
      "daily": [
        {
          "date": "2024-01-01",
          "revenue": 4500.25,
          "orders": 45
        }
      ],
      "topProducts": [
        {
          "id": "prod_123",
          "name": "Product A",
          "revenue": 25000.00,
          "units": 250
        }
      ]
    }
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

#### Invalid Date Range (400 Bad Request)

```json
{
  "status": "error",
  "message": "Invalid date range",
  "errors": [
    {
      "field": "startDate",
      "message": "Start date must not be after end date"
    }
  ]
}
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](../../rate-limiting.md) for details.

## Notes

- Requires a valid access token
- Default date range is last 30 days if not specified
- All monetary values are in USD
- Maximum date range is 1 year
- Data is cached for 5 minutes