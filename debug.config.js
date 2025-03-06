module.exports = {
  performanceMonitoring: true,
  memoryLeakDetection: true,
  errorTracking: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    }
  },
  whyDidYouRender: true
};
