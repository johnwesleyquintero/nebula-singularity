import { NextResponse } from 'next/server';

interface CorsConfig {
  origin: string[];
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

const defaultConfig: CorsConfig = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.NEXT_PUBLIC_APP_URL || '']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-Nonce'
  ],
  exposedHeaders: ['X-Nonce'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

export const applyCorsHeaders = (response: NextResponse, config: Partial<CorsConfig> = {}): NextResponse => {
  const finalConfig = { ...defaultConfig, ...config };

  // Validate and set Origin
  const requestOrigin = response.headers.get('Origin') || '';
  const allowedOrigin = finalConfig.origin.includes(requestOrigin)
    ? requestOrigin
    : finalConfig.origin[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  
  if (finalConfig.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight requests
  if (response.headers.get('Request-Method')?.toUpperCase() === 'OPTIONS') {
    response.headers.set('Access-Control-Allow-Methods', finalConfig.methods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', finalConfig.allowedHeaders.join(', '));
    response.headers.set('Access-Control-Expose-Headers', finalConfig.exposedHeaders.join(', '));
    response.headers.set('Access-Control-Max-Age', finalConfig.maxAge.toString());
  }

  return response;
};