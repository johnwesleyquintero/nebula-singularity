import { marketplaceAPI } from './marketplace-api'
import { validationService } from './validation-service'
import { cacheService } from './cache-service'
import { CATEGORY_MULTIPLIERS, BSR_TIERS } from '@/config/marketplace'

class MarketplaceService {
  private static instance: MarketplaceService

  private constructor() {}

  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService()
    }
    return MarketplaceService.instance
  }

  async estimateSales(asin: string, category: string) {
    try {
      // Check cache first
      const cachedData = cacheService.getBSRData(asin)
      if (cachedData) {
        return cachedData
      }

      // Fetch real BSR data from marketplace
      const bsrData = await marketplaceAPI.getBSRData(asin, category)
      
      // Validate the data
      const validatedData = validationService.validateBSRData(bsrData)

      // Apply category multiplier
      const multiplier = CATEGORY_MULTIPLIERS[category] || 1.0

      // Calculate estimated sales using BSR tiers
      let estimatedSales = 0
      const rank = validatedData.rank

      if (rank <= BSR_TIERS.TIER_1.max) {
        estimatedSales = BSR_TIERS.TIER_1.baseMultiplier * multiplier
      } else if (rank <= BSR_TIERS.TIER_2.max) {
        estimatedSales = BSR_TIERS.TIER_2.baseMultiplier * multiplier
      } else if (rank <= BSR_TIERS.TIER_3.max) {
        estimatedSales = BSR_TIERS.TIER_3.baseMultiplier * multiplier
      } else if (rank <= BSR_TIERS.TIER_4.max) {
        estimatedSales = BSR_TIERS.TIER_4.baseMultiplier * multiplier
      } else {
        estimatedSales = BSR_TIERS.TIER_5.baseMultiplier * multiplier
      }

      // Apply logarithmic decay based on rank
      estimatedSales *= Math.pow(0.9, Math.log10(rank))

      const result = {
        ...validatedData,
        estimatedSales: Math.max(0.1, estimatedSales)
      }

      // Cache the result
      cacheService.setBSRData(asin, result)

      return result
    } catch (error) {
      console.error('Error estimating sales:', error)
      throw new Error('Failed to estimate sales. Please try again later.')
    }
  }

  async analyzeKeywords(keywords: string[]) {
    try {
      const cachedResults = keywords.map(keyword => 
        cacheService.getKeywordMetrics(keyword)
      ).filter(Boolean)

      if (cachedResults.length === keywords.length) {
        return cachedResults
      }

      const uncachedKeywords = keywords.filter(keyword => 
        !cacheService.getKeywordMetrics(keyword)
      )

      const keywordData = await marketplaceAPI.getKeywordMetrics(uncachedKeywords)
      const validatedData = keywordData.map(data => 
        validationService.validateKeywordData(data)
      )

      // Cache new results
      validatedData.forEach(data => {
        cacheService.setKeywordMetrics(data.keyword, data)
      })

      return [...cachedResults, ...validatedData]
    } catch (error) {
      console.error('Error analyzing keywords:', error)
      throw new Error('Failed to analyze keywords. Please try again later.')
    }
  }

  async validateProductListing(listing: {
    title: string
    description: string
    bulletPoints: string[]
    keywords: string[]
  }) {
    try {
      const validatedListing = validationService.validateListingData(listing)
      return await marketplaceAPI.validateListing(validatedListing)
    } catch (error) {
      console.error('Error validating listing:', error)
      throw new Error('Failed to validate listing. Please check your input and try again.')
    }
  }

  async analyzePPCCampaign(campaignId: string, dateRange: { start: string, end: string }) {
    try {
      const cachedMetrics = cacheService.getPPCMetrics(campaignId)
      if (cachedMetrics) {
        return cachedMetrics
      }

      const metrics = await marketplaceAPI.getPPCMetrics(campaignId, dateRange)
      const validatedMetrics = validationService.validatePPCMetrics(metrics)

      cacheService.setPPCMetrics(campaignId, validatedMetrics)

      return validatedMetrics
    } catch (error) {
      console.error('Error analyzing PPC campaign:', error)
      throw new Error('Failed to analyze PPC campaign. Please try again later.')
    }
  }
}

export const marketplaceService = MarketplaceService.getInstance()