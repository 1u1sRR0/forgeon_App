// Market Intelligence Types
export interface MarketIntelItem {
  id: string;
  title: string;
  type: 'TREND' | 'SECTOR_INSIGHT' | 'STARTUP_DATA' | 'DEMAND_INDICATOR';
  summary: string;
  sector: string;
  confidence: number;
  signals: Array<{
    label: string;
    strength: number;
    explanation: string;
  }>;
  content: {
    overview: string;
    evidenceSignals: Array<{
      label: string;
      strength: number;
      explanation: string;
    }>;
    risks: string[];
    howToUse: string[];
  };
}

export interface MarketSignal {
  id: string;
  type: 'trend' | 'opportunity' | 'threat' | 'regulation';
  title: string;
  description: string;
  strength: number;
  relevance: number;
  timeframe: 'short' | 'medium' | 'long';
  sources: string[];
}

export interface RiskFactor {
  id: string;
  category: 'market' | 'technical' | 'financial' | 'regulatory';
  title: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface CompetitorAnalysis {
  id: string;
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  strategy: string;
  threats: string[];
}