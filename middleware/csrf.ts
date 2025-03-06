import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

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
  tokenExpiry: 3600, // 1 hour
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

export const csrfMiddleware = async (req: Request) => {
  let parsedToken: CsrfToken | null = null;

  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get('csrf-token')?.value;
    if (cookieValue) {
      parsedToken = JSON.parse(cookieValue);
      if (!parsedToken || typeof parsedToken.value !== 'string' || typeof parsedToken.expires !== 'number') {
        throw new Error('Invalid CSRF token format');
      }
    }
  } catch (error) {
    console.error('Failed to parse CSRF token:', error);
    parsedToken = null;
  }

  if (req.method === 'GET') {
    const newToken: CsrfToken = {
      value: uuidv4(),
      expires: Date.now() + (DEFAULT_CONFIG.tokenExpiry || 0) * 1000,
    };

    const response = NextResponse.next();
    response.cookies.set('csrf-token', JSON.stringify(newToken), {
      httpOnly: DEFAULT_CONFIG.httpOnly,
      secure: DEFAULT_CONFIG.secure,
      sameSite: DEFAULT_CONFIG.sameSite,
      maxAge: DEFAULT_CONFIG.tokenExpiry,
    });
    return response;
  }

  const headerToken = req.headers.get('x-csrf-token');

  if (!parsedToken || !headerToken) {
    return NextResponse.json(
      { 
        error: 'CSRF token missing',
        code: 'CSRF_TOKEN_MISSING',
        status: 403 
      },
      { status: 403 }
    );
  }

  if (parsedToken.expires < Date.now()) {
    return NextResponse.json(
      { 
        error: 'CSRF token expired',
        code: 'CSRF_TOKEN_EXPIRED',
        status: 403 
      },
      { status: 403 }
    );
  }

  if (parsedToken.value !== headerToken) {
    return NextResponse.json(
      { 
        error: 'Invalid CSRF token',
        code: 'CSRF_TOKEN_INVALID',
        status: 403 
      },
      { status: 403 }
    );
  }

  return NextResponse.next();
};
