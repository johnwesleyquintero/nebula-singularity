import { ZodError } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

// Error metrics tracking
const errorMetrics = {
  totalErrors: 0,
  errorsByType: new Map<string, number>(),
  errorsByStatusCode: new Map<number, number>(),
  lastErrorTimestamp: new Date(),
  alertThreshold: 50, // Number of errors before triggering alert
  timeWindow: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Alert configuration
const alertConfig = {
  enabled: true,
  channels: ['email', 'slack'],
  criticalStatusCodes: [500, 503],
  rateLimitThreshold: 0.1, // 10% error rate threshold
};

// Track error metrics
const trackError = (error: unknown, statusCode: number) => {
  const now = new Date();
  errorMetrics.totalErrors++;
  errorMetrics.lastErrorTimestamp = now;

  // Track by error type
  const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
  errorMetrics.errorsByType.set(
    errorType,
    (errorMetrics.errorsByType.get(errorType) || 0) + 1
  );

  // Track by status code
  errorMetrics.errorsByStatusCode.set(
    statusCode,
    (errorMetrics.errorsByStatusCode.get(statusCode) || 0) + 1
  );

  // Check alert conditions
  checkAlertConditions();
};

// Check if alert should be triggered
const checkAlertConditions = () => {
  if (!alertConfig.enabled) return;

  const recentErrors = errorMetrics.totalErrors;
  const timeSinceLastError = Date.now() - errorMetrics.lastErrorTimestamp.getTime();

  // Check error threshold
  if (recentErrors >= errorMetrics.alertThreshold && 
      timeSinceLastError <= errorMetrics.timeWindow) {
    triggerAlert('High error rate detected');
  }

  // Check critical errors
  alertConfig.criticalStatusCodes.forEach(code => {
    const count = errorMetrics.errorsByStatusCode.get(code) || 0;
    if (count > 0) {
      triggerAlert(`Critical error ${code} detected`);
    }
  });
};

// Trigger alert through configured channels
const triggerAlert = async (message: string) => {
  // Log alert
  logger.error('Alert triggered:', { message });

  // Send to Sentry
  Sentry.captureMessage(message, 'error');

  // Import alert channel handlers
  const { alertChannelHandlers } = await import('./alertChannels');

  // Send alerts through configured channels
  for (const channel of alertConfig.channels) {
    const handler = alertChannelHandlers.get(channel);
    if (handler) {
      try {
        await handler(message);
      } catch (error) {
        logger.error(`Failed to send alert through ${channel}:`, { error, message });
      }
    } else {
      logger.warn(`No handler found for alert channel: ${channel}`);
    }
  }
};

// Configure Winston logger
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    }),
    new transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    })
  ]
});

// Configure rate limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Request validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData; // Replace raw body with validated data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(handleError(error));
      } else {
        next(error);
      }
    }
  };
};

import { ZodError } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

// Error metrics tracking
const errorMetrics = {
  totalErrors: 0,
  errorsByType: new Map<string, number>(),
  errorsByStatusCode: new Map<number, number>(),
  lastErrorTimestamp: new Date(),
  alertThreshold: 50, // Number of errors before triggering alert
  timeWindow: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Alert configuration
const alertConfig = {
  enabled: true,
  channels: ['email', 'slack'],
  criticalStatusCodes: [500, 503],

  // Handle other types of errors
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

export function catchAsyncErrors(fn: Function) {
  return async function(...args: any[]) {
    try {
      return await fn(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
