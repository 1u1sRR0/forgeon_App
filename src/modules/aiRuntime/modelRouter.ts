import {
  AIModelTask,
  AIRuntimeError,
  type AIRuntimeConfig,
  type ProviderName,
  type RoutingDecision,
  type RoutingMode,
} from './aiTypes';
import type { ProviderRegistry } from './providerRegistry';

// ─── Task Defaults ───

const TASK_DEFAULTS: Record<AIModelTask, { temperature: number; maxTokens: number }> = {
  [AIModelTask.PROMPT_ARCHITECT]:            { temperature: 0.7, maxTokens: 4096 },
  [AIModelTask.PROMPT_OPTIMIZATION]:         { temperature: 0.6, maxTokens: 2048 },
  [AIModelTask.OPPORTUNITY_GENERATION]:      { temperature: 0.8, maxTokens: 4096 },
  [AIModelTask.MARKET_GAP_GENERATION]:       { temperature: 0.8, maxTokens: 4096 },
  [AIModelTask.MARKET_INTELLIGENCE_SUMMARY]: { temperature: 0.5, maxTokens: 2048 },
  [AIModelTask.LEARN_COURSE_GENERATION]:     { temperature: 0.7, maxTokens: 8192 },
  [AIModelTask.GLOSSARY_GENERATION]:         { temperature: 0.3, maxTokens: 2048 },
  [AIModelTask.QUIZ_GENERATION]:             { temperature: 0.5, maxTokens: 2048 },
  [AIModelTask.STRATEGY_DRAFT]:              { temperature: 0.7, maxTokens: 4096 },
  [AIModelTask.GROWTH_DRAFT]:                { temperature: 0.7, maxTokens: 4096 },
  [AIModelTask.ASSISTANT_CHAT]:              { temperature: 0.7, maxTokens: 2048 },
  [AIModelTask.CODE_ARCHITECTURE]:           { temperature: 0.4, maxTokens: 8192 },
  [AIModelTask.BUILD_REPAIR]:                { temperature: 0.3, maxTokens: 8192 },
  [AIModelTask.UX_WRITING]:                  { temperature: 0.8, maxTokens: 1024 },
  [AIModelTask.CLASSIFICATION]:              { temperature: 0.2, maxTokens: 512 },
  [AIModelTask.SUMMARIZATION]:               { temperature: 0.3, maxTokens: 2048 },
};

// ─── Task Classification ───

const CLOUD_ONLY_TASKS: Set<AIModelTask> = new Set([
  AIModelTask.PROMPT_ARCHITECT,
  AIModelTask.CODE_ARCHITECTURE,
  AIModelTask.BUILD_REPAIR,
]);

const HIGH_QUALITY_TASKS: Set<AIModelTask> = new Set([
  AIModelTask.PROMPT_ARCHITECT,
  AIModelTask.CODE_ARCHITECTURE,
  AIModelTask.BUILD_REPAIR,
]);

const LOW_QUALITY_TASKS: Set<AIModelTask> = new Set([
  AIModelTask.GLOSSARY_GENERATION,
  AIModelTask.QUIZ_GENERATION,
  AIModelTask.UX_WRITING,
  AIModelTask.CLASSIFICATION,
  AIModelTask.SUMMARIZATION,
]);

// ─── Smart Task-to-Provider Mapping (balanced mode) ───

export const SMART_TASK_MAPPING: Record<AIModelTask, ProviderName[]> = {
  // HIGH_QUALITY → Claude first (best reasoning and code)
  [AIModelTask.PROMPT_ARCHITECT]:            ['claude', 'gemini', 'ollama', 'lmstudio'],
  [AIModelTask.CODE_ARCHITECTURE]:           ['claude', 'gemini', 'ollama', 'lmstudio'],
  [AIModelTask.BUILD_REPAIR]:                ['claude', 'gemini', 'ollama', 'lmstudio'],

  // MEDIUM_HIGH → Gemini first, Claude fallback
  [AIModelTask.PROMPT_OPTIMIZATION]:         ['gemini', 'claude', 'ollama', 'lmstudio'],
  [AIModelTask.MARKET_INTELLIGENCE_SUMMARY]: ['gemini', 'claude', 'ollama', 'lmstudio'],

  // MEDIUM → Gemini first (fast, creative/conversational)
  [AIModelTask.OPPORTUNITY_GENERATION]:      ['gemini', 'claude', 'lmstudio', 'ollama'],
  [AIModelTask.MARKET_GAP_GENERATION]:       ['gemini', 'claude', 'lmstudio', 'ollama'],
  [AIModelTask.LEARN_COURSE_GENERATION]:     ['gemini', 'claude', 'lmstudio', 'ollama'],
  [AIModelTask.STRATEGY_DRAFT]:              ['gemini', 'claude', 'lmstudio', 'ollama'],
  [AIModelTask.GROWTH_DRAFT]:                ['gemini', 'claude', 'lmstudio', 'ollama'],
  [AIModelTask.ASSISTANT_CHAT]:              ['gemini', 'claude', 'lmstudio', 'ollama'],

  // LOW_QUALITY → Local first (simple tasks, no cloud needed)
  [AIModelTask.GLOSSARY_GENERATION]:         ['lmstudio', 'ollama', 'gemini', 'claude'],
  [AIModelTask.QUIZ_GENERATION]:             ['lmstudio', 'ollama', 'gemini', 'claude'],
  [AIModelTask.UX_WRITING]:                  ['lmstudio', 'ollama', 'gemini', 'claude'],
  [AIModelTask.CLASSIFICATION]:              ['lmstudio', 'ollama', 'gemini', 'claude'],
  [AIModelTask.SUMMARIZATION]:               ['lmstudio', 'ollama', 'gemini', 'claude'],
};

