'use client'

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';

export default function GlobalError({ error }) {
  // Capture the error with Sentry
  Sentry.captureException(error);

  return (
    <div className="error-page">
      <h2>Something went wrong!</h2>
      <Error statusCode={500} title={error.message} />
    </div>
  );
}
