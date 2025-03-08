# CSRF Middleware Usage Guide

## Overview
The CSRF (Cross-Site Request Forgery) middleware provides protection against CSRF attacks in your Next.js application. It generates and validates CSRF tokens for state-changing requests while allowing safe GET requests.

## Setup

### 1. Environment Variables
Configure the CSRF middleware by setting these environment variables in your `.env` file:

```env
CSRF_TOKEN_EXPIRY=3600        # Token expiry in seconds (default: 1 hour)
CSRF_HTTP_ONLY=true           # HTTP-only cookie flag
CSRF_SAME_SITE=strict         # SameSite cookie attribute (strict|lax|none)
```

### 2. Middleware Integration
Add the CSRF middleware to your Next.js application by creating or updating `middleware.ts` in your project root:

```typescript
import { csrfMiddleware } from './middleware/csrf';

export default csrfMiddleware;

export const config = {
  matcher: '/api/:path*',  // Apply to all API routes
};
```

## How It Works

1. **GET Requests**:
   - Automatically generates a new CSRF token
   - Sets the token in a secure cookie named 'csrf-token'
   - No token validation required

2. **State-changing Requests (POST, PUT, DELETE, etc.)**:
   - Requires a valid CSRF token in the 'x-csrf-token' header
   - Token must match the value stored in the cookie
   - Token must not be expired

## Client-side Implementation

### 1. Reading the CSRF Token
```typescript
const getCsrfToken = () => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf-token='));
  
  if (cookie) {
    const token = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    return token.value;
  }
  return null;
};
```

### 2. Making Protected Requests
```typescript
// Using fetch
const makeRequest = async (url: string, method: string, data?: any) => {
  const csrfToken = getCsrfToken();
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken || ''
    },
    body: data ? JSON.stringify(data) : undefined
  });
  
  return response.json();
};

// Using axios
import axios from 'axios';

axios.interceptors.request.use(config => {
  config.headers['x-csrf-token'] = getCsrfToken();
  return config;
});
```

## Excluded Paths
By default, the following paths are excluded from CSRF protection:
- `/api/docs`
- `/api/health`
- `/api/metrics`

To modify excluded paths, update the `EXCLUDED_PATHS` array in the CSRF middleware.

## Error Handling
The middleware returns appropriate error responses:

1. **Invalid Token (403)**:
```json
{
  "error": "Invalid CSRF token",
  "code": "INVALID_CSRF_TOKEN",
  "status": 403
}
```

2. **Invalid Request (400)**:
```json
{
  "error": "Invalid request URL",
  "code": "INVALID_REQUEST",
  "status": 400
}
```

3. **Server Error (500)**:
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "status": 500
}
```

## Security Considerations

1. The middleware automatically applies security headers using the `applySecurityHeaders` function
2. Tokens are UUID v4 for strong randomness
3. Cookies are configured with secure options by default in production
4. Token validation includes expiry checking

## Best Practices

1. Always include the CSRF token in state-changing requests
2. Implement proper error handling on the client side
3. Keep the token expiry time reasonable (default: 1 hour)
4. Use HTTPS in production for secure token transmission
5. Monitor and log CSRF-related errors for security auditing