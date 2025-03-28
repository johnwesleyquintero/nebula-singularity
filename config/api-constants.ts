// API-specific constants and configuration

export const API_CONSTANTS = {
  // Request configuration
  REQUEST: {
    TIMEOUT: 10000, // 10 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    MAX_BATCH_SIZE: 100,
  },

  // Rate limiting
  RATE_LIMITS: {
    REQUESTS_PER_SECOND: 5,
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
    BURST_SIZE: 10,
  },

  // Cache settings
  CACHE: {
    BSR_TTL: 3600, // 1 hour
    KEYWORD_TTL: 86400, // 24 hours
    PRODUCT_TTL: 3600, // 1 hour
    PPC_TTL: 300, // 5 minutes
    DEFAULT_TTL: 3600, // 1 hour
  },

  // Marketplace endpoints
  ENDPOINTS: {
    AUTH: "/auth",
    TOKEN: "/auth/token",
    REFRESH: "/auth/refresh",
    PRODUCTS: "/products",
    BSR: "/products/:asin/bsr",
    KEYWORDS: "/keywords/metrics",
    PPC: "/ppc/campaigns",
    LISTINGS: "/listings",
  },

  // Response codes
  RESPONSE_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    SERVER_ERROR: 500,
  },

  // Error types
  ERROR_TYPES: {
    API_ERROR: "API_ERROR",
    AUTH_ERROR: "AUTH_ERROR",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    CACHE_ERROR: "CACHE_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
  },

  // Validation constants
  VALIDATION: {
    MIN_KEYWORD_LENGTH: 3,
    MAX_KEYWORDS_PER_REQUEST: 100,
    MIN_CAMPAIGN_BUDGET: 1,
    MAX_CAMPAIGN_BUDGET: 1000000,
    MAX_BULK_OPERATIONS: 1000,
  },
};
