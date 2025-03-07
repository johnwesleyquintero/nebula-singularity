import { NextResponse } from 'next/server';
import { nonceService } from './nonceService';
import { applyCorsHeaders } from './corsConfig';
import { validateHeaders } from './headerValidation';

export const applySecurityHeaders = (responses: NextResponse | NextResponse[]): NextResponse | NextResponse[] => {
  const responseArray = Array.isArray(responses) ? responses : [responses];
  
  responseArray.forEach(response => {
    // Generate a strong nonce using our NonceService
    const nonce = nonceService.generateNonce();
    
    // Comprehensive CSP policy
    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'",
      `style-src 'self' 'nonce-${nonce}'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https:",
      "connect-src 'self' https: wss:",
      "media-src 'self' https:",
      "object-src 'none'",
      "frame-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', cspDirectives);
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

    // Apply CORS headers after security headers
    applyCorsHeaders(response);

    // Validate headers after all security headers are set
    const validation = validateHeaders(response);
    if (!validation.isValid) {
      console.error('Security header validation failed:', validation.errors);
    }
  });

  return responses;
}