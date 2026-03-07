// Market Gap Engine Type Definitions

export interface GapEvidence {
  signal: string;
  strength: 'weak' | 'moderate' | 'strong';
  source: string;
}

export interface GapVariant {
  id: string;
  approach: 'Premium' | 'Volume' | 'Niche';
  title: string;
  targetSubSegment: string;
  differentiator: string;
  fullDossier: BusinessIntelligenceDossier;
}

export interface MarketGapData {
  id: string;
  title: string;
  sector: string;
  underservedSegment: string;
  competitionLevel: 'low' | 'medium' | 'high';
  gapDescription: string;
  evidence: GapEvidence[];
  wedgeStrategy: string;
  estimatedMarketSize: string;
  variants?: GapVariant[];
  createdAt: Date;
}

export interface BusinessIntelligenceDossier {
  title: string;
  hook: string;
  category: string;
  sector: string;
  problemStatement: string;
  targetAudience: string;
  buyerPersona: string;
  painLevel: number;
  solutionOverview: string;
  mvpScope: string;
  coreFeatures: string[];
  demandScore: number;
  demandSignals: DemandSignal[];
  competitionScore: number;
  competitionSnapshot: string;
  differentiationAngles: string[];
  pricingSuggestions: string;
  pricingRationale: string;
  monetizationType: 'subscription' | 'one-time' | 'freemium' | 'usage-based' | 'marketplace';
  timingSignals: string[];
  gtmChannels: string[];
  risks: string[];
  mitigations: string[];
  executionDifficulty: number;
  executionReasons: string[];
  timeToMVP: string;
  requiredSkills: string[];
  recommendedStack: string[];
  acceptanceCriteria: string[];
  nextSteps: string[];
}

export interface DemandSignal {
  source: string;
  signal: string;
  strength: number;
}

export interface MarketGapFilters {
  sector?: string;
  competitionLevel?: 'low' | 'medium' | 'high';
  sort?: 'newest' | 'competition-asc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedMarketGaps {
  gaps: MarketGapData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sectors: string[];
}

export interface MarketGapProvider {
  generateMarketGaps(userId: string, count: number, sectors?: string[]): Promise<MarketGapData[]>;
  generateVariants(gap: MarketGapData): GapVariant[];
}
