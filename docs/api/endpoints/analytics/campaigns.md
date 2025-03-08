# Campaign Statistics Endpoint

## Overview

Retrieve detailed statistics and performance metrics for marketing campaigns.

## Endpoint

```http
GET /analytics/campaigns
```

## Request

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Parameters

| Parameter  | Type   | Required | Description                 |
|------------|--------|----------|-----------------------------||
| campaignId | string | No       | Specific campaign ID        |
| startDate  | string | No       | Start date (YYYY-MM-DD)     |
| endDate    | string | No       | End date (YYYY-MM-DD)       |
| status     | string | No       | Campaign status (active, completed, scheduled) |

### Example Request

```http
GET /analytics/campaigns?startDate=2024-01-01&endDate=2024-01-31&status=active
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "campaigns": [
      {
        "id": "camp_123",
        "name": "Q1 Promotion",
        "status": "active",
        "metrics": {
          "impressions": 50000,
          "clicks": 2500,
          "conversions": 150,
          "spend": 1500.00,
          "revenue": 7500.00,
          "roi": 400,
          "ctr": 5.0,
          "conversionRate": 6.0
        },
        "performance": {
          "daily": [
            {
              "date": "2024-01-01",
              "impressions": 1600,
              "clicks": 80,
              "conversions": 5
            }
          ]
        }
      }
    ],
    "summary": {
      "totalCampaigns": 5,
      "activeCampaigns": 3,
      "totalSpend": 7500.00,
      "totalRevenue": 37500.00,
      "averageRoi": 400
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

#### Invalid Campaign ID (404 Not Found)

```json
{
  "status": "error",
  "message": "Campaign not found"
}
```

#### Invalid Parameters (400 Bad Request)

```json
{
  "status": "error",
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "status",
      "message": "Invalid status value. Must be one of: active, completed, scheduled"
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
- CTR (Click-Through Rate) is expressed as a percentage
- ROI (Return on Investment) is expressed as a percentage
- Data is cached for 5 minutes