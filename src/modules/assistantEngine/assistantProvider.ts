import OpenAI from 'openai';
import { UserContext } from './userContextBuilder';

export interface AssistantProvider {
  generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string>;
}

// Real OpenAI provider
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
    const systemPrompt = this.buildSystemPrompt(context);
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
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
      return `Sorry, I encountered an error connecting to OpenAI: ${msg}. Please try again.`;
    }
  }

  private buildSystemPrompt(context: UserContext): string {
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
}

// Fallback mock provider (used when no OpenAI key)
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
      const projectInfo = projects.length > 0
        ? `You have ${projects.length} project${projects.length > 1 ? 's' : ''} in Forgeon. Want me to help with any of them?`
        : `Looks like you haven't created any projects yet. Want me to help you get started?`;
      return `Hey ${userName}! I'm your Forgeon assistant — think of me as your startup CTO + product strategist. ${projectInfo}`;
    }

    if (msg.includes('project') || msg.includes('proyecto')) {
      if (projects.length === 0) {
        return `You don't have any projects yet. Head to **Discover > Opportunities** to find startup ideas, or create a new project from the **Projects** page.`;
      }
      const projectList = projects.map((p, i) =>
        `${i + 1}. **${p.name}** — Stage: ${formatState(p.state)}${p.viabilityScore ? ` | Score: ${p.viabilityScore}/100` : ''}`
      ).join('\n');
      return `Here are your projects:\n\n${projectList}\n\nWhat would you like to know about any of them?`;
    }

    if (msg.includes('forgeon') || msg.includes('platform') || msg.includes('plataforma')) {
      return `**Forgeon** is a Structured Startup Operating System. It transforms ideas into validated, deployable digital startups.\n\nCore systems:\n- 🔍 **Discover** — find opportunities & market gaps\n- 📊 **Market Intelligence** — real-time market insights\n- 📝 **Project Wizard** — structure your idea\n- 🎯 **Evaluation** — AI-powered viability scoring\n- 🔨 **Build** — auto-generate your MVP\n- 📚 **Learn** — personalized courses\n- 🤖 **Assistant** — that's me!\n\nWhat would you like to explore?`;
    }

    const projectCount = context.stats.totalProjects;
    const hint = projectCount > 0
      ? `\n\nYou have ${projectCount} project${projectCount > 1 ? 's' : ''} — I can help with any of them.`
      : `\n\nTip: Check out **Discover > Opportunities** to find your next startup idea.`;

    return `I'm currently running in offline mode (no OpenAI key configured). I can still help with basic Forgeon questions.\n\nTo unlock full AI capabilities, add your OpenAI API key to the .env file.${hint}`;
  }
}

function formatState(state: string): string {
  const states: Record<string, string> = {
    IDEA: '💡 Idea',
    WIZARD_IN_PROGRESS: '📝 Wizard In Progress',
    WIZARD_COMPLETE: '✅ Wizard Complete',
    EVALUATING: '🔄 Evaluating',
    EVALUATED: '📊 Evaluated',
    BUILD_READY: '🔨 Build Ready',
    BUILDING: '⚙️ Building',
    MVP_GENERATED: '🚀 MVP Generated',
  };
  return states[state] || state;
}

export function getAssistantProvider(): AssistantProvider {
  if (process.env.OPENAI_API_KEY) {
    console.log('[Assistant] Using OpenAI provider with model:', process.env.ASSISTANT_MODEL || 'gpt-4o-mini');
    return new OpenAIProvider();
  }
  console.log('[Assistant] No OPENAI_API_KEY found, using mock provider');
  return new MockAssistantProvider();
}
