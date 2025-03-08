import { NextResponse } from 'next/server';
import { getNonceService } from './nonceService';
import { applyCorsHeaders } from './corsConfig';
import { validateHeaders } from './headerValidation';

class SecurityHeaderManager {
  private nonce: string;

  constructor(nonce?: string) {
    this.nonce = nonce || '';
  }

  private cspPolicy() {
    const basePolicy = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${this.nonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'"
    ].join('; ');

    return process.env.NODE_ENV === 'production' 
      ? basePolicy 
      : `${basePolicy}; report-uri /api/csp-violation-report`;
  }

  private hstsHeader() {
    const maxAge = 31536000;
    return `max-age=${maxAge}; includeSubDomains; preload`;
  }

  applyHeaders(response: NextResponse): NextResponse {
    response.headers.set('Content-Security-Policy', this.cspPolicy());
    response.headers.set('Strict-Transport-Security', this.hstsHeader());
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    return response;
  }
}

export function applySecurityHeaders(response: NextResponse, nonce?: string): NextResponse {
  const nonceService = getNonceService();
  const headerManager = new SecurityHeaderManager(nonce || nonceService.generateNonce());
  return headerManager.applyHeaders(response);
}
