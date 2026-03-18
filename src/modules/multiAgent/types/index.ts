// Multi-Agent Business Generation System — Type Definitions

// ─── Type Aliases ───

export type SessionState =
  | 'QUESTIONNAIRE'
  | 'PROMPT_REVIEW'
  | 'GENERATING'
  | 'BLUEPRINTS_READY'
  | 'PREVIEW_READY'
  | 'COMPLETED';

export type AgentType =
  | 'PROMPT_ARCHITECT'
  | 'BUSINESS_STRATEGIST'
  | 'PRODUCT_ARCHITECT'
  | 'UX_UI_AGENT'
  | 'TECHNICAL_ARCHITECT'
  | 'QA_CRITICAL_AGENT'
  | 'BUILD_PLANNER'
  | 'MONETIZATION_GTM';

export type AgentRunStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type PromptVersionType = 'ORIGINAL' | 'OPTIMIZED' | 'CUSTOM' | 'REGENERATED';

export type BusinessType =
  | 'SAAS'
  | 'WEB_APP'
  | 'LANDING_PAGE'
  | 'MARKETPLACE'
  | 'INTERNAL_TOOL'
  | 'AI_TOOL'
  | 'ECOMMERCE'
  | 'GUIDED';

// ─── Agent Interfaces ───

export interface AgentInput {
  masterPrompt: string;
  previousArtifacts: AgentArtifactData[];
  sessionContext: {
    businessType: BusinessType;
    questionnaireAnswers: QuestionnaireAnswers;
    settings: GenerationSettingsData;
  };
}

export interface AgentOutput {
  artifact: AgentArtifactData;
  summary: string;
  warnings?: string[];
}

export interface AgentArtifactData {
  agentType: AgentType;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface Agent {
  type: AgentType;
  name: string;
  execute(input: AgentInput): Promise<AgentOutput>;
}

// ─── Questionnaire Interfaces ───

export interface QuestionnaireAnswers {
  sectionA?: SectionAAnswers;
  sectionB?: SectionBAnswers;
  sectionC?: SectionCAnswers;
  sectionD?: SectionDAnswers;
  sectionE?: SectionEAnswers;
  sectionF?: SectionFAnswers;
}

export interface SectionAAnswers {
  businessIdea: string;
  problemSolved: string;
  targetCustomer: string;
  marketContext?: string;
  urgencyMotivation?: string;
}

export interface SectionBAnswers {
  coreFeatures: string[];
  userRoles: string[];
  keyWorkflows: string;
  valueProposition: string;
  competitiveAdvantage?: string;
  multiTenancy?: string;       // conditional: SaaS/Marketplace
  userInteraction?: string;    // conditional: SaaS/Marketplace
}

export interface SectionCAnswers {
  monetizationType: string;
  pricingNotes?: string;
  revenueTarget: string;
  paymentIntegrations: string[];
  billingCycle?: string;       // conditional: subscription
  commissionStructure?: string; // conditional: marketplace
}

export interface SectionDAnswers {
  productName?: string;
  brandTone: string;
  uxFeel: string;
  visualPreference: string;
  inspirationRefs?: string;
}

export interface SectionEAnswers {
  scopeLevel: string;
  authNeeds: string[];
  paymentIntegration: boolean;
  adminPanel: boolean;
  aiFeatures: boolean;
  aiDescription?: string;
  apiIntegrations?: string;
}

export interface SectionFAnswers {
  timeline: string;
  budgetRange: string;
  technicalLevel: string;
  mustHaveFeatures: string[];
  dealBreakers?: string;
}

// ─── Blueprint Interfaces ───

export interface BusinessBlueprintData {
  executiveSummary: string;
  valueProposition: string;
  idealCustomerProfile: string;
  monetizationPlan: Record<string, unknown>;
  competitivePositioning: string;
  goToMarketNotes: string;
}

export interface ProductBlueprintData {
  features: Array<{
    name: string;
    priority: 'must-have' | 'should-have' | 'nice-to-have';
    description: string;
    acceptanceCriteria: string[];
  }>;
  userRoles: Array<{ name: string; permissions: string[] }>;
  workflows: Array<{ name: string; steps: string[] }>;
  mvpScope: string;
}

export interface TechnicalBlueprintData {
  stackRecommendation: Record<string, string>;
  stackRationale: string;
  dataModelSchema: Record<string, unknown>;
  apiRoutes: Array<{ method: string; path: string; description: string }>;
  authArchitecture: string;
  paymentIntegration?: string;
  adminPanelStructure?: string;
  deploymentNotes: string;
}

export interface BuildBlueprintData {
  fileStructure: Record<string, string[]>;
  moduleBreakdown: Array<{ name: string; files: string[]; description: string }>;
  buildSequence: string[];
  generationParams: Record<string, unknown>;
  previewPayload: Record<string, unknown>;
}

// ─── Generation Settings Interface ───

export interface GenerationSettingsData {
  activePromptVersionId?: string;
  buildMode: 'quick_mvp' | 'standard' | 'comprehensive';
  intensity: 'conservative' | 'balanced' | 'creative';
  modules: {
    adminPanel: boolean;
    paymentIntegration: boolean;
    dashboardAnalytics: boolean;
    aiFeatures: boolean;
    emailNotifications: boolean;
  };
}
