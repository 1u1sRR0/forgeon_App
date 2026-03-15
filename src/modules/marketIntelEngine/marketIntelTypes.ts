export type MarketIntelType = 'TREND' | 'SECTOR_INSIGHT' | 'STARTUP_DATA' | 'DEMAND_INDICATOR';

export interface MarketIntelSignal {
  label: string;
  strength: number; // 1-5
  explanation: string;
}

export interface MarketIntelContent {
  overview: string;
  evidenceSignals: MarketIntelSignal[];
  risks: string[];
  howToUse: string[];
  relatedItems?: string[];
}

export interface MarketIntelItemData {
  id: string;
  userId: string;
  title: string;
  type: MarketIntelType;
  summary: string;
  sector: string;
  confidence: number; // 0-100
  signals: MarketIntelSignal[];
  content: MarketIntelContent;
  region?: string;
  timeframe?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketIntelFilters {
  search?: string;
  sector?: string;
  timeframe?: string;
  region?: string;
  sort?: 'relevance' | 'latest' | 'confidence';
  page?: number;
  pageSize?: number;
}

export interface PaginatedMarketIntelItems {
  items: MarketIntelItemData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sectors: string[];
}

export interface MarketIntelProvider {
  generateItems(userId: string, countPerCategory: number): Promise<MarketIntelItemData[]>;
  regenerateItems(userId: string, countPerCategory: number): Promise<MarketIntelItemData[]>;
}
