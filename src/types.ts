export interface Listing {
  id: string;
  url: string;
  displayName?: string;
  bgImageUrl?: string;
  editCode?: string;
  title: string;
  description: string;
  currentPrice: number; 
  category: string;
  clicks: number;
  purchasedAt: number;
  ownerId?: string;     
  rank?: number;
}

export interface ActivityItem {
  id: string;
  url: string;
  rank: number;
  pricePaid: number;
  profitMade: number; 
  timestamp: number;
  type: 'BUYOUT' | 'NEW';
}

export interface SiteStats {
  totalVolume: number; 
  totalProfitGenerated: number; 
  activePositions: number;
  highestBuyout: number;
  launchDate: string;
}

export const CATEGORIES = [
  "B2B SaaS",
  "DevTools",
  "Crypto/Web3",
  "AI/ML",
  "Consumer",
  "Creator/Media",
  "Other",
] as const;

export type Category = typeof CATEGORIES[number];
