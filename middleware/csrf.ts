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
  tokenExpiry: parseInt(process.env.CSRF_TOKEN_EXPIRY || '3600'), // 1 hour default
  httpOnly: process.env.CSRF_HTTP_ONLY === 'true',
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.CSRF_SAME_SITE as 'strict' | 'lax' | 'none' || 'strict',
};

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

  // Skip CSRF check for excluded paths
  if (!req.nextUrl.pathname || isExcludedPath(req.nextUrl.pathname)) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  const cache = new Map<string, CsrfToken>();
  let parsedToken: CsrfToken | null = null;

  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get('csrf-token')?.value;
    
    if (cookieValue && cache.has(cookieValue)) {
      parsedToken = cache.get(cookieValue);
    } else if (cookieValue) {
      try {
        parsedToken = JSON.parse(cookieValue);
        if (!parsedToken || typeof parsedToken.value !== 'string' || typeof parsedToken.expires !== 'number') {
          throw new Error('Invalid CSRF token format');
        }
        cache.set(cookieValue, parsedToken);
      } catch (parseError) {
        console.error('Failed to parse CSRF token:', parseError);
        parsedToken = null;
      }
    }

    if (req.method === 'GET') {
      const newToken: CsrfToken = {
        value: uuidv4(),
        expires: Date.now() + (DEFAULT_CONFIG.tokenExpiry || 0) * 1000,
      };

      const response = NextResponse.next();
      applySecurityHeaders(response);
      
      response.cookies.set('csrf-token', JSON.stringify(newToken), {
        httpOnly: DEFAULT_CONFIG.httpOnly,
        secure: DEFAULT_CONFIG.secure,
        sameSite: DEFAULT_CONFIG.sameSite,
        maxAge: DEFAULT_CONFIG.tokenExpiry,
      });
      return response;
    }

    const headerToken = req.headers.get('x-csrf-token');

    if (!headerToken || !parsedToken || headerToken !== parsedToken.value || Date.now() > parsedToken.expires) {
      return NextResponse.json(
        { error: 'Invalid CSRF token', code: 'INVALID_CSRF_TOKEN', status: 403 },
        { status: 403 }
      );
    }

    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  } catch (error) {
    console.error('CSRF middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR', status: 500 },
      { status: 500 }
    );
  }
};
