import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders } from './lib/securityHeaders';
import { applyRateLimiting } from './lib/rateLimiting';

export async function middleware(request: NextRequest) {
  // Apply rate limiting first
  const rateLimitResponse = applyRateLimiting(request);
  if (rateLimitResponse) {
    // If rate limited, apply security headers to the rate limit response
    return applySecurityHeaders(rateLimitResponse);
  }

  // Continue with the request if not rate limited
  const response = NextResponse.next();
  
  // Apply security headers to the response
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};