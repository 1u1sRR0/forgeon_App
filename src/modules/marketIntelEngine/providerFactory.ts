import { MarketIntelProvider } from './marketIntelTypes';
import { MockMarketIntelProvider } from './providers/mockProvider';

const PROVIDER_TYPE = process.env.MARKET_INTEL_PROVIDER || 'mock';

export function getMarketIntelProvider(): MarketIntelProvider {
  switch (PROVIDER_TYPE) {
    case 'mock':
    default:
      return new MockMarketIntelProvider();
  }
}
