import { NextResponse, NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { csrfMiddleware } from '@/middleware/csrf';
import { handleError, withErrorHandling } from '@/lib/errorHandling';
import { applySecurityHeaders } from '@/lib/securityHeaders';

// Since ErrorResponse is not used, we can remove the type declaration

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true
});

const handler = async (req: NextRequest): Promise<NextResponse> => {
  const csrfResponse = await csrfMiddleware(req);
  if (csrfResponse.status !== 200) return csrfResponse;

  const ip = req.headers.get('x-forwarded-for') ?? '';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    const errorResponse = handleError({ message: 'Too many requests', statusCode: 429 });
    return NextResponse.json(
      errorResponse,
      { status: 429 }
    );
  }

  // Add security headers
  const response = NextResponse.json({ data: [] });
  applySecurityHeaders(response);

  return response;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => handler(request));
}
