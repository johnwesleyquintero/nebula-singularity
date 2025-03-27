// Application-wide constants

// Form validation limits
export const FORM_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 30,
  BIO_MAX_LENGTH: 160,
  COMPANY_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2000,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  PASSWORD_MIN_LENGTH: 8
}

// UI constants
export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  MAX_ITEMS_PER_PAGE: 10,
  DEFAULT_DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  MODAL_TRANSITION: 150
}

// API constants
export const API_CONSTANTS = {
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CACHE_TTL: 3600,
  MAX_BATCH_SIZE: 100
}

// Business logic constants
export const BUSINESS_CONSTANTS = {
  MIN_ORDER_AMOUNT: 0.01,
  MAX_ORDER_AMOUNT: 999999.99,
  TAX_RATE: 0.08,
  SHIPPING_THRESHOLD: 50,
  FREE_SHIPPING_MINIMUM: 100,
  MAX_DISCOUNT_PERCENTAGE: 70
}

// Date and time constants
export const TIME_CONSTANTS = {
  DATE_FORMAT: 'MMM dd, yyyy',
  TIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: 'MMM dd, yyyy HH:mm:ss',
  DEFAULT_TIMEZONE: 'UTC',
  SESSION_TIMEOUT: 3600000 // 1 hour in milliseconds
}

// File upload constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILES_PER_UPLOAD: 10
}