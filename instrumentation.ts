import * as Sentry from '@sentry/nextjs';

export const register = async () => {
  console.log('Sentry instrumentation running');
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
};

export function onRequestError({ request, response, error }: { request: any; response: any; error: Error }) {
  Sentry.withScope((scope) => {
    scope.setTag("type", "request");
    scope.setExtra("request", request);
    scope.setExtra("response", response);
    Sentry.captureException(error);
  });
}
