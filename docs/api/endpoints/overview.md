# API Endpoints Overview

## Authentication Endpoints

### POST /api/auth/register
**Description**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "Registration successful"
}
```

### POST /api/auth/login
**Description**: Authenticate user and get access token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

## Reports Endpoints

### GET /api/reports
**Description**: Get list of available reports

**Headers**:
- Authorization: Bearer {token}

**Response**:
```json
{
  "reports": [
    {
      "id": "report_id",
      "name": "Monthly Sales",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/reports/generate
**Description**: Generate a new report

**Headers**:
- Authorization: Bearer {token}

**Request Body**:
```json
{
  "type": "sales",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "format": "pdf"
}
```

**Response**:
```json
{
  "reportId": "generated_report_id",
  "status": "processing",
  "estimatedCompletion": "2024-01-01T00:05:00Z"
}
```

## Analytics Endpoints

### GET /api/analytics/dashboard
**Description**: Get dashboard analytics data

**Headers**:
- Authorization: Bearer {token}

**Query Parameters**:
- period: string (daily, weekly, monthly)
- start_date: string (YYYY-MM-DD)
- end_date: string (YYYY-MM-DD)

**Response**:
```json
{
  "metrics": {
    "totalSales": 50000,
    "averageOrderValue": 250,
    "conversionRate": 3.5
  },
  "trends": {
    "sales": [...],
    "visitors": [...]
  }
}
```

## Products Endpoints

### GET /api/products
**Description**: Get list of products

**Headers**:
- Authorization: Bearer {token}

**Query Parameters**:
- page: number
- limit: number
- sort: string (name, price, created_at)
- order: string (asc, desc)

**Response**:
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "stock": 100
    }
  ],
  "pagination": {
    "total": 150,
    "pages": 15,
    "current": 1
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "validation_error",
  "message": "Invalid request parameters",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
```

### 429 Too Many Requests
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_server_error",
  "message": "An unexpected error occurred",
  "requestId": "unique_request_id"
}
```