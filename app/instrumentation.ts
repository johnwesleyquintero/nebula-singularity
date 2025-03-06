import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV
    });

    Sentry.setContext("runtime", {
      name: "Next.js Server",
      version: process.version
    });
  }
}

export function onRequestError({ 
  request, 
  response, 
  error 
}: { 
  request: any; 
  response: any; 
  error: Error;
}) {
  Sentry.withScope((scope) => {
    scope.setTag("type", "request");
    scope.setExtra("request", request);
    scope.setExtra("response", response);
    Sentry.captureException(error);
  });
}