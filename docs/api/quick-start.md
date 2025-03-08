# API Quick Start Guide

## Overview

This guide will help you get started with the Nebula Suite API quickly. We'll cover basic setup, authentication, and making your first API request.

## Prerequisites

- A Nebula Suite account
- Your API credentials (API key or client credentials)
- Basic knowledge of HTTP requests

## Step 1: Get Your API Credentials

1. Log in to your Nebula Suite dashboard
2. Navigate to Settings > API Keys
3. Generate a new API key
4. Store your API key securely

## Step 2: Make Your First Request

### Using cURL

```bash
# Replace YOUR_API_KEY with your actual API key
curl -X GET \
  https://api.nebulasuite.com/v1/user/profile \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Using JavaScript

```javascript
async function getProfile() {
  const response = await fetch('https://api.nebulasuite.com/v1/user/profile', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });

  const data = await response.json();
  console.log(data);
}
```

### Using Python

```python
import requests

response = requests.get(
    'https://api.nebulasuite.com/v1/user/profile',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

print(response.json())
```

## Step 3: Handle Responses

### Successful Response

```json
{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "meta": {
    "request_id": "req_abc123"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "unauthorized",
    "message": "Invalid API key"
  }
}
```

## Step 4: Implement Error Handling

```javascript
async function makeApiRequest(endpoint) {
  try {
    const response = await fetch(`https://api.nebulasuite.com/v1/${endpoint}`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Next Steps

1. Explore our [API Documentation](./README.md)
2. Learn about [Authentication](./authentication.md)
3. Review [Error Handling](./error-handling.md)
4. Check [Rate Limiting](./rate-limiting.md)

## Common Issues

### API Key Not Working
- Verify the key is correct
- Check if the key has necessary permissions
- Ensure the key hasn't expired

### Request Failed
- Check your internet connection
- Verify the endpoint URL
- Review request headers
- Check [Error Handling](./error-handling.md) guide

## Best Practices

1. **Security**
   - Keep API keys secure
   - Use environment variables
   - Implement proper error handling

2. **Performance**
   - Cache responses when appropriate
   - Implement retry logic
   - Handle rate limits

3. **Maintenance**
   - Monitor API usage
   - Keep dependencies updated
   - Review logs regularly

## Support

If you need help:
1. Check our [documentation](./README.md)
2. Visit our [community forum](https://community.nebulasuite.com)
3. Contact [support@nebulasuite.com](mailto:support@nebulasuite.com)

Happy coding!