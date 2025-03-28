// Marketplace API configuration and constants

// API endpoints
export const MARKETPLACE_ENDPOINTS = {
  BSR: "/products/:asin/bsr",
  KEYWORDS: "/keywords/metrics",
  PRODUCT_DETAILS: "/products/:asin",
  PPC_METRICS: "/ppc/campaigns/:campaignId/metrics",
  LISTING_VALIDATION: "/listings/validate",
};

// Category multipliers for sales estimation
export const CATEGORY_MULTIPLIERS = {
  electronics: 1.2,
  "home-kitchen": 1.0,
  "toys-games": 0.9,
  beauty: 0.85,
  clothing: 1.1,
  books: 1.3,
  sports: 0.8,
  health: 0.95,
  "office-products": 0.75,
  "pet-supplies": 0.7,
};

// BSR rank tiers for sales estimation
export const BSR_TIERS = {
  TIER_1: { max: 100, baseMultiplier: 100 },
  TIER_2: { max: 1000, baseMultiplier: 70 },
  TIER_3: { max: 10000, baseMultiplier: 50 },
  TIER_4: { max: 100000, baseMultiplier: 35 },
  TIER_5: { max: Infinity, baseMultiplier: 20 },
};

// Keyword competition thresholds
export const KEYWORD_COMPETITION = {
  LOW: 0.3,
  MEDIUM: 0.6,
  HIGH: 1.0,
};

// PPC campaign metrics thresholds
export const PPC_METRICS = {
  GOOD_ACOS: 30,
  WARNING_ACOS: 50,
  GOOD_ROAS: 3,
  WARNING_ROAS: 2,
  MIN_CLICKS: 100,
  MIN_IMPRESSIONS: 1000,
};

// Listing quality thresholds
export const LISTING_QUALITY = {
  MIN_TITLE_LENGTH: 80,
  MAX_TITLE_LENGTH: 200,
  MIN_BULLET_POINTS: 5,
  MIN_DESCRIPTION_LENGTH: 1000,
  MIN_KEYWORDS: 20,
  KEYWORD_RELEVANCE_THRESHOLD: 0.7,
};

// API rate limiting
export const API_RATE_LIMITS = {
  REQUESTS_PER_SECOND: 5,
  REQUESTS_PER_MINUTE: 100,
  REQUESTS_PER_HOUR: 2000,
  BURST_SIZE: 10,
};

// Cache settings
export const CACHE_SETTINGS = {
  BSR_TTL: 3600, // 1 hour
  KEYWORD_TTL: 86400, // 24 hours
  PRODUCT_TTL: 3600, // 1 hour
  PPC_TTL: 300, // 5 minutes
};
