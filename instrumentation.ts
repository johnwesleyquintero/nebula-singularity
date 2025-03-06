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

export function captureRequestError(error: Error) {
  Sentry.captureException(error);
}
