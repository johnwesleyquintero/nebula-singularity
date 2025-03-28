import { CACHE_SETTINGS } from "@/config/marketplace";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheEntry<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private generateKey(namespace: string, identifier: string): string {
    return `${namespace}:${identifier}`;
  }

  private isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl * 1000;
  }

  set<T>(namespace: string, identifier: string, data: T, ttl: number): void {
    const key = this.generateKey(namespace, identifier);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(namespace: string, identifier: string, ttl: number): T | null {
    const key = this.generateKey(namespace, identifier);
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry.timestamp, ttl)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  // Cache BSR data
  setBSRData<T>(asin: string, data: T): void {
    this.set("bsr", asin, data, CACHE_SETTINGS.BSR_TTL);
  }

  getBSRData<T>(asin: string): T | null {
    return this.get("bsr", asin, CACHE_SETTINGS.BSR_TTL);
  }

  // Cache keyword metrics
  setKeywordMetrics<T>(keyword: string, data: T): void {
    this.set("keyword", keyword, data, CACHE_SETTINGS.KEYWORD_TTL);
  }

  getKeywordMetrics<T>(keyword: string): T | null {
    return this.get("keyword", keyword, CACHE_SETTINGS.KEYWORD_TTL);
  }

  // Cache product details
  setProductDetails<T>(asin: string, data: T): void {
    this.set("product", asin, data, CACHE_SETTINGS.PRODUCT_TTL);
  }

  getProductDetails<T>(asin: string): T | null {
    return this.get("product", asin, CACHE_SETTINGS.PRODUCT_TTL);
  }

  // Cache PPC metrics
  setPPCMetrics<T>(campaignId: string, data: T): void {
    this.set("ppc", campaignId, data, CACHE_SETTINGS.PPC_TTL);
  }

  getPPCMetrics<T>(campaignId: string): T | null {
    return this.get("ppc", campaignId, CACHE_SETTINGS.PPC_TTL);
  }

  // Clear expired entries
  clearExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      const [namespace] = key.split(":");
      const ttl =
        CACHE_SETTINGS[`${namespace.toUpperCase()}_TTL`] ||
        CACHE_SETTINGS.PRODUCT_TTL;

      if (this.isExpired(entry.timestamp, ttl)) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
  }
}

export const cacheService = CacheService.getInstance();
