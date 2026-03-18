// ─── Task Types ───

export enum AIModelTask {
  PROMPT_ARCHITECT = 'PROMPT_ARCHITECT',
  PROMPT_OPTIMIZATION = 'PROMPT_OPTIMIZATION',
  OPPORTUNITY_GENERATION = 'OPPORTUNITY_GENERATION',
  MARKET_GAP_GENERATION = 'MARKET_GAP_GENERATION',
  MARKET_INTELLIGENCE_SUMMARY = 'MARKET_INTELLIGENCE_SUMMARY',
  LEARN_COURSE_GENERATION = 'LEARN_COURSE_GENERATION',
  GLOSSARY_GENERATION = 'GLOSSARY_GENERATION',
  QUIZ_GENERATION = 'QUIZ_GENERATION',
  STRATEGY_DRAFT = 'STRATEGY_DRAFT',
  GROWTH_DRAFT = 'GROWTH_DRAFT',
  ASSISTANT_CHAT = 'ASSISTANT_CHAT',
  CODE_ARCHITECTURE = 'CODE_ARCHITECTURE',
  BUILD_REPAIR = 'BUILD_REPAIR',
  UX_WRITING = 'UX_WRITING',
  CLASSIFICATION = 'CLASSIFICATION',
  SUMMARIZATION = 'SUMMARIZATION',
}

// ─── Routing ───

export type RoutingMode =
  | 'local-first'
  | 'cloud-first'
  | 'balanced'
  | 'quality-first'
  | 'cheap';

export type ProviderName = 'gemini' | 'claude' | 'ollama' | 'lmstudio';

export type ProviderHealth = 'healthy' | 'degraded' | 'unavailable';

export interface RoutingDecision {
  provider: ProviderName;
  model: string;
  temperature: number;
  maxTokens: number;
  fallbackProvider: ProviderName | null;
  fallbackModel: string | null;
  routingReason: string;
}

// ─── Provider Interface ───

export interface AIProviderRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: AIRequestMetadata;
}

export interface AIRequestMetadata {
  userId?: string;
  projectId?: string;
  taskType: AIModelTask;
  routingOverride?: {
    provider?: ProviderName;
    model?: string;
  };
}

export interface NormalizedResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  provider: ProviderName;
  latencyMs: number;
}

export interface AIProvider {
  readonly name: ProviderName;
  readonly isLocal: boolean;

  chatCompletion(request: AIProviderRequest): Promise<NormalizedResponse>;
  structuredCompletion<T>(
    request: AIProviderRequest,
    schema?: object
  ): Promise<NormalizedResponse & { parsed: T }>;
}

// ─── Error Types ───

export class AIRuntimeError extends Error {
  constructor(
    message: string,
    public readonly provider: ProviderName | 'router',
    public readonly originalError?: Error,
    public readonly code: string = 'AI_RUNTIME_ERROR'
  ) {
    super(message);
    this.name = 'AIRuntimeError';
  }
}

// ─── Health Check ───

export interface HealthCheckResult {
  provider: ProviderName;
  status: ProviderHealth;
  latencyMs: number;
  model?: string;
  error?: string;
  checkedAt: Date;
}

// ─── Provider Registry ───

export interface ProviderRegistryEntry {
  provider: AIProvider;
  health: ProviderHealth;
  lastCheck: Date;
  consecutiveFailures: number;
}

export interface ProviderRegistrySummary {
  providers: Array<{
    name: ProviderName;
    health: ProviderHealth;
    isLocal: boolean;
    model: string;
    lastCheck: Date;
  }>;
  routingMode: RoutingMode;
  localEnabled: boolean;
  cloudEnabled: boolean;
}

// ─── Runtime Config ───

export interface AIRuntimeConfig {
  geminiApiKey: string | null;
  anthropicApiKey: string | null;
  ollamaBaseUrl: string;
  lmStudioBaseUrl: string;
  lmStudioModel: string | null;
  defaultLocalModel: string;
  defaultCloudModel: string;
  enableLocalModels: boolean;
  enableCloudModels: boolean;
  routingMode: RoutingMode;
}

// ─── Telemetry ───

export interface AIRequestLogData {
  userId: string | null;
  projectId: string | null;
  taskType: AIModelTask;
  provider: ProviderName;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  success: boolean;
  errorMessage: string | null;
  routingReason: string;
}

// ─── Context Builders ───

export interface ProjectContext {
  projectId: string;
  name: string;
  state: string;
  wizardAnswers: Record<string, string | null>;
  evaluation: {
    viabilityScores: Array<{
      totalScore: number;
      marketScore: number;
      productScore: number;
      financialScore: number;
      executionScore: number;
    }>;
    findings: Array<{
      severity: string;
      code: string;
      message: string;
    }>;
  };
  promptVersions: Array<{
    version: number;
    type: string;
    content: string;
    isActive: boolean;
  }>;
  build: {
    status: string | null;
    templateType: string | null;
  };
  learn: {
    courseExists: boolean;
    completedLessons: number;
    totalLessons: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    viabilityScore: number | null;
  }>;
  marketGaps: Array<{
    id: string;
    title: string;
    sector: string;
  }>;
  marketIntelligence: Array<{
    id: string;
    title: string;
    type: string;
    sector: string;
  }>;
  conversationSummary: {
    totalMessages: number;
    lastMessageAt: Date | null;
  };
}

export interface ArtifactContext {
  artifactId: string;
  projectId: string;
  type: string;
  title: string;
  content: string;
  relatedFindings: Array<{
    severity: string;
    code: string;
    message: string;
  }>;
  buildStatus: string | null;
}

// ─── Readiness Flags ───

export interface AIRuntimeCapabilities {
  chatCompletion: true;
  structuredCompletion: true;
  streaming: false;
  toolCalling: false;
}
