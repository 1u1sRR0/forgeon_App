import OpenAI from 'openai';
import type {
  AIProvider,
  AIProviderRequest,
  NormalizedResponse,
  AIRuntimeConfig,
  ProviderName,
} from '../aiTypes';

export class ClaudeProvider implements AIProvider {
  readonly name: ProviderName = 'claude';
  readonly isLocal = false;

  private client: OpenAI;
  private modelName: string;

  constructor(config: AIRuntimeConfig) {
    this.client = new OpenAI({
      apiKey: config.anthropicApiKey!,
      baseURL: 'https://api.anthropic.com/v1',
      defaultHeaders: { 'anthropic-version': '2023-06-01' },
    });
    this.modelName = 'claude-sonnet-4-20250514';
  }

  async chatCompletion(request: AIProviderRequest): Promise<NormalizedResponse> {
    const start = Date.now();
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      max_tokens: request.maxTokens ?? 2048,
    });
    return {
      content: response.choices[0]?.message?.content ?? '',
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
      model: this.modelName,
      provider: 'claude',
      latencyMs: Date.now() - start,
    };
  }

  async structuredCompletion<T>(
    request: AIProviderRequest,
    _schema?: object,
  ): Promise<NormalizedResponse & { parsed: T }> {
    const start = Date.now();
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'system',
          content: request.systemPrompt + '\n\nRespond ONLY with valid JSON.',
        },
        { role: 'user', content: request.userPrompt },
      ],
      max_tokens: request.maxTokens ?? 2048,
    });
    const text = response.choices[0]?.message?.content ?? '';
    return {
      content: text,
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
      model: this.modelName,
      provider: 'claude',
      latencyMs: Date.now() - start,
      parsed: JSON.parse(text) as T,
    };
  }
}
