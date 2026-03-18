import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ollama } from 'ollama';

// ─── Interface ───

export interface MultiAgentAIProvider {
  generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema?: object
  ): Promise<T>;

  generateText(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string>;
}

// ─── Gemini Provider ───

export class GeminiAgentProvider implements MultiAgentAIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema?: object
  ): Promise<T> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: 'application/json',
          ...(schema ? { responseSchema: schema as never } : {}),
        },
      });

      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      return JSON.parse(text) as T;
    } catch (error: unknown) {
      console.error('[MultiAgent] Gemini structured generation error:', error);
      throw error;
    }
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(userPrompt);
      return result.response.text() || '';
    } catch (error: unknown) {
      console.error('[MultiAgent] Gemini text generation error:', error);
      throw error;
    }
  }
}


// ─── OpenAI Provider ───

export class OpenAIAgentProvider implements MultiAgentAIProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    _schema?: object
  ): Promise<T> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: `${systemPrompt}\n\nRespond ONLY with valid JSON.` },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || '{}';
      return JSON.parse(text) as T;
    } catch (error: unknown) {
      console.error('[MultiAgent] OpenAI structured generation error:', error);
      throw error;
    }
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: unknown) {
      console.error('[MultiAgent] OpenAI text generation error:', error);
      throw error;
    }
  }
}

// ─── Ollama Provider (local or cloud) ───

export class OllamaAgentProvider implements MultiAgentAIProvider {
  private ollama: Ollama;
  private model: string;
  private isCloud: boolean;

  constructor() {
    const apiKey = process.env.OLLAMA_API_KEY;
    this.isCloud = !!apiKey;

    if (apiKey) {
      // Ollama Cloud: use ollama.com/api with Bearer auth
      this.ollama = new Ollama({
        host: 'https://ollama.com/api',
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
    } else {
      // Local Ollama
      this.ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
    }
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    _schema?: object
  ): Promise<T> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: `${systemPrompt}\n\nRespond ONLY with valid JSON.` },
          { role: 'user', content: userPrompt },
        ],
        format: 'json',
      });

      const text = response.message.content || '{}';
      return JSON.parse(text) as T;
    } catch (error: unknown) {
      console.error('[MultiAgent] Ollama structured generation error:', error);
      throw error;
    }
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      return response.message.content || '';
    } catch (error: unknown) {
      console.error('[MultiAgent] Ollama text generation error:', error);
      throw error;
    }
  }
}

// ─── Mock Provider (fallback) ───

export class MockAgentProvider implements MultiAgentAIProvider {
  async generateStructured<T>(
    _systemPrompt: string,
    _userPrompt: string,
    _schema?: object
  ): Promise<T> {
    console.warn('[MultiAgent] ⚠️ MOCK provider used for structured generation — no real AI providers available');
    return {} as T;
  }

  async generateText(
    _systemPrompt: string,
    _userPrompt: string
  ): Promise<string> {
    console.warn('[MultiAgent] ⚠️ MOCK provider used for text generation — no real AI providers available');
    return '[Mock] AI response placeholder — configure GEMINI_API_KEY or OPENAI_API_KEY for real generation.';
  }
}

// ─── Provider with auto-fallback (Gemini → OpenAI → Mock) ───

class FallbackAgentProvider implements MultiAgentAIProvider {
  private providers: MultiAgentAIProvider[];

  constructor(providers: MultiAgentAIProvider[]) {
    this.providers = providers;
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema?: object
  ): Promise<T> {
    const errors: string[] = [];
    for (let i = 0; i < this.providers.length; i++) {
      try {
        const result = await this.providers[i].generateStructured<T>(systemPrompt, userPrompt, schema);
        if (i > 0) console.log(`[MultiAgent] Provider ${i} (${this.providers[i].constructor.name}) succeeded after ${i} failures`);
        return result;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        errors.push(`Provider ${i} (${this.providers[i].constructor.name}): ${msg}`);
        console.error(`[MultiAgent] Provider ${i} (${this.providers[i].constructor.name}) FAILED for structured:`, msg);
        if (i === this.providers.length - 1) {
          console.error('[MultiAgent] ALL providers failed:', errors);
          throw error;
        }
      }
    }
    throw new Error('All providers failed');
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const errors: string[] = [];
    for (let i = 0; i < this.providers.length; i++) {
      try {
        const result = await this.providers[i].generateText(systemPrompt, userPrompt);
        if (i > 0) console.log(`[MultiAgent] Provider ${i} (${this.providers[i].constructor.name}) succeeded after ${i} failures`);
        return result;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        errors.push(`Provider ${i} (${this.providers[i].constructor.name}): ${msg}`);
        console.error(`[MultiAgent] Provider ${i} (${this.providers[i].constructor.name}) FAILED for text:`, msg);
        if (i === this.providers.length - 1) {
          console.error('[MultiAgent] ALL providers failed:', errors);
          throw error;
        }
      }
    }
    throw new Error('All providers failed');
  }
}

