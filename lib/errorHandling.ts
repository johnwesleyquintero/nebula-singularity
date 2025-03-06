import { ZodError } from 'zod';
import * as Sentry from '@sentry/nextjs';

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

export const handleError = (error: unknown): ErrorResponse => {
  let errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: errorMessages.DEFAULT_ERROR,
      statusCode: 500,
      details: undefined
    }
  };

  if (error instanceof AppError) {
    errorResponse = {
      success: false,
      error: {
        message: errorMessages[error.code || ''] || error.message,
        statusCode: error.statusCode,
        details: error.details
      }
    };
  }

  if (error instanceof ZodError) {
    errorResponse = {
      success: false,
      error: {
        message: errorMessages.VALIDATION_ERROR,
        statusCode: 400,
        details: error.format() as unknown
      }
    };
  }

  // Log error to Sentry
  Sentry.captureException(error);

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
