import { MarketGapProvider } from './marketGapTypes';
import { MockMarketGapProvider } from './providers/mockProvider';

const PROVIDER_TYPE = process.env.MARKET_GAP_PROVIDER || 'mock';

export function getMarketGapProvider(): MarketGapProvider {
  switch (PROVIDER_TYPE) {
    case 'mock':
    default:
      return new MockMarketGapProvider();
  }
}
