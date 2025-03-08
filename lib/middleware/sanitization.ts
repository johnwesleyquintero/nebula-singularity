import { NextResponse, type NextRequest } from 'next/server';
import xss from 'xss';
import { isApiRoute } from '@/lib/utils';

export const sanitizationMiddleware = async (req: NextRequest) => {
  if (!isApiRoute(req.nextUrl.pathname)) return NextResponse.next();

  try {
    const clonedReq = req.clone();
    
    // Sanitize URL parameters
    const sanitizedQuery = new URLSearchParams();
    for (const [key, value] of clonedReq.nextUrl.searchParams.entries()) {
      sanitizedQuery.set(key, xss(value));
    }

    // Sanitize headers
    const headers = new Headers(clonedReq.headers);
    headers.forEach((value, key) => {
      headers.set(key, xss(value));
    });

    // Sanitize request body
    let sanitizedBody = {};
    if (clonedReq.body) {
      const originalBody = await clonedReq.json();
      sanitizedBody = JSON.parse(
        xss(JSON.stringify(originalBody), {
          whiteList: {}, 
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script']
        })
      );
    }

    // Create sanitized request
    const newUrl = new URL(clonedReq.nextUrl);
    newUrl.search = sanitizedQuery.toString();

    return NextResponse.next({
      request: new Request(newUrl, {
        method: clonedReq.method,
        headers: headers,
        body: Object.keys(sanitizedBody).length > 0 
          ? JSON.stringify(sanitizedBody) 
          : clonedReq.body,
        cache: clonedReq.cache,
        credentials: clonedReq.credentials,
        redirect: clonedReq.redirect
      })
    });
  } catch (error) {
    console.error('Sanitization error:', error);
    return NextResponse.json(
      { error: 'Invalid request content', code: 'INVALID_INPUT' },
      { 
        status: 400,
        headers: {
          'Content-Security-Policy': "default-src 'self'"
        }
      }
    );
  }
};