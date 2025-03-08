import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders } from './lib/securityHeaders';
import { applyRateLimiting } from './lib/rateLimiting';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Apply rate limiting first
  // Enhanced rate limiting for authentication endpoints
  // Apply rate limiting to all API routes except public endpoints
if (request.nextUrl.pathname.startsWith('/api') && 
    !request.nextUrl.pathname.match(/(\/api\/public|\/api\/docs)/)) {
    const rateLimitResponse = applyRateLimiting(request);
    if (rateLimitResponse) {
      return applySecurityHeaders(rateLimitResponse);
    }
  }

  // CSRF protection for non-GET requests
  if (request.method !== 'GET') {
    const csrfError = validateCsrfToken(request);
    if (csrfError) {
      return new NextResponse(csrfError, { status: 403 });
    }
  }

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/analytics') || 
    path.startsWith('/products') || 
    path.startsWith('/reports') || 
    path.startsWith('/settings');

  // Check if the user is authenticated by looking for the session token
  const supabaseToken = request.cookies.get('sb-access-token')?.value;
  const supabaseRefreshToken = request.cookies.get('sb-refresh-token')?.value;
  
  // If it's a protected route and the user is not authenticated, redirect to login
  if (isProtectedRoute && (!supabaseToken || !supabaseRefreshToken)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // After session verification in middleware
  if (session?.user && !session.user.email_verified && !pathname.startsWith('/auth/verify-email')) {
    return NextResponse.redirect(new URL('/auth/verify-email', request.url));
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