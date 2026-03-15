// Re-export from the engine module for backward compatibility
export type { MarketIntelItemData as MarketIntelItem } from '../marketIntelEngine/marketIntelTypes';
export type {
  MarketIntelSignal as MarketSignal,
  MarketIntelContent,
  MarketIntelFilters,
  PaginatedMarketIntelItems,
  MarketIntelType,
} from '../marketIntelEngine/marketIntelTypes';
