# Error Handling

## Overview

Nebula Suite API uses consistent error formats and HTTP status codes across all endpoints. This document outlines our error handling patterns and provides guidance on handling different types of errors.

## Error Response Format

All API errors follow this standard JSON format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error context"
    },
    "request_id": "unique-request-identifier"
  }
}
```

## HTTP Status Codes

### Common Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Valid authentication but insufficient permissions
- `404 Not Found`: Requested resource doesn't exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

## Error Types

### Validation Errors

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request parameters",
    "details": {
      "email": "Must be a valid email address",
      "age": "Must be a positive number"
    }
  }
}
```

### Authentication Errors

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "Invalid API key or access token",
    "details": {
      "token_status": "expired"
    }
  }
}
```

### Rate Limit Errors

See [Rate Limiting](./rate-limiting.md) for detailed information.

## Error Codes

### Common Error Codes

- `validation_error`: Request parameters failed validation
- `invalid_credentials`: Authentication failed
- `insufficient_permissions`: Authorization failed
- `resource_not_found`: Requested resource doesn't exist
- `rate_limit_exceeded`: Too many requests
- `internal_error`: Server-side error

## Best Practices

### Error Handling

```typescript
async function handleApiRequest(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      // Handle API errors
      const error = data.error;
      switch (error.code) {
        case 'validation_error':
          handleValidationError(error.details);
          break;
        case 'rate_limit_exceeded':
          await handleRateLimit(response);
          break;
        default:
          handleGenericError(error);
      }
      return null;
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
    return null;
  }
}
```

### Logging

1. **Log Error Details**
   - Include request ID for tracking
   - Log complete error response
   - Add relevant context

2. **Monitor Error Patterns**
   - Track error frequencies
   - Set up alerts for critical errors
   - Analyze trends for optimization

## Debugging

### Request ID

Every API response includes a unique `request_id`. Use this ID when:
- Contacting support
- Debugging issues
- Tracking requests through logs

### Debug Mode

Add `debug=true` query parameter for detailed error information (development only):

```json
{
  "error": {
    "code": "internal_error",
    "message": "Database connection failed",
    "details": {
      "stack_trace": "...",
      "query_params": {...},
      "request_headers": {...}
    }
  }
}
```

## Support

When reporting errors to support:

1. Include the request ID
2. Provide the complete error response
3. Describe the expected behavior
4. List any troubleshooting steps taken

## FAQ

**Q: How should I handle retry logic?**
A: Implement exponential backoff for retryable errors (429, 503).

**Q: Are error responses cached?**
A: No, error responses are never cached.

**Q: How can I test error scenarios?**
A: Use our test endpoints with specific error triggers.

For additional support or questions about error handling, contact our support team.