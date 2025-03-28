export interface KeywordData {
  keyword: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  acos: number;
  bidAmount: number;
  position: number;
}

export interface ProductData {
  id: string;
  title: string;
  price: number;
  category: string;
  rank: number;
  reviews: number;
  rating: number;
  salesVolume: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  costs: number;
  profitMargin: number;
  inventory: number;
  competitorCount: number;
  searchVolume: number;
}