// ─── AI Runtime Provider (delegates to unified AI Runtime) ───

class AIRuntimeAgentProvider implements MultiAgentAIProvider {
  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema?: object
  ): Promise<T> {
    const { executeStructured } = await import('@/modules/aiRuntime');
    const { AIModelTask } = await import('@/modules/aiRuntime/aiTypes');
    const response = await executeStructured<T>(
      AIModelTask.PROMPT_ARCHITECT,
      systemPrompt,
      userPrompt,
      schema
    );
    return response.parsed;
  }

  async generateText(
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const { execute } = await import('@/modules/aiRuntime');
    const { AIModelTask } = await import('@/modules/aiRuntime/aiTypes');
    const response = await execute(
      AIModelTask.PROMPT_ARCHITECT,
      systemPrompt,
      userPrompt
    );
    return response.content;
  }
}

// ─── Legacy Provider Selection (Gemini > OpenAI > Ollama > Mock, with auto-fallback) ───

function getLegacyProviderChain(): MultiAgentAIProvider {
  const providers: MultiAgentAIProvider[] = [];

  console.log('[MultiAgent] ENV check — GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `set (${process.env.GEMINI_API_KEY.substring(0, 10)}...)` : 'NOT SET');
  console.log('[MultiAgent] ENV check — OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `set (${process.env.OPENAI_API_KEY.substring(0, 10)}...)` : 'NOT SET');
  console.log('[MultiAgent] ENV check — OLLAMA_ENABLED:', process.env.OLLAMA_ENABLED);

  if (process.env.GEMINI_API_KEY) {
    console.log('[MultiAgent] Adding Gemini provider (PRIMARY) with model:', process.env.GEMINI_MODEL || 'gemini-2.0-flash');
    providers.push(new GeminiAgentProvider());
  }

  if (process.env.OPENAI_API_KEY) {
    console.log('[MultiAgent] Adding OpenAI provider (SECONDARY) with model:', process.env.OPENAI_MODEL || 'gpt-4o-mini');
    providers.push(new OpenAIAgentProvider());
  }

  if (process.env.OLLAMA_ENABLED === 'true') {
    const mode = process.env.OLLAMA_API_KEY ? 'cloud' : 'local';
    console.log(`[MultiAgent] Adding Ollama provider (TERTIARY, ${mode}) with model:`, process.env.OLLAMA_MODEL || 'llama3.2');
    providers.push(new OllamaAgentProvider());
  }

  providers.push(new MockAgentProvider());

  if (providers.length === 1) return providers[0];
  return new FallbackAgentProvider(providers);
}

// ─── Provider Selection (AI Runtime first, legacy chain as fallback) ───

export function getMultiAgentProvider(): MultiAgentAIProvider {
  // Check if AI Runtime is available via env vars it supports
  const hasAIRuntime =
    !!process.env.AI_ROUTING_MODE ||
    !!process.env.GEMINI_API_KEY ||
    !!process.env.ANTHROPIC_API_KEY ||
    process.env.ENABLE_LOCAL_MODELS === 'true';

  if (hasAIRuntime) {
    console.log('[MultiAgent] Using AIRuntimeAgentProvider (delegating to unified AI Runtime)');
    // Wrap AIRuntimeAgentProvider with legacy chain as fallback
    return new FallbackAgentProvider([
      new AIRuntimeAgentProvider(),
      getLegacyProviderChain(),
    ]);
  }

  // No AI Runtime indicators — use legacy provider chain
  console.log('[MultiAgent] AI Runtime not configured, using legacy provider chain');
  return getLegacyProviderChain();
}
