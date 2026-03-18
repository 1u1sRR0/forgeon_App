import prisma from '@/lib/prisma';
import type { AIRequestLogData, ProviderName } from './aiTypes';

// ─── Cost Rates (per 1K tokens) ───

const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  'gemini-2.5-flash': { input: 0.00015, output: 0.0006 },
  'gemini-2.0-flash': { input: 0.0001, output: 0.0004 },
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
};

// ─── Cost Estimation ───

export function estimateCost(
  provider: ProviderName,
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  if (provider === 'ollama' || provider === 'lmstudio') return 0;
  const rates = COST_PER_1K_TOKENS[model];
  if (!rates) return 0;
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

// ─── Telemetry Logger ───

export async function logAIRequest(data: AIRequestLogData): Promise<void> {
  try {
    await prisma.aIRequestLog.create({ data });
  } catch (error) {
    console.error('[AIRuntime] Telemetry log failed:', error);
    // Fire-and-forget: never throw — telemetry failures must not break AI calls
  }
}
