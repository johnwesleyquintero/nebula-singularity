import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
}

class RateLimiter {
  private requests: Map<string, number[]>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.requests = new Map();
    this.config = {
      windowMs: config.windowMs || 60000, // Default: 1 minute
      maxRequests: config.maxRequests || 100, // Default: 100 requests per window
      message: config.message || 'Too many requests, please try again later.',
      statusCode: config.statusCode || 429
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => 
        now - timestamp < this.config.windowMs
      );
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }

  public isRateLimited(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    const windowStart = now - this.config.windowMs;

    // Filter out old timestamps
    const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);

    // Add current request timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    // Cleanup old entries periodically
    if (Math.random() < 0.1) { // 10% chance to trigger cleanup
      this.cleanup();
    }

    return validTimestamps.length > this.config.maxRequests;
  }

  public getRateLimitResponse(message?: string): NextResponse {
    return new NextResponse(
      JSON.stringify({
        error: message || this.config.message
      }),
      {
        status: this.config.statusCode,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Create a singleton instance with default config
const defaultRateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100
});

export const applyRateLimiting = (
  request: NextRequest,
  customConfig?: RateLimitConfig
): NextResponse | null => {
  const limiter = customConfig ? new RateLimiter(customConfig) : defaultRateLimiter;
  
  // Use IP address as the rate limiting key
  const ip = request.ip || 'unknown';
  
  if (limiter.isRateLimited(ip)) {
    return limiter.getRateLimitResponse();
  }
  
  return null;
};