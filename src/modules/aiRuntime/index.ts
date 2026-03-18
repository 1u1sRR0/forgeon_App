import {
  AIModelTask,
  AIRuntimeError,
  type AIRequestMetadata,
  type NormalizedResponse,
  type ProviderRegistrySummary,
} from './aiTypes';
import { getRuntimeConfig } from './runtimeConfig';
import { ProviderRegistry } from './providerRegistry';
import { ModelRouter } from './modelRouter';
import { logAIRequest, estimateCost } from './aiTelemetry';

// ─── Singleton Runtime ───

let registry: ProviderRegistry | null = null;
let router: ModelRouter | null = null;

async function getRuntime(): Promise<{ registry: ProviderRegistry; router: ModelRouter }> {
  if (!registry) {
    const config = getRuntimeConfig();
    registry = new ProviderRegistry(config);
    await registry.initialize();
    router = new ModelRouter(registry, config);
  }
  return { registry: registry!, router: router! };
}

// ─── Public API ───

export async function execute(
  task: AIModelTask,
  systemPrompt: string,
  userPrompt: string,
  metadata?: Omit<AIRequestMetadata, 'taskType'>,
): Promise<NormalizedResponse> {
  const { registry, router } = await getRuntime();
  const fullMetadata: AIRequestMetadata = { ...metadata, taskType: task };
  const decision = router.route(task, fullMetadata.routingOverride);

  const provider = registry.getProvider(decision.provider);
  if (!provider) {
    throw new AIRuntimeError(`No provider available for ${decision.provider}`, 'router');
  }

  const start = Date.now();
  try {
    const response = await provider.chatCompletion({
      systemPrompt,
      userPrompt,
      temperature: decision.temperature,
      maxTokens: decision.maxTokens,
      metadata: fullMetadata,
    });

    // Fire-and-forget telemetry
    logAIRequest({
      userId: metadata?.userId ?? null,
      projectId: metadata?.projectId ?? null,
      taskType: task,
      provider: response.provider,
      model: response.model,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      estimatedCostUsd: estimateCost(response.provider, response.model, response.inputTokens, response.outputTokens),
      latencyMs: response.latencyMs,
      success: true,
      errorMessage: null,
      routingReason: decision.routingReason,
    }).catch(() => {});

    return response;
  } catch (error) {
    // Try fallback if available
    if (decision.fallbackProvider) {
      const fallback = registry.getProvider(decision.fallbackProvider);
      if (fallback) {
        try {
          const response = await fallback.chatCompletion({
            systemPrompt,
            userPrompt,
            temperature: decision.temperature,
            maxTokens: decision.maxTokens,
            metadata: fullMetadata,
          });

          logAIRequest({
            userId: metadata?.userId ?? null,
            projectId: metadata?.projectId ?? null,
            taskType: task,
            provider: response.provider,
            model: response.model,
            inputTokens: response.inputTokens,
            outputTokens: response.outputTokens,
            estimatedCostUsd: estimateCost(response.provider, response.model, response.inputTokens, response.outputTokens),
            latencyMs: response.latencyMs,
            success: true,
            errorMessage: null,
            routingReason: `${decision.routingReason} (fallback from ${decision.provider})`,
          }).catch(() => {});

          return response;
        } catch {
          // Fallback also failed — fall through to error logging
        }
      }
    }

    // Log failure
    logAIRequest({
      userId: metadata?.userId ?? null,
      projectId: metadata?.projectId ?? null,
      taskType: task,
      provider: decision.provider,
      model: decision.model,
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostUsd: 0,
      latencyMs: Date.now() - start,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
      routingReason: decision.routingReason,
    }).catch(() => {});

    throw new AIRuntimeError(
      `AI call failed for task ${task}: ${error instanceof Error ? error.message : String(error)}`,
      decision.provider,
      error instanceof Error ? error : undefined,
    );
  }
}

export async function executeStructured<T>(
  task: AIModelTask,
  systemPrompt: string,
  userPrompt: string,
  schema?: object,
  metadata?: Omit<AIRequestMetadata, 'taskType'>,
): Promise<NormalizedResponse & { parsed: T }> {
  const { registry, router } = await getRuntime();
  const fullMetadata: AIRequestMetadata = { ...metadata, taskType: task };
  const decision = router.route(task, fullMetadata.routingOverride);

  const provider = registry.getProvider(decision.provider);
  if (!provider) {
    throw new AIRuntimeError(`No provider available for ${decision.provider}`, 'router');
  }

  const start = Date.now();
  try {
    const response = await provider.structuredCompletion<T>(
      {
        systemPrompt,
        userPrompt,
        temperature: decision.temperature,
        maxTokens: decision.maxTokens,
        metadata: fullMetadata,
      },
      schema,
    );

    logAIRequest({
      userId: metadata?.userId ?? null,
      projectId: metadata?.projectId ?? null,
      taskType: task,
      provider: response.provider,
      model: response.model,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      estimatedCostUsd: estimateCost(response.provider, response.model, response.inputTokens, response.outputTokens),
      latencyMs: response.latencyMs,
      success: true,
      errorMessage: null,
      routingReason: decision.routingReason,
    }).catch(() => {});

    return response;
  } catch (error) {
    if (decision.fallbackProvider) {
      const fallback = registry.getProvider(decision.fallbackProvider);
      if (fallback) {
        try {
          const response = await fallback.structuredCompletion<T>(
            {
              systemPrompt,
              userPrompt,
              temperature: decision.temperature,
              maxTokens: decision.maxTokens,
              metadata: fullMetadata,
            },
            schema,
          );

          logAIRequest({
            userId: metadata?.userId ?? null,
            projectId: metadata?.projectId ?? null,
            taskType: task,
            provider: response.provider,
            model: response.model,
            inputTokens: response.inputTokens,
            outputTokens: response.outputTokens,
            estimatedCostUsd: estimateCost(response.provider, response.model, response.inputTokens, response.outputTokens),
            latencyMs: response.latencyMs,
            success: true,
            errorMessage: null,
            routingReason: `${decision.routingReason} (fallback from ${decision.provider})`,
          }).catch(() => {});

          return response;
        } catch {
          // Fallback also failed
        }
      }
    }

    logAIRequest({
      userId: metadata?.userId ?? null,
      projectId: metadata?.projectId ?? null,
      taskType: task,
      provider: decision.provider,
      model: decision.model,
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostUsd: 0,
      latencyMs: Date.now() - start,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
      routingReason: decision.routingReason,
    }).catch(() => {});

    throw new AIRuntimeError(
      `Structured AI call failed for task ${task}: ${error instanceof Error ? error.message : String(error)}`,
      decision.provider,
      error instanceof Error ? error : undefined,
    );
  }
}

export async function getRuntimeDiagnostics(): Promise<ProviderRegistrySummary> {
  const { registry } = await getRuntime();
  return registry.getSummary();
}

// Re-export commonly used types for convenience
export { AIModelTask, AIRuntimeError } from './aiTypes';
export type { NormalizedResponse, AIRequestMetadata, ProviderRegistrySummary } from './aiTypes';
