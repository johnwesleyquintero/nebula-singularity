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
export const validateRequest = (schema: any) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    try {
      await schema.parseAsync(req.body);
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

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
    public readonly code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

const errorMessages: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again',
  NETWORK_ERROR: 'Network connection issue. Please try again',
  AUTH_ERROR: 'Authentication failed. Please login again',
  DEFAULT_ERROR: 'Something went wrong. Please try again later'
};

interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    statusCode: number;
    details?: unknown;
  };
}

// Configure Sentry context and fingerprinting
const configureSentryContext = (error: unknown, errorResponse: ErrorResponse) => {
  if (error instanceof Error) {
    // Add user context if available
    Sentry.setUser({
      id: 'user-id', // Replace with actual user ID from your auth context
      email: 'user-email', // Replace with actual user email
    });

    // Add error context
    Sentry.setContext('error_details', {
      type: error.constructor.name,
      statusCode: errorResponse.error.statusCode,
      timestamp: new Date().toISOString(),
    });

    // Configure fingerprinting based on error type
    Sentry.configureScope((scope) => {
      scope.setFingerprint([
        error.constructor.name,
        String(errorResponse.error.statusCode),
        error.message,
      ]);

      // Set error level based on status code
      scope.setLevel(
        errorResponse.error.statusCode >= 500 ? 'error' : 'warning'
      );
    });
  }
};

export const handleError = (error: unknown): ErrorResponse => {
  let errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: errorMessages.DEFAULT_ERROR,
      statusCode: 500,
      details: undefined
    }
  };

  // Log error using Winston logger
  logger.error('Error occurred:', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });

  // Track error metrics
  trackError(error, errorResponse.error.statusCode);

  // Handle specific error types
  if (error instanceof AppError) {
    errorResponse = {
      success: false,
      error: {
        message: errorMessages[error.code || ''] || error.message,
        statusCode: error.statusCode,
        details: error.details
      }
    };
  } else if (error instanceof ZodError) {
    errorResponse = {
      success: false,
      error: {
        message: errorMessages.VALIDATION_ERROR,
        statusCode: 400,
        details: error.format() as unknown
      }
    };
  } else if (error instanceof Error) {
    errorResponse = {
      success: false,
      error: {
        message: error.message || errorMessages.DEFAULT_ERROR,
        statusCode: 500,
        details: { name: error.name, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined }
      }
    };
  }

  // Configure Sentry context and fingerprinting
  configureSentryContext(error, errorResponse);

  // Report error to Sentry
  Sentry.captureException(error, {
    level: errorResponse.error.statusCode >= 500 ? 'error' : 'warning',
  });

  return errorResponse;
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>
): Promise<T | ErrorResponse> => {
  try {
    return await fn();
  } catch (error: unknown) {
    throw new AppError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      error
    );
  }
};
