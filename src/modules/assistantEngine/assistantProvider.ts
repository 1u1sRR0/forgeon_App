import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

Stats: ${context.stats.totalProjects} projects, ${context.stats.evaluatedProjects} evaluated, ${context.stats.builtProjects} built

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
      console.error('Gemini API error:', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      return `Sorry, I encountered an error with Gemini: ${msg}. Please try again.`;
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

// ─── Provider Selection (priority: Gemini > OpenAI > Mock) ───
export function getAssistantProvider(): AssistantProvider {
  if (process.env.GEMINI_API_KEY) {
    console.log('[Assistant] Using Gemini provider (free) with model:', process.env.GEMINI_MODEL || 'gemini-2.0-flash');
    return new GeminiProvider();
  }
  if (process.env.OPENAI_API_KEY) {
    console.log('[Assistant] Using OpenAI provider with model:', process.env.ASSISTANT_MODEL || 'gpt-4o-mini');
    return new OpenAIProvider();
  }
  console.log('[Assistant] No API key found, using mock provider');
  return new MockAssistantProvider();
}