// ─── Model Router ───

export class ModelRouter {
  private registry: ProviderRegistry;
  private config: AIRuntimeConfig;

  constructor(registry: ProviderRegistry, config: AIRuntimeConfig) {
    this.registry = registry;
    this.config = config;
  }

  route(
    task: AIModelTask,
    override?: { provider?: ProviderName; model?: string },
  ): RoutingDecision {
    const defaults = TASK_DEFAULTS[task];

    // Handle routing override
    if (override?.provider) {
      const health = this.registry.getProviderHealth(override.provider);
      if (health === 'healthy') {
        const model = override.model || this.getModelForProvider(override.provider);
        const preferenceOrder = this.getPreferenceOrder(task);
        const fallback = this.findFallback(override.provider, preferenceOrder);
        return {
          provider: override.provider,
          model,
          temperature: defaults.temperature,
          maxTokens: defaults.maxTokens,
          fallbackProvider: fallback?.provider ?? null,
          fallbackModel: fallback?.model ?? null,
          routingReason: `Override: forced provider ${override.provider}`,
        };
      }
    }

    // Get preference order based on routing mode and task
    const preferenceOrder = this.getPreferenceOrder(task);

    // Find first healthy provider in preference order
    let primaryProvider: ProviderName | null = null;
    for (const candidate of preferenceOrder) {
      if (this.registry.getProviderHealth(candidate) === 'healthy') {
        primaryProvider = candidate;
        break;
      }
    }

    if (!primaryProvider) {
      throw new AIRuntimeError(
        `No providers available for task ${task}. Attempted: ${preferenceOrder.join(', ')}`,
        'router',
      );
    }

    const fallback = this.findFallback(primaryProvider, preferenceOrder);

    return {
      provider: primaryProvider,
      model: this.getModelForProvider(primaryProvider),
      temperature: defaults.temperature,
      maxTokens: defaults.maxTokens,
      fallbackProvider: fallback?.provider ?? null,
      fallbackModel: fallback?.model ?? null,
      routingReason: this.buildRoutingReason(task, primaryProvider, this.config.routingMode),
    };
  }

  private getPreferenceOrder(task: AIModelTask): ProviderName[] {
    const mode = this.config.routingMode;
    const isCloudOnly = CLOUD_ONLY_TASKS.has(task);

    switch (mode) {
      case 'local-first':
        if (isCloudOnly) {
          return ['gemini', 'claude'];
        }
        return ['lmstudio', 'ollama', 'gemini', 'claude'];

      case 'cloud-first':
        return ['gemini', 'claude', 'lmstudio', 'ollama'];

      case 'balanced':
        return this.getBalancedOrder(task);

      case 'quality-first':
        return ['claude', 'gemini', 'lmstudio', 'ollama'];

      case 'cheap':
        return ['lmstudio', 'ollama', 'gemini', 'claude'];

      default:
        return ['gemini', 'claude', 'lmstudio', 'ollama'];
    }
  }

  private getBalancedOrder(task: AIModelTask): ProviderName[] {
    return SMART_TASK_MAPPING[task] ?? ['gemini', 'claude', 'lmstudio', 'ollama'];
  }

  private findFallback(
    primary: ProviderName,
    preferenceOrder: ProviderName[],
  ): { provider: ProviderName; model: string } | null {
    for (const candidate of preferenceOrder) {
      if (candidate === primary) continue;
      if (this.registry.getProviderHealth(candidate) === 'healthy') {
        return {
          provider: candidate,
          model: this.getModelForProvider(candidate),
        };
      }
    }
    return null;
  }

  private getModelForProvider(provider: ProviderName): string {
    switch (provider) {
      case 'gemini':
        return this.config.defaultCloudModel;
      case 'claude':
        return 'claude-sonnet-4-20250514';
      case 'ollama':
        return this.config.defaultLocalModel;
      case 'lmstudio':
        return this.config.lmStudioModel || 'local-model';
    }
  }

  private buildRoutingReason(
    task: AIModelTask,
    provider: ProviderName,
    mode: RoutingMode,
  ): string {
    const isCloudOnly = CLOUD_ONLY_TASKS.has(task);
    if (isCloudOnly) {
      return `Task ${task} is cloud-only; selected ${provider} via ${mode} policy`;
    }
    return `Task ${task} routed to ${provider} via ${mode} policy`;
  }
}
