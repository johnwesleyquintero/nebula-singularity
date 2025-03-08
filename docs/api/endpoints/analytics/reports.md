# Performance Reports Endpoint

## Overview

Generate and retrieve detailed performance reports for various metrics.

## Endpoint

```http
GET /analytics/reports
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Parameters

| Parameter | Type   | Required | Description                 |
|-----------|--------|----------|-----------------------------||
| reportType| string | Yes      | Type of report (sales, inventory, marketing) |
| startDate | string | Yes      | Start date (YYYY-MM-DD)     |
| endDate   | string | Yes      | End date (YYYY-MM-DD)       |
| format    | string | No       | Report format (pdf, csv, json) Default: json |

### Example Request

```http
GET /analytics/reports?reportType=sales&startDate=2024-01-01&endDate=2024-01-31&format=json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "reportId": "rep_123456789",
    "reportType": "sales",
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "metrics": {
      "totalSales": 150000.00,
      "totalOrders": 1500,
      "averageOrderValue": 100.00,
      "topSellingProducts": [
        {
          "id": "prod_123",
          "name": "Product A",
          "units": 500,
          "revenue": 50000.00
        }
      ],
      "salesByChannel": [
        {
          "channel": "online",
          "revenue": 100000.00,
          "orders": 1000
        },
        {
          "channel": "mobile",
          "revenue": 50000.00,
          "orders": 500
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

#### Invalid Parameters (400 Bad Request)

```json
{
  "status": "error",
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "reportType",
      "message": "Invalid report type. Must be one of: sales, inventory, marketing"
    }
  ]
}
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](../../rate-limiting.md) for details.

## Notes

- Requires a valid access token
- Maximum date range is 1 year
- PDF and CSV formats may take longer to generate
- Large reports are processed asynchronously
- All monetary values are in USD