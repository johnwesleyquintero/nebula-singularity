# Rate Limiting

## Overview

To ensure fair usage and maintain service stability, Nebula Suite implements rate limiting on all API endpoints. This document outlines our rate limiting policies, quotas, and best practices for handling rate limits.

## Rate Limits

### Default Limits

- **Free Tier**: 60 requests per minute
- **Pro Tier**: 1000 requests per minute
- **Enterprise Tier**: Custom limits based on requirements

### Endpoint-Specific Limits

Some endpoints have specific rate limits:

- **Authentication endpoints**: 10 requests per minute
- **Report generation**: 30 requests per hour
- **Bulk operations**: 5 requests per minute

## Rate Limit Headers

All API responses include headers to help you track your rate limit status:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 56
X-RateLimit-Reset: 1640995200
```

- `X-RateLimit-Limit`: Total requests allowed per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

## Handling Rate Limits

### Response Format

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please try again in 60 seconds",
    "reset_at": "2024-01-01T00:00:00Z"
  }
}
```

### Best Practices

1. **Implement Exponential Backoff**
   ```typescript
   async function fetchWithRetry(url: string, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         const response = await fetch(url);
         if (response.status !== 429) return response;
         
         const resetAt = response.headers.get('X-RateLimit-Reset');
         const waitTime = Math.min(1000 * Math.pow(2, i), 8000);
         await new Promise(resolve => setTimeout(resolve, waitTime));
       } catch (error) {
         if (i === maxRetries - 1) throw error;
       }
     }
   }
   ```

2. **Monitor Rate Limit Headers**
   - Track remaining requests
   - Pause operations when approaching limits
   - Schedule bulk operations during off-peak hours

3. **Use Bulk Operations**
   - Combine multiple operations into single requests
   - Utilize batch endpoints when available

## Increasing Rate Limits

1. **Upgrade Your Plan**
   - Consider upgrading to Pro or Enterprise tier
   - Contact sales for custom limit discussions

2. **Request Temporary Increases**
   - Available for special events or migrations
   - Requires advance notice and approval

## Monitoring and Alerts

1. **Dashboard Monitoring**
   - Track rate limit usage in real-time
   - Set up alerts for approaching limits

2. **Logging Best Practices**
   - Log rate limit headers for analysis
   - Monitor trends to optimize usage

## FAQ

**Q: How are rate limits calculated?**
A: Rate limits are calculated on a rolling window basis, not fixed intervals.

**Q: Do unused requests carry over?**
A: No, rate limits reset at the beginning of each window.

**Q: Are there different limits for different API versions?**
A: Rate limits are consistent across API versions but may vary by endpoint and tier.

## Support

If you're experiencing issues with rate limits:

1. Check your current usage in the dashboard
2. Review implementation for optimization opportunities
3. Contact support for assistance

For emergency situations or time-sensitive inquiries, contact our support team directly.