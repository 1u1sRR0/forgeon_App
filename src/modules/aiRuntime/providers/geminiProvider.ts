import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AIProvider,
  AIProviderRequest,
  NormalizedResponse,
  AIRuntimeConfig,
  ProviderName,
} from '../aiTypes';

export class GeminiProvider implements AIProvider {
  readonly name: ProviderName = 'gemini';
  readonly isLocal = false;

  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(config: AIRuntimeConfig) {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey!);
    this.modelName = config.defaultCloudModel;
  }

  async chatCompletion(request: AIProviderRequest): Promise<NormalizedResponse> {
    const start = Date.now();
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: request.systemPrompt,
    });
    const result = await model.generateContent(request.userPrompt);
    const usage = result.response.usageMetadata;
    return {
      content: result.response.text(),
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
      model: this.modelName,
      provider: 'gemini',
      latencyMs: Date.now() - start,
    };
  }

  async structuredCompletion<T>(
    request: AIProviderRequest,
    schema?: object,
  ): Promise<NormalizedResponse & { parsed: T }> {
    const start = Date.now();
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: request.systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        ...(schema ? { responseSchema: schema as any } : {}),
      },
    });
    const result = await model.generateContent(request.userPrompt);
    const usage = result.response.usageMetadata;
    const text = result.response.text();
    return {
      content: text,
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
      model: this.modelName,
      provider: 'gemini',
      latencyMs: Date.now() - start,
      parsed: JSON.parse(text) as T,
    };
  }
}
