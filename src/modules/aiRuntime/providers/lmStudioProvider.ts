import OpenAI from 'openai';
import type {
  AIProvider,
  AIProviderRequest,
  NormalizedResponse,
  AIRuntimeConfig,
  ProviderName,
} from '../aiTypes';

export class LMStudioProvider implements AIProvider {
  readonly name: ProviderName = 'lmstudio';
  readonly isLocal = true;

  private client: OpenAI;
  private modelName: string;

  constructor(config: AIRuntimeConfig) {
    this.client = new OpenAI({
      apiKey: 'lm-studio',
      baseURL: config.lmStudioBaseUrl,
    });
    this.modelName = config.lmStudioModel || 'local-model';
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
      provider: 'lmstudio',
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
      provider: 'lmstudio',
      latencyMs: Date.now() - start,
      parsed: JSON.parse(text) as T,
    };
  }
}
