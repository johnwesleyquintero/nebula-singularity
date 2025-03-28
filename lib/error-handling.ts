import { MarketplaceError } from "@/types/marketplace";

class ErrorHandlingService {
  private static instance: ErrorHandlingService;

  private constructor() {}

  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  handleMarketplaceError(error: unknown): MarketplaceError {
    if (error instanceof Error) {
      // Handle API-specific errors
      if (error.message.includes("API request failed")) {
        return {
          code: "API_ERROR",
          message:
            "Unable to connect to marketplace API. Please try again later.",
        };
      }

      // Handle rate limiting errors
      if (error.message.includes("rate limit")) {
        return {
          code: "RATE_LIMIT",
          message: "Too many requests. Please wait a moment and try again.",
        };
      }

      // Handle validation errors
      if (error.message.includes("validation")) {
        return {
          code: "VALIDATION_ERROR",
          message:
            "Invalid data provided. Please check your input and try again.",
        };
      }

      // Handle authentication errors
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("authentication")
      ) {
        return {
          code: "AUTH_ERROR",
          message: "Authentication failed. Please check your API credentials.",
        };
      }
    }

    // Default error
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    };
  }

  handleNetworkError(error: unknown): MarketplaceError {
    return {
      code: "NETWORK_ERROR",
      message:
        "Network connection failed. Please check your internet connection and try again.",
    };
  }

  handleCacheError(error: unknown): MarketplaceError {
    return {
      code: "CACHE_ERROR",
      message: "Unable to access cached data. Please try refreshing the page.",
    };
  }

  handleValidationError(error: unknown): MarketplaceError {
    if (error instanceof Error) {
      return {
        code: "VALIDATION_ERROR",
        message: error.message,
      };
    }

    return {
      code: "VALIDATION_ERROR",
      message: "Invalid data format. Please check your input.",
    };
  }

  handleDatabaseError(error: unknown): MarketplaceError {
    return {
      code: "DATABASE_ERROR",
      message: "Database operation failed. Please try again later.",
    };
  }

  // Format error for user display
  formatErrorForDisplay(error: MarketplaceError): string {
    return `Error (${error.code}): ${error.message}`;
  }

  // Log error for monitoring
  logError(error: unknown, context?: string): void {
    console.error(`[${context || "General"}]`, error);
    // Here we can add additional error logging logic
    // such as sending to a monitoring service
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
