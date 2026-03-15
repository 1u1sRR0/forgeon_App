import { UserContext } from './userContextBuilder';

export interface AssistantProvider {
  generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string>;
}

// Smart mock provider that gives contextual, helpful responses
export class MockAssistantProvider implements AssistantProvider {
  async generateResponse(
    context: UserContext,
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> {
    const msg = message.toLowerCase();
    const userName = context.userName || 'there';
    const projects = context.projects;

    // Greeting
    if (msg.match(/^(hi|hello|hey|hola|buenas|que tal)/)) {
      const projectInfo = projects.length > 0
        ? `You have ${projects.length} project${projects.length > 1 ? 's' : ''} in Forgeon. Want me to help with any of them?`
        : `Looks like you haven't created any projects yet. Want me to help you get started?`;
      return `Hey ${userName}! I'm your Forgeon assistant — think of me as your startup CTO + product strategist. ${projectInfo}`;
    }

    // Project-specific questions
    if (msg.includes('project') || msg.includes('proyecto')) {
      if (projects.length === 0) {
        return `You don't have any projects yet. Head to **Discover > Opportunities** to find startup ideas, or create a new project from the **Projects** page. I can guide you through the whole process.`;
      }
      const projectList = projects.map((p, i) => 
        `${i + 1}. **${p.name}** — Stage: ${formatState(p.state)}${p.viabilityScore ? ` | Score: ${p.viabilityScore}/100` : ''}`
      ).join('\n');
      return `Here are your projects:\n\n${projectList}\n\nWhat would you like to know about any of them?`;
    }

    // Forgeon features
    if (msg.includes('wizard') || msg.includes('formulario')) {
      return `The **Project Wizard** is where you define your startup idea step by step. It covers:\n\n- Problem statement\n- Target audience\n- Proposed solution\n- Monetization model\n- Tech stack\n\nOnce completed, your project moves to the evaluation phase. Each field helps the AI agents understand your idea better.`;
    }

    if (msg.includes('evaluat') || msg.includes('score') || msg.includes('viabilit') || msg.includes('evaluac')) {
      return `The **Evaluation Engine** analyzes your project using 5 AI agents:\n\n- 🏪 **Market Agent** — market size, competition, timing\n- 📦 **Product Agent** — product-market fit, UX, differentiation\n- 💰 **Financial Agent** — revenue model, unit economics, funding\n- ⚙️ **Technical Agent** — feasibility, scalability, tech debt\n- 😈 **Devil's Advocate** — risks, blind spots, failure modes\n\nYour viability score (0-100) determines if you can proceed to build.`;
    }

    if (msg.includes('build') || msg.includes('construir') || msg.includes('generat')) {
      return `The **Build System** generates a complete MVP codebase from your validated project. It includes:\n\n- Authentication pages\n- Dashboard\n- API routes\n- Database schema\n- Core features based on your project type\n\nYou need a viability score of 60+ to unlock the build phase.`;
    }

    if (msg.includes('opportunit') || msg.includes('oportunidad') || msg.includes('discover')) {
      return `**Discover > Opportunities** shows AI-generated startup ideas with full dossiers:\n\n- Problem analysis & buyer persona\n- Monetization strategy & pricing\n- Differentiation angles\n- Risk assessment\n- 7-day action plan\n\nYou can filter by sector, viability score, and difficulty. Click any opportunity to see the full dossier, then create a project from it.`;
    }

    if (msg.includes('market gap') || msg.includes('gap') || msg.includes('brecha')) {
      return `**Discover > Market Gaps** identifies underserved market segments. Each gap includes:\n\n- Evidence signals\n- Wedge strategy\n- Competition level\n- Estimated market size\n\nYou can generate 3 variant approaches (Premium, Volume, Niche) for any gap and create a project from the one you prefer.`;
    }

    if (msg.includes('market intel') || msg.includes('inteligencia')) {
      return `**Market Intelligence** provides real-time market insights across 4 categories:\n\n- 📈 Trend Analysis\n- 🏢 Sector Insights\n- 🚀 Startup Data\n- 📊 Demand Indicators\n\nEach item has confidence scores, evidence signals, and actionable recommendations. You can save items to your projects for reference.`;
    }

    if (msg.includes('learn') || msg.includes('course') || msg.includes('curso') || msg.includes('aprender')) {
      return `The **Learn Hub** generates personalized courses for each project. Courses include:\n\n- Multiple levels (beginner to advanced)\n- Interactive lessons with code examples\n- Quizzes to test understanding\n- Glossary of key terms\n\nCourses are tailored to your project's tech stack and business model.`;
    }

    if (msg.includes('prompt') || msg.includes('optimize')) {
      return `The **Prompt Builder** helps you craft and optimize prompts for your project. Features:\n\n- AI-powered prompt generation\n- Version history\n- A/B comparison\n- Optimization suggestions\n\nGreat for refining your product descriptions, marketing copy, and technical specs.`;
    }

    // MVP / startup strategy
    if (msg.includes('mvp') || msg.includes('minimum viable')) {
      return `An MVP (Minimum Viable Product) is the simplest version of your product that delivers core value. Key principles:\n\n1. **Focus on one core problem** — solve it well\n2. **Build only what's necessary** — no feature creep\n3. **Launch fast** — get real user feedback\n4. **Iterate based on data** — not assumptions\n\nIn Forgeon, the Build System generates your MVP automatically based on your validated project. The evaluation ensures you're building something viable before investing time.`;
    }

    if (msg.includes('monetiz') || msg.includes('revenue') || msg.includes('pricing') || msg.includes('dinero') || msg.includes('cobrar')) {
      return `Common monetization models for startups:\n\n- **SaaS Subscription** — monthly/annual recurring revenue\n- **Freemium** — free tier + paid upgrades\n- **Marketplace** — transaction fees (5-20%)\n- **Usage-based** — pay per API call, storage, etc.\n- **One-time purchase** — licenses or digital products\n\nThe best model depends on your target audience and value proposition. Your project's evaluation includes a financial analysis of your chosen model.`;
    }

    if (msg.includes('tech stack') || msg.includes('technology') || msg.includes('framework') || msg.includes('tecnolog')) {
      return `Popular tech stacks for MVPs:\n\n- **Next.js + Prisma + PostgreSQL** — full-stack, great DX (what Forgeon uses)\n- **React + Node.js + MongoDB** — flexible, large ecosystem\n- **Python + Django + PostgreSQL** — rapid development, great for data\n- **Flutter/React Native** — cross-platform mobile\n\nForgeon's Build System generates Next.js projects with TypeScript, Tailwind CSS, and Prisma ORM.`;
    }

    // General startup advice
    if (msg.includes('idea') || msg.includes('start') || msg.includes('begin') || msg.includes('empezar') || msg.includes('comenzar')) {
      return `Here's how to get started with Forgeon:\n\n1. **Explore Opportunities** — browse AI-generated startup ideas\n2. **Create a Project** — from an opportunity or from scratch\n3. **Complete the Wizard** — define your idea in detail\n4. **Get Evaluated** — AI agents score your viability\n5. **Build your MVP** — auto-generated codebase\n6. **Learn** — personalized courses for your project\n\nWant me to walk you through any of these steps?`;
    }

    // Forgeon platform
    if (msg.includes('forgeon') || msg.includes('platform') || msg.includes('plataforma')) {
      return `**Forgeon** is a Structured Startup Operating System. It transforms ideas into validated, deployable digital startups.\n\nCore systems:\n- 🔍 **Discover** — find opportunities & market gaps\n- 📊 **Market Intelligence** — real-time market insights\n- 📝 **Project Wizard** — structure your idea\n- 🎯 **Evaluation** — AI-powered viability scoring\n- 🔨 **Build** — auto-generate your MVP\n- 📚 **Learn** — personalized courses\n- 🤖 **Assistant** — that's me!\n\nWhat would you like to explore?`;
    }

    // Default: helpful general response
    return generateGeneralResponse(msg, context);
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

function generateGeneralResponse(msg: string, context: UserContext): string {
  const projectCount = context.stats.totalProjects;
  const hint = projectCount > 0
    ? `\n\nBy the way, you have ${projectCount} project${projectCount > 1 ? 's' : ''} — I can help with any of them.`
    : `\n\nTip: Check out **Discover > Opportunities** to find your next startup idea.`;

  return `That's a great question! While I'm currently running in offline mode (no OpenAI key configured), I can still help you navigate Forgeon and answer questions about:\n\n- 🔍 Your projects and their status\n- 📊 How evaluation scoring works\n- 🔨 The build process\n- 💡 Startup strategy & MVP planning\n- 📈 Market intelligence features\n- 📚 Learning resources\n\nTry asking me about any of these topics!${hint}`;
}

export function getAssistantProvider(): AssistantProvider {
  // Future: check for OPENAI_API_KEY and return OpenAIProvider
  return new MockAssistantProvider();
}
