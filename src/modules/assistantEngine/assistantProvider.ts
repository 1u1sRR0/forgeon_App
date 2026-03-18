import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ollama } from 'ollama';
import { UserContext } from './userContextBuilder';

export interface AssistantProvider {
  generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string>;
}

function buildSystemPrompt(context: UserContext): string {
  const userName = context.userName || 'the user';
  const projectsSummary = context.projects.length > 0
    ? context.projects.map((p) =>
        `- "${p.name}" (${p.state})${p.viabilityScore ? ` — viability: ${p.viabilityScore}/100` : ''}`
      ).join('\n')
    : 'No projects yet.';

  return `You are the Forgeon Assistant — a startup CTO, product strategist, and Forgeon platform expert.

You are chatting with ${userName}. Be helpful, direct, and technical when needed. You can answer ANY question freely — about startups, technology, business, coding, or anything else. Prioritize Forgeon context when relevant but don't restrict yourself to it.

FORGEON PLATFORM CONTEXT:
Forgeon is a Structured Startup Operating System that transforms ideas into validated, deployable digital startups.

Core systems:
- Discover: Find startup opportunities & market gaps
- Market Intelligence: Real-time market insights, trends, sector analysis
- Project Wizard: Structure startup ideas step by step
- Evaluation Engine: 5 AI agents score viability (Market, Product, Financial, Technical, Devil's Advocate)
- Build System: Auto-generate MVP codebase (Next.js + Prisma + PostgreSQL)
- Learn Hub: Personalized courses per project
- Prompt Builder: Craft and optimize prompts
- Assistant: That's you!

USER'S PROJECTS:
${projectsSummary}

Stats: ${context.stats.totalProjects} projects, ${(context.stats as any).evaluatedProjects || 0} evaluated, ${(context.stats as any).builtProjects || 0} built

BEHAVIOR:
- Be conversational, warm, and direct
- Use markdown for formatting (bold, lists, code blocks)
- Answer in the same language the user writes in
- Give actionable advice
- Don't be overly verbose
- You can answer anything — coding, business, life, whatever they ask`;
}

// ─── Gemini Provider (FREE) ───
export class GeminiProvider implements AssistantProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: buildSystemPrompt(context),
      });

      const chat = model.startChat({
        history: history.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      });

      const result = await chat.sendMessage(message);
      return result.response.text() || 'No response generated.';
    } catch (error: unknown) {
      console.error('Gemini API error, attempting fallback:', error);
      // Auto-fallback to OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        console.log('[Assistant] Gemini failed, falling back to OpenAI');
        try {
          const fallback = new OpenAIProvider();
          return await fallback.generateResponse(context, message, history);
        } catch (fallbackError) {
          console.error('OpenAI fallback also failed:', fallbackError);
        }
      }
      // Try Ollama as next fallback
      console.log('[Assistant] Trying Ollama fallback (local)');
      try {
        const ollamaFallback = new OllamaProvider();
        return await ollamaFallback.generateResponse(context, message, history);
      } catch (ollamaError) {
        console.error('Ollama fallback also failed:', ollamaError);
      }
      // Final fallback: Mock provider (always works)
      console.log('[Assistant] All AI providers failed, using Mock provider');
      const mock = new MockAssistantProvider();
      return await mock.generateResponse(context, message, history);
    }
  }
}

// ─── OpenAI Provider ───
export class OpenAIProvider implements AssistantProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.ASSISTANT_MODEL || 'gpt-4o-mini';
  }

  async generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      });
      return response.choices[0]?.message?.content || 'No response generated.';
    } catch (error: unknown) {
      console.error('OpenAI API error:', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return `Sorry, I encountered an error with OpenAI: ${msg}. Please try again.`;
    }
  }
}

// ─── Ollama Provider (local or cloud) ───
export class OllamaProvider implements AssistantProvider {
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

  async generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const messages = [
        { role: 'system' as const, content: buildSystemPrompt(context) },
        ...history.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: message },
      ];

      const response = await this.ollama.chat({
        model: this.model,
        messages,
      });

      return response.message.content || 'No response generated.';
    } catch (error: unknown) {
      console.error('Ollama API error:', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return `Sorry, I encountered an error with Ollama: ${msg}. Make sure Ollama is running (ollama serve).`;
    }
  }
}

