import { NextResponse } from 'next/server';

export const applySecurityHeaders = (responses: NextResponse | NextResponse[]): NextResponse | NextResponse[] => {
  const responseArray = Array.isArray(responses) ? responses : [responses];
  
  responseArray.forEach(response => {
    // Base security headers for all environments
    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
    response.headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'nonce-${nonce}' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https:; frame-src 'self'; base-uri 'self'; form-action 'self';`);
    response.headers.set('X-Nonce', nonce);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Environment-specific headers
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
      response.headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
      response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
      response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    }
  });

  return responses;
}