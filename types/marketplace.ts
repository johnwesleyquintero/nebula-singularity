// Marketplace API types and interfaces

// Error types
export type MarketplaceError = {
  code: string
  message: string
}

// Authentication types
export type MarketplaceCredentials = {
  sellerId: string
  marketplaceId: string
  accessKey: string
  secretKey: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Product data types
export type BSRData = {
  rank: number
  category: string
  estimatedSales: number
}

export type ProductReviews = {
  total: number
  rating: number
  distribution: Record<string, number>
}

export type ProductPricing = {
  current: number
  list: number
  lowest: number
  highest: number
  average: number
}

export type ProductData = {
  asin: string
  title: string
  description: string
  bulletPoints: string[]
  price: ProductPricing
  bsr: BSRData
  reviews: ProductReviews
  category: string
  subCategory: string
  keywords: string[]
  images: string[]
  dimensions: {
    length: number
    width: number
    height: number
    weight: number
    unit: string
  }
}

// Keyword analysis types
export type KeywordData = {
  keyword: string
  searchVolume: number
  competition: number
  relevanceScore: number
  suggestedBid: number
  trends: number[]
}

// PPC campaign types
export type PPCMetrics = {
  impressions: number
  clicks: number
  spend: number
  sales: number
  orders: number
  acos: number
  roas: number
  cpc: number
  conversionRate: number
}

export type PPCCampaign = {
  id: string
  name: string
  status: 'active' | 'paused' | 'archived'
  budget: number
  startDate: string
  endDate?: string
  targeting: 'auto' | 'manual'
  metrics: PPCMetrics
}

// Analytics types
export type AnalyticsMetrics = {
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  costs: number
  acos: number
  roas: number
  profitMargin: number
}

export type PerformanceData = {
  daily: AnalyticsMetrics
  weekly: AnalyticsMetrics
  monthly: AnalyticsMetrics
  trends: {
    acos: number[]
    revenue: number[]
    profitMargin: number[]
  }
}

// Listing optimization types
export type ListingQualityScore = {
  title: number
  description: number
  bulletPoints: number
  keywords: number
  images: number
  overall: number
}

export type ListingOptimization = {
  qualityScore: ListingQualityScore
  suggestions: {
    title?: string[]
    description?: string[]
    bulletPoints?: string[]
    keywords?: string[]
    images?: string[]
  }
  competitiveAnalysis: {
    pricePosition: number
    featureComparison: string[]
    keywordGaps: string[]
  }
}