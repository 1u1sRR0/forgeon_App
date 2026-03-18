import type { AIRuntimeConfig, RoutingMode } from './aiTypes';

export function getRuntimeConfig(): AIRuntimeConfig {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY || null,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    lmStudioBaseUrl: process.env.LM_STUDIO_BASE_URL || 'http://127.0.0.1:1234/v1',
    lmStudioModel: process.env.LM_STUDIO_MODEL || null,
    defaultLocalModel: process.env.DEFAULT_LOCAL_MODEL || process.env.OLLAMA_MODEL || 'llama3.1',
    defaultCloudModel: process.env.DEFAULT_CLOUD_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    enableLocalModels: process.env.ENABLE_LOCAL_MODELS !== 'false',
    enableCloudModels: process.env.ENABLE_CLOUD_MODELS !== 'false',
    routingMode: (process.env.AI_ROUTING_MODE as RoutingMode) || 'local-first',
  };
}
