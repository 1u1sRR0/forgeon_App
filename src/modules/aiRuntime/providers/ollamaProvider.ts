import { Ollama } from 'ollama';
import type {
  AIProvider,
  AIProviderRequest,
  NormalizedResponse,
  AIRuntimeConfig,
  ProviderName,
} from '../aiTypes';

export class OllamaProvider implements AIProvider {
  readonly name: ProviderName = 'ollama';
  readonly isLocal = true;

  private ollama: Ollama;
  private modelName: string;

  constructor(config: AIRuntimeConfig) {
    this.ollama = new Ollama({ host: config.ollamaBaseUrl });
    this.modelName = config.defaultLocalModel;
  }

  async chatCompletion(request: AIProviderRequest): Promise<NormalizedResponse> {
    const start = Date.now();
    const response = await this.ollama.chat({
      model: this.modelName,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      stream: false,
    });
    return {
      content: response.message.content,
      inputTokens: response.prompt_eval_count ?? 0,
      outputTokens: response.eval_count ?? 0,
      model: this.modelName,
      provider: 'ollama',
      latencyMs: Date.now() - start,
    };
  }

  async structuredCompletion<T>(
    request: AIProviderRequest,
    _schema?: object,
  ): Promise<NormalizedResponse & { parsed: T }> {
    const start = Date.now();
    const response = await this.ollama.chat({
      model: this.modelName,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      format: 'json',
      stream: false,
    });
    const text = response.message.content;
    return {
      content: text,
      inputTokens: response.prompt_eval_count ?? 0,
      outputTokens: response.eval_count ?? 0,
      model: this.modelName,
      provider: 'ollama',
      latencyMs: Date.now() - start,
      parsed: JSON.parse(text) as T,
    };
  }
}
