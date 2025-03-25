import { z } from "zod"

// Common validation schemas
export const commonValidationSchemas = {
  price: z.number().min(0).max(9999999),
  percentage: z.number().min(0).max(100),
  keywords: z.string().transform(str => str.split(/[,;\n]+/).map(k => k.trim()).filter(Boolean)),
  description: z.string().min(10).max(2000),
  title: z.string().min(3).max(200)
}

// Common calculation functions
export const calculationUtils = {
  calculatePercentage: (value: number, total: number): number => {
    return total === 0 ? 0 : (value / total) * 100
  },
  calculateROI: (revenue: number, cost: number): number => {
    return cost === 0 ? 0 : ((revenue - cost) / cost) * 100
  },
  calculateAverageDailyMetric: (value: number, days: number = 30): number => {
    return days === 0 ? 0 : value / days
  }
}

// Common data processing functions
export const dataProcessingUtils = {
  deduplicateArray: <T>(arr: T[]): T[] => [...new Set(arr)],
  sortByField: <T>(arr: T[], field: keyof T, ascending: boolean = true): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      return ascending ? 
        (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) :
        (aVal > bVal ? -1 : aVal < bVal ? 1 : 0)
    })
  },
  groupByField: <T>(arr: T[], field: keyof T): Record<string, T[]> => {
    return arr.reduce((acc, item) => {
      const key = String(item[field])
      acc[key] = acc[key] || []
      acc[key].push(item)
      return acc
    }, {} as Record<string, T[]>)
  }
}

// Common UI constants
export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  MAX_ITEMS_PER_PAGE: 10,
  DEFAULT_DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000
}

// Common string manipulation functions
export const stringUtils = {
  capitalizeFirstLetter: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
  },
  truncateWithEllipsis: (str: string, maxLength: number): string => {
    return str.length <= maxLength ? str : `${str.slice(0, maxLength)}...`
  }
}