import type {
  AIProvider,
  AIRuntimeConfig,
  ProviderName,
  ProviderHealth,
  ProviderRegistryEntry,
  ProviderRegistrySummary,
  HealthCheckResult,
} from './aiTypes';
import {
  checkGeminiHealth,
  checkClaudeHealth,
  checkOllamaHealth,
  checkLMStudioHealth,
} from './healthChecks';
import { GeminiProvider } from './providers/geminiProvider';
import { ClaudeProvider } from './providers/claudeProvider';
import { OllamaProvider } from './providers/ollamaProvider';
import { LMStudioProvider } from './providers/lmStudioProvider';

export class ProviderRegistry {
  private entries: Map<ProviderName, ProviderRegistryEntry>;
  private config: AIRuntimeConfig;

  constructor(config: AIRuntimeConfig) {
    this.config = config;
    this.entries = new Map();
  }

  async initialize(): Promise<void> {
    // Register cloud providers if enabled
    if (this.config.enableCloudModels) {
      if (this.config.geminiApiKey) {
        this.register(new GeminiProvider(this.config));
      } else {
        console.log('[AIRuntime] Skipping gemini: no API key configured');
      }

      if (this.config.anthropicApiKey) {
        this.register(new ClaudeProvider(this.config));
      } else {
        console.log('[AIRuntime] Skipping claude: no API key configured');
      }
    }

    // Register local providers if enabled
    if (this.config.enableLocalModels) {
      // Ollama is always registered when local is enabled; health check validates availability
      this.register(new OllamaProvider(this.config));

      if (this.config.lmStudioModel) {
        this.register(new LMStudioProvider(this.config));
      } else {
        console.log('[AIRuntime] Skipping lmstudio: no LM_STUDIO_MODEL configured');
      }
    }

    // Run initial health checks for all registered providers
    const names = Array.from(this.entries.keys());
    await Promise.all(names.map((name) => this.refreshHealth(name)));
  }


  async refreshHealth(provider: ProviderName): Promise<HealthCheckResult> {
    const entry = this.entries.get(provider);
    if (!entry) {
      return {
        provider,
        status: 'unavailable',
        latencyMs: 0,
        error: `Provider '${provider}' is not registered`,
        checkedAt: new Date(),
      };
    }

    const previousHealth = entry.health;
    let result: HealthCheckResult;

    switch (provider) {
      case 'gemini':
        result = await checkGeminiHealth(this.config);
        break;
      case 'claude':
        result = await checkClaudeHealth(this.config);
        break;
      case 'ollama':
        result = await checkOllamaHealth(this.config);
        break;
      case 'lmstudio':
        result = await checkLMStudioHealth(this.config);
        break;
      default:
        result = {
          provider,
          status: 'unavailable',
          latencyMs: 0,
          error: `Unknown provider: ${provider}`,
          checkedAt: new Date(),
        };
    }

    // Update entry health status
    entry.health = result.status;
    entry.lastCheck = result.checkedAt;

    if (result.status === 'unavailable') {
      entry.consecutiveFailures += 1;
    } else {
      entry.consecutiveFailures = 0;
    }

    // Log warning on transition to unavailable
    if (previousHealth !== 'unavailable' && result.status === 'unavailable') {
      console.warn(
        `[AIRuntime] Provider ${provider} is now unavailable: ${result.error ?? 'unknown reason'}`,
      );
    }

    return result;
  }

  getHealthyProviders(isLocal?: boolean): AIProvider[] {
    const healthy: AIProvider[] = [];
    for (const entry of this.entries.values()) {
      if (entry.health !== 'healthy') continue;
      if (isLocal !== undefined && entry.provider.isLocal !== isLocal) continue;
      healthy.push(entry.provider);
    }
    return healthy;
  }

  getProvider(name: ProviderName): AIProvider | null {
    const entry = this.entries.get(name);
    return entry ? entry.provider : null;
  }

  getProviderHealth(name: ProviderName): ProviderHealth {
    const entry = this.entries.get(name);
    return entry ? entry.health : 'unavailable';
  }

  getSummary(): ProviderRegistrySummary {
    const providers: ProviderRegistrySummary['providers'] = [];
    for (const [name, entry] of this.entries) {
      providers.push({
        name,
        health: entry.health,
        isLocal: entry.provider.isLocal,
        model: name === 'gemini' ? this.config.defaultCloudModel
          : name === 'claude' ? 'claude-sonnet-4-20250514'
          : name === 'ollama' ? this.config.defaultLocalModel
          : this.config.lmStudioModel || 'local-model',
        lastCheck: entry.lastCheck,
      });
    }
    return {
      providers,
      routingMode: this.config.routingMode,
      localEnabled: this.config.enableLocalModels,
      cloudEnabled: this.config.enableCloudModels,
    };
  }

  private register(provider: AIProvider): void {
    this.entries.set(provider.name, {
      provider,
      health: 'unavailable', // starts unavailable until health check passes
      lastCheck: new Date(),
      consecutiveFailures: 0,
    });
  }
}