// ─── Mock Provider (fallback) ───
export class MockAssistantProvider implements AssistantProvider {
  async generateResponse(
    context: UserContext,
    message: string,
    _history: Array<{ role: string; content: string }>
  ): Promise<string> {
    const msg = message.toLowerCase();
    const userName = context.userName || 'there';
    const projects = context.projects;

    if (msg.match(/^(hi|hello|hey|hola|buenas|que tal)/)) {
      const info = projects.length > 0
        ? `You have ${projects.length} project${projects.length > 1 ? 's' : ''} in Forgeon.`
        : `You haven't created any projects yet.`;
      return `Hey ${userName}! I'm your Forgeon assistant. ${info} What can I help with?`;
    }

    if (msg.includes('project') || msg.includes('proyecto')) {
      if (projects.length === 0) return `No projects yet. Head to **Discover > Opportunities** or create one from **Projects**.`;
      const list = projects.map((p, i) =>
        `${i + 1}. **${p.name}** — ${p.state}${p.viabilityScore ? ` | ${p.viabilityScore}/100` : ''}`
      ).join('\n');
      return `Your projects:\n\n${list}`;
    }

    if (msg.includes('forgeon') || msg.includes('platform')) {
      return `**Forgeon** transforms ideas into validated startups. Systems: Discover, Market Intelligence, Wizard, Evaluation, Build, Learn, and me (Assistant).`;
    }

    const hint = context.stats.totalProjects > 0
      ? `You have ${context.stats.totalProjects} project${context.stats.totalProjects > 1 ? 's' : ''}.`
      : `Try **Discover > Opportunities** to find ideas.`;
    return `I'm in offline mode (no AI key configured). I can help with basic Forgeon questions. ${hint}\n\nTo unlock full AI: add a **GEMINI_API_KEY** (free) or **OPENAI_API_KEY** to your .env file.`;
  }
}

// ─── AI Runtime Provider (delegates to unified AI Runtime) ───

class AIRuntimeAssistantProvider implements AssistantProvider {
  async generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    const { execute } = await import('@/modules/aiRuntime');
    const { AIModelTask } = await import('@/modules/aiRuntime/aiTypes');

    const systemPrompt = buildSystemPrompt(context);
    // Include conversation history in the user prompt for context
    const historyText = history.length > 0
      ? history.map(m => `${m.role}: ${m.content}`).join('\n') + '\n\nuser: '
      : '';

    const response = await execute(
      AIModelTask.ASSISTANT_CHAT,
      systemPrompt,
      historyText + message
    );
    return response.content;
  }
}

// ─── Legacy Provider Selection (Gemini > OpenAI > Ollama > Mock) ───

function getLegacyAssistantProvider(): AssistantProvider {
  // Gemini first — best for complex conversational tasks
  if (process.env.GEMINI_API_KEY) {
    console.log('[Assistant] Using Gemini provider (PRIMARY) with model:', process.env.GEMINI_MODEL || 'gemini-2.0-flash');
    return new GeminiProvider();
  }
  // OpenAI second
  if (process.env.OPENAI_API_KEY) {
    console.log('[Assistant] Using OpenAI provider (SECONDARY) with model:', process.env.ASSISTANT_MODEL || 'gpt-4o-mini');
    return new OpenAIProvider();
  }
  // Ollama third
  if (process.env.OLLAMA_ENABLED === 'true') {
    const mode = process.env.OLLAMA_API_KEY ? 'cloud' : 'local';
    console.log(`[Assistant] Using Ollama provider (TERTIARY, ${mode}) with model:`, process.env.OLLAMA_MODEL || 'llama3.2');
    return new OllamaProvider();
  }
  // Mock fallback
  console.log('[Assistant] No AI providers configured, using mock');
  return new MockAssistantProvider();
}

// ─── Fallback-Wrapped AI Runtime Provider ───

class FallbackAssistantProvider implements AssistantProvider {
  private primary: AssistantProvider;
  private fallback: AssistantProvider;

  constructor(primary: AssistantProvider, fallback: AssistantProvider) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      return await this.primary.generateResponse(context, message, history);
    } catch (error) {
      console.error('[Assistant] AIRuntimeAssistantProvider failed, falling back to legacy:', error instanceof Error ? error.message : error);
      return await this.fallback.generateResponse(context, message, history);
    }
  }
}

// ─── Provider Selection (AI Runtime first, legacy chain as fallback) ───

export function getAssistantProvider(): AssistantProvider {
  // Check if AI Runtime is available via env vars it supports
  const hasAIRuntime =
    !!process.env.AI_ROUTING_MODE ||
    !!process.env.GEMINI_API_KEY ||
    !!process.env.ANTHROPIC_API_KEY ||
    process.env.ENABLE_LOCAL_MODELS === 'true';

  if (hasAIRuntime) {
    console.log('[Assistant] Using AIRuntimeAssistantProvider (delegating to unified AI Runtime)');
    return new FallbackAssistantProvider(
      new AIRuntimeAssistantProvider(),
      getLegacyAssistantProvider()
    );
  }

  // No AI Runtime indicators — use legacy provider selection
  console.log('[Assistant] AI Runtime not configured, using legacy provider selection');
  return getLegacyAssistantProvider();
}
