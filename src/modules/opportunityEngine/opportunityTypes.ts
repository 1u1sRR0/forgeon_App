// Opportunity Engine Type Definitions

export interface DemandSignal {
  source: string;
  strength: number; // 0-100
  description: string;
  timestamp?: Date;
}

export interface BusinessIntelligenceDossier {
  // Core Identity
  id: string;
  title: string;
  hook: string;
  sector: string;
  
  // Problem & Solution
  painLevel: number; // 1-10
  buyerPersona: string;
  mvpScope: string;
  
  // Market Intelligence
  demandSignals: DemandSignal[];
  demandScore: number; // 0-100
  competitionScore: number; // 0-100
  competitionSnapshot: string;
  timingSignals: string[];
  
  // Differentiation
  differentiationAngles: string[];
  
  // Go-to-Market
  gtmChannels: string[];
  
  // Monetization
  pricingSuggestions: string;
  pricingRationale: string;
  monetizationType: 'subscription' | 'one-time' | 'freemium' | 'usage-based' | 'marketplace';
  
  // Execution
  executionDifficulty: number; // 1-5
  executionReasons: string[];
  timeToMVP: string;
  requiredSkills: string[];
  recommendedStack: string[];
  
  // Risk Management
  risks: string[];
  mitigations: string[];
  
  // Success Metrics
  acceptanceCriteria: string[];
  nextSteps: string[];
  
  // Computed
  viabilityScore: number; // 0-100
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityFilters {
  search?: string;
  sector?: string;
  minViability?: number;
  maxDifficulty?: number;
  monetizationType?: string;
  sort?: 'viability' | 'difficulty' | 'newest';
  page?: number;
  pageSize?: number;
}

export interface PaginatedOpportunities {
  opportunities: BusinessIntelligenceDossier[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sectors: string[];
}

export interface OpportunityProvider {
  generateOpportunities(userId: string, count: number, sectors?: string[]): Promise<BusinessIntelligenceDossier[]>;
}

export interface WizardSeed {
  sourceType: 'opportunity' | 'market-gap-variant';
  sourceId: string;
  timestamp: Date;
  prefilledFields: {
    title?: string;
    description?: string;
    targetAudience?: string;
    problemStatement?: string;
    proposedSolution?: string;
    monetizationModel?: string;
    techStack?: string[];
  };
}
