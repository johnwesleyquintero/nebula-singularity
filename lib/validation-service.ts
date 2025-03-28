import {
  KEYWORD_COMPETITION,
  LISTING_QUALITY,
  PPC_METRICS,
} from "@/config/marketplace";
import { z } from "zod";

// Validation schemas for marketplace data
const bsrSchema = z.object({
  rank: z.number().min(1),
  category: z.string().min(1),
  estimatedSales: z.number().min(0),
});

const keywordSchema = z.object({
  keyword: z.string().min(1),
  searchVolume: z.number().min(0),
  competition: z.number().min(0).max(1),
  relevanceScore: z.number().min(0).max(1),
});

const productSchema = z.object({
  asin: z.string().regex(/^[A-Z0-9]{10}$/),
  title: z
    .string()
    .min(LISTING_QUALITY.MIN_TITLE_LENGTH)
    .max(LISTING_QUALITY.MAX_TITLE_LENGTH),
  price: z.number().min(0.01),
  bsr: bsrSchema,
  reviews: z.object({
    total: z.number().min(0),
    rating: z.number().min(1).max(5),
  }),
});

const listingSchema = z.object({
  title: z
    .string()
    .min(LISTING_QUALITY.MIN_TITLE_LENGTH)
    .max(LISTING_QUALITY.MAX_TITLE_LENGTH),
  description: z.string().min(LISTING_QUALITY.MIN_DESCRIPTION_LENGTH),
  bulletPoints: z.array(z.string()).min(LISTING_QUALITY.MIN_BULLET_POINTS),
  keywords: z.array(z.string()).min(LISTING_QUALITY.MIN_KEYWORDS),
});

const ppcMetricsSchema = z.object({
  impressions: z.number().min(PPC_METRICS.MIN_IMPRESSIONS),
  clicks: z.number().min(PPC_METRICS.MIN_CLICKS),
  spend: z.number().min(0),
  sales: z.number().min(0),
  acos: z.number().min(0),
  roas: z.number().min(0),
});

class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  validateBSRData(data: unknown) {
    return bsrSchema.parse(data);
  }

  validateKeywordData(data: unknown) {
    return keywordSchema.parse(data);
  }

  validateProductData(data: unknown) {
    return productSchema.parse(data);
  }

  validateListingData(data: unknown) {
    return listingSchema.parse(data);
  }

  validatePPCMetrics(data: unknown) {
    return ppcMetricsSchema.parse(data);
  }

  validateKeywordCompetition(competition: number): "low" | "medium" | "high" {
    if (competition <= KEYWORD_COMPETITION.LOW) return "low";
    if (competition <= KEYWORD_COMPETITION.MEDIUM) return "medium";
    return "high";
  }

  validateACOS(acos: number): "good" | "warning" | "critical" {
    if (acos <= PPC_METRICS.GOOD_ACOS) return "good";
    if (acos <= PPC_METRICS.WARNING_ACOS) return "warning";
    return "critical";
  }

  validateROAS(roas: number): "good" | "warning" | "critical" {
    if (roas >= PPC_METRICS.GOOD_ROAS) return "good";
    if (roas >= PPC_METRICS.WARNING_ROAS) return "warning";
    return "critical";
  }

  validateKeywordRelevance(relevanceScore: number): boolean {
    return relevanceScore >= LISTING_QUALITY.KEYWORD_RELEVANCE_THRESHOLD;
  }
}

export const validationService = ValidationService.getInstance();
