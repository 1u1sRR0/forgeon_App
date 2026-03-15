import { OpportunityProvider } from './opportunityTypes';
import { MockOpportunityProvider } from './providers/mockProvider';

const PROVIDER_TYPE = process.env.OPPORTUNITY_PROVIDER || 'mock';

export function getOpportunityProvider(): OpportunityProvider {
  switch (PROVIDER_TYPE) {
    case 'mock':
    default:
      return new MockOpportunityProvider();
  }
}
