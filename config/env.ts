// Environment configuration for marketplace integration

export const ENV_CONFIG = {
  // Marketplace API configuration
  MARKETPLACE_API: {
    BASE_URL:
      process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
      "https://api.marketplace.com",
    API_KEY: process.env.MARKETPLACE_API_KEY,
    API_VERSION: "v1",
    TIMEOUT: 10000, // 10 seconds
  },

  // Authentication settings
  AUTH: {
    TOKEN_EXPIRY: 3600, // 1 hour in seconds
    REFRESH_TOKEN_EXPIRY: 2592000, // 30 days in seconds
    SESSION_COOKIE_NAME: "sellsmart_session",
  },

  // Database configuration
  DATABASE: {
    URL: process.env.DATABASE_URL,
    MAX_CONNECTIONS: 10,
    IDLE_TIMEOUT: 10000,
  },

  // Cache configuration
  CACHE: {
    REDIS_URL: process.env.REDIS_URL,
    DEFAULT_TTL: 3600,
  },

  // Analytics settings
  ANALYTICS: {
    TRACKING_ID: process.env.ANALYTICS_TRACKING_ID,
    ENABLE_TRACKING: process.env.NODE_ENV === "production",
  },

  // Feature flags
  FEATURES: {
    ENABLE_REAL_TIME_UPDATES: true,
    ENABLE_ADVANCED_ANALYTICS: true,
    ENABLE_BULK_OPERATIONS: true,
    ENABLE_AUTO_OPTIMIZATION: true,
  },

  // Service endpoints
  ENDPOINTS: {
    SALES_TRACKING: "/api/sales",
    INVENTORY_MANAGEMENT: "/api/inventory",
    PRICING_OPTIMIZATION: "/api/pricing",
    COMPETITOR_ANALYSIS: "/api/competitors",
  },

  // Monitoring and logging
  MONITORING: {
    LOG_LEVEL: process.env.NODE_ENV === "production" ? "error" : "debug",
    ENABLE_PERFORMANCE_MONITORING: true,
    ERROR_REPORTING_SERVICE: process.env.ERROR_REPORTING_URL,
  },

  // Rate limiting
  RATE_LIMITING: {
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_HOUR: 1000,
    ENABLE_RATE_LIMITING: true,
  },
};
