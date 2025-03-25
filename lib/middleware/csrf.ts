import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { applySecurityHeaders } from '@/lib/securityHeaders';

interface CsrfConfig {
  tokenExpiry?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

interface CsrfToken {
  value: string;
  expires: number;
}

const DEFAULT_CONFIG: CsrfConfig = {
  tokenExpiry: parseInt(process.env.CSRF_TOKEN_EXPIRY || '3600'),
  httpOnly: process.env.CSRF_HTTP_ONLY === 'true',
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.CSRF_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
};

const CSRF_SIGNING_KEY = process.env.CSRF_SIGNING_KEY;
if (!CSRF_SIGNING_KEY) {
  throw new Error('CSRF_SIGNING_KEY environment variable is required');
}

// Paths that don't require CSRF protection
const EXCLUDED_PATHS = [
  '/api/docs',
  '/api/health',
  '/api/metrics'
];

// Helper function to check if path is excluded from CSRF protection
const isExcludedPath = (path: string): boolean => {
  return EXCLUDED_PATHS.some(excludedPath => path.startsWith(excludedPath));
};

/**
 * Enhanced CSRF middleware with token validation and caching
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} - Response object with CSRF protection
 */
export const csrfMiddleware = async (req: NextRequest) => {
  // Enhanced CSRF protection with additional validation
  if (!req.nextUrl) {
    return NextResponse.json(
      { error: 'Invalid request URL', code: 'INVALID_REQUEST', status: 400 },
      { status: 400 }
    );
  }

  const path = req.nextUrl.pathname;

  // Skip CSRF protection for excluded paths
  if (isExcludedPath(path)) {
    return NextResponse.next();
  }

  // Only apply CSRF protection to API routes and POST/PUT/DELETE/PATCH methods
  if (!path.startsWith('/api') || req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const csrfToken = cookieStore.get('csrf_token');
  const requestToken = req.headers.get('X-CSRF-Token');

  if (!csrfToken || !requestToken || !validateTokenSignature(csrfToken.value) || csrfToken.value !== requestToken) {
    return NextResponse.json(
      { error: 'Invalid CSRF token', code: 'INVALID_CSRF_TOKEN', status: 403 },
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const tokenData = parseAndValidateToken(csrfToken.value);
    if (Date.now() > tokenData.expires) {
      return NextResponse.json(
        { error: 'CSRF token expired', code: 'EXPIRED_CSRF_TOKEN', status: 403 },
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid CSRF token format', code: 'INVALID_TOKEN_FORMAT', status: 403 },
      { status: 403 }
    );
  }

  // Generate new CSRF token
  const rawToken = `${uuidv4()}:${Date.now() + (DEFAULT_CONFIG.tokenExpiry || 3600) * 1000}`;
const signature = crypto.createHmac('sha256', CSRF_SIGNING_KEY).update(rawToken).digest('hex');
const newToken: CsrfToken = {
  value: `${rawToken}.${signature}`,
  expires: Date.now() + (DEFAULT_CONFIG.tokenExpiry || 3600) * 1000,
};

  // Set new CSRF token cookie with security options
  const response = NextResponse.next();
  response.cookies.set('csrf_token', newToken.value, {
    httpOnly: DEFAULT_CONFIG.httpOnly,
    secure: DEFAULT_CONFIG.secure,
    sameSite: DEFAULT_CONFIG.sameSite,
    path: '/',
  });

  // Apply security headers
  applySecurityHeaders(response.headers);

  return response;
};