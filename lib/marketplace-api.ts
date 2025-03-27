import { API_CONSTANTS } from '@/config/constants'

// Types for marketplace API responses
type MarketplaceError = {
  code: string
  message: string
}

type BSRData = {
  rank: number
  category: string
  estimatedSales: number
}

type KeywordData = {
  keyword: string
  searchVolume: number
  competition: number
  relevanceScore: number
}

type ProductData = {
  asin: string
  title: string
  price: number
  bsr: BSRData
  reviews: {
    total: number
    rating: number
  }
}

class MarketplaceAPI {
  private static instance: MarketplaceAPI
  private baseUrl: string
  private apiKey: string
  
  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || ''
    this.apiKey = process.env.MARKETPLACE_API_KEY || ''
  }

  public static getInstance(): MarketplaceAPI {
    if (!MarketplaceAPI.instance) {
      MarketplaceAPI.instance = new MarketplaceAPI()
    }
    return MarketplaceAPI.instance
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let retries = 0
    while (retries < API_CONSTANTS.MAX_RETRIES) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            ...options.headers,
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        retries++
        if (retries === API_CONSTANTS.MAX_RETRIES) throw error
        await new Promise(resolve => 
          setTimeout(resolve, API_CONSTANTS.RETRY_DELAY)
        )
      }
    }
    throw new Error('Maximum retries exceeded')
  }

  // Get BSR data and sales estimation
  async getBSRData(asin: string, category: string): Promise<BSRData> {
    return this.fetchWithRetry<BSRData>(
      `/products/${asin}/bsr?category=${encodeURIComponent(category)}`
    )
  }

  // Get keyword metrics
  async getKeywordMetrics(keywords: string[]): Promise<KeywordData[]> {
    return this.fetchWithRetry<KeywordData[]>(
      '/keywords/metrics',
      {
        method: 'POST',
        body: JSON.stringify({ keywords })
      }
    )
  }

  // Get product details
  async getProductDetails(asin: string): Promise<ProductData> {
    return this.fetchWithRetry<ProductData>(`/products/${asin}`)
  }

  // Get PPC campaign metrics
  async getPPCMetrics(campaignId: string, dateRange: { start: string, end: string }) {
    return this.fetchWithRetry(
      `/ppc/campaigns/${campaignId}/metrics`,
      {
        method: 'POST',
        body: JSON.stringify(dateRange)
      }
    )
  }

  // Validate product listing
  async validateListing(listing: {
    title: string
    description: string
    bulletPoints: string[]
    keywords: string[]
  }) {
    return this.fetchWithRetry(
      '/listings/validate',
      {
        method: 'POST',
        body: JSON.stringify(listing)
      }
    )
  }
}

export const marketplaceAPI = MarketplaceAPI.getInstance()