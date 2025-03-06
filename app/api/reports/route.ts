import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { csrfMiddleware } from '@/middleware/csrf';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true
});

const handler = async (req: Request) => {
  const csrfResponse = await csrfMiddleware(req);
  if (csrfResponse.status !== 200) return csrfResponse;

  const ip = req.headers.get('x-forwarded-for') ?? '';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Add security headers
  const response = NextResponse.json({ data: [] });
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
};

export async function GET(request: Request) {
  return handler(request);
}
