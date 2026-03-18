import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import type { HealthCheckResult, AIRuntimeConfig, ProviderName } from './aiTypes';

const HEALTH_CHECK_TIMEOUT_MS = 5000;

/**
 * Gemini health check: lightweight generateContent('ping') with 1 max token.
 */
export async function checkGeminiHealth(
  config: AIRuntimeConfig,
): Promise<HealthCheckResult> {
  const start = Date.now();
  const provider: ProviderName = 'gemini';
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey!);
    const model = genAI.getGenerativeModel({
      model: config.defaultCloudModel,
      generationConfig: { maxOutputTokens: 1 },
    });
    await model.generateContent('ping');
    return {
      provider,
      status: 'healthy',
      latencyMs: Date.now() - start,
      model: config.defaultCloudModel,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      provider,
      status: 'unavailable',
      latencyMs: Date.now() - start,
      model: config.defaultCloudModel,
      error: error instanceof Error ? error.message : String(error),
      checkedAt: new Date(),
    };
  }
}

/**
 * Claude health check: lightweight chat.completions.create with 1 max token
 * using the openai SDK pointed at Anthropic's API.
 */
export async function checkClaudeHealth(
  config: AIRuntimeConfig,
): Promise<HealthCheckResult> {
  const start = Date.now();
  const provider: ProviderName = 'claude';
  const modelName = 'claude-sonnet-4-20250514';
  try {
    const client = new OpenAI({
      apiKey: config.anthropicApiKey!,
      baseURL: 'https://api.anthropic.com/v1',
      defaultHeaders: { 'anthropic-version': '2023-06-01' },
      timeout: HEALTH_CHECK_TIMEOUT_MS,
    });
    await client.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
    });
    return {
      provider,
      status: 'healthy',
      latencyMs: Date.now() - start,
      model: modelName,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      provider,
      status: 'unavailable',
      latencyMs: Date.now() - start,
      model: modelName,
      error: error instanceof Error ? error.message : String(error),
      checkedAt: new Date(),
    };
  }
}


/**
 * Ollama health check: GET /api/tags to verify host reachable + model in list.
 */
export async function checkOllamaHealth(
  config: AIRuntimeConfig,
): Promise<HealthCheckResult> {
  const start = Date.now();
  const provider: ProviderName = 'ollama';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      HEALTH_CHECK_TIMEOUT_MS,
    );
    const response = await fetch(
      `${config.ollamaBaseUrl}/api/tags`,
      { signal: controller.signal },
    );
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        provider,
        status: 'unavailable',
        latencyMs: Date.now() - start,
        model: config.defaultLocalModel,
        error: `Ollama returned HTTP ${response.status}`,
        checkedAt: new Date(),
      };
    }

    const data = (await response.json()) as {
      models?: Array<{ name: string }>;
    };
    const models = data.models ?? [];
    const modelFound = models.some(
      (m) =>
        m.name === config.defaultLocalModel ||
        m.name.startsWith(`${config.defaultLocalModel}:`),
    );

    return {
      provider,
      status: modelFound ? 'healthy' : 'unavailable',
      latencyMs: Date.now() - start,
      model: config.defaultLocalModel,
      error: modelFound
        ? undefined
        : `Model '${config.defaultLocalModel}' not found in Ollama`,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      provider,
      status: 'unavailable',
      latencyMs: Date.now() - start,
      model: config.defaultLocalModel,
      error: error instanceof Error ? error.message : String(error),
      checkedAt: new Date(),
    };
  }
}

/**
 * LM Studio health check: GET /models to verify endpoint reachable + model in list.
 */
export async function checkLMStudioHealth(
  config: AIRuntimeConfig,
): Promise<HealthCheckResult> {
  const start = Date.now();
  const provider: ProviderName = 'lmstudio';
  const modelName = config.lmStudioModel || 'local-model';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      HEALTH_CHECK_TIMEOUT_MS,
    );
    const response = await fetch(
      `${config.lmStudioBaseUrl}/models`,
      { signal: controller.signal },
    );
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        provider,
        status: 'unavailable',
        latencyMs: Date.now() - start,
        model: modelName,
        error: `LM Studio returned HTTP ${response.status}`,
        checkedAt: new Date(),
      };
    }

    const data = (await response.json()) as {
      data?: Array<{ id: string }>;
    };
    const models = data.data ?? [];
    const modelFound = models.some((m) => m.id === modelName);

    return {
      provider,
      status: modelFound ? 'healthy' : 'unavailable',
      latencyMs: Date.now() - start,
      model: modelName,
      error: modelFound
        ? undefined
        : `Model '${modelName}' not found in LM Studio`,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      provider,
      status: 'unavailable',
      latencyMs: Date.now() - start,
      model: modelName,
      error: error instanceof Error ? error.message : String(error),
      checkedAt: new Date(),
    };
  }
}
