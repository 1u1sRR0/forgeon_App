import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getMultiAgentProvider } from '@/modules/multiAgent/multiAgentProvider';
import type { QuestionnaireAnswers } from '@/modules/multiAgent/types';

// GET — fetch active prompt for session
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const genSession = await prisma.generationSession.findUnique({ where: { id } });
    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const activePrompt = await prisma.promptVersion.findFirst({
      where: { sessionId: id, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const allVersions = await prisma.promptVersion.findMany({
      where: { sessionId: id },
      orderBy: { version: 'asc' },
    });

    return NextResponse.json({
      activePrompt,
      versions: allVersions,
      sessionState: genSession.state,
    });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 });
  }
}


// POST — generate master prompt from questionnaire answers
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const genSession = await prisma.generationSession.findUnique({
      where: { id },
      include: { QuestionnaireResponse: true },
    });
    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const qr = genSession.QuestionnaireResponse;
    if (!qr) {
      return NextResponse.json({ error: 'No questionnaire data found' }, { status: 400 });
    }

    const answers: QuestionnaireAnswers = {
      sectionA: qr.sectionA as unknown as QuestionnaireAnswers['sectionA'],
      sectionB: qr.sectionB as unknown as QuestionnaireAnswers['sectionB'],
      sectionC: qr.sectionC as unknown as QuestionnaireAnswers['sectionC'],
      sectionD: qr.sectionD as unknown as QuestionnaireAnswers['sectionD'],
      sectionE: qr.sectionE as unknown as QuestionnaireAnswers['sectionE'],
      sectionF: qr.sectionF as unknown as QuestionnaireAnswers['sectionF'],
    };

    // Build the master prompt using AI
    const provider = getMultiAgentProvider();
    const masterPrompt = await provider.generateText(
      PROMPT_ARCHITECT_SYSTEM,
      buildUserPrompt(genSession.businessType, answers),
    );

    // Deactivate any existing active prompts
    await prisma.promptVersion.updateMany({
      where: { sessionId: id, isActive: true },
      data: { isActive: false },
    });

    // Count existing versions
    const versionCount = await prisma.promptVersion.count({ where: { sessionId: id } });

    // Save the new prompt version
    const promptVersion = await prisma.promptVersion.create({
      data: {
        id: crypto.randomUUID(),
        sessionId: id,
        version: versionCount + 1,
        type: 'ORIGINAL',
        content: masterPrompt,
        isActive: true,
      },
    });

    // Update session state to PROMPT_REVIEW
    await prisma.generationSession.update({
      where: { id },
      data: { state: 'PROMPT_REVIEW', updatedAt: new Date() },
    });

    return NextResponse.json({ prompt: promptVersion });
  } catch (error) {
    console.error('Error generating prompt:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate prompt: ${msg}` }, { status: 500 });
  }
}

// PUT — save custom/edited prompt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const { content } = await request.json();

    const genSession = await prisma.generationSession.findUnique({ where: { id } });
    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Deactivate current
    await prisma.promptVersion.updateMany({
      where: { sessionId: id, isActive: true },
      data: { isActive: false },
    });

    const versionCount = await prisma.promptVersion.count({ where: { sessionId: id } });

    const promptVersion = await prisma.promptVersion.create({
      data: {
        id: crypto.randomUUID(),
        sessionId: id,
        version: versionCount + 1,
        type: 'CUSTOM',
        content,
        isActive: true,
      },
    });

    return NextResponse.json({ prompt: promptVersion });
  } catch (error) {
    console.error('Error saving custom prompt:', error);
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
  }
}

// ─── Prompt Architect System Prompt ───

const PROMPT_ARCHITECT_SYSTEM = `You are the Prompt Architect, a specialized AI agent that transforms structured questionnaire answers into a comprehensive Master Prompt for building a digital business.

Your output must be a single, detailed, well-structured prompt that another AI system can use to generate complete business blueprints (business strategy, product architecture, technical architecture, UX/UI design, and build plan).

The Master Prompt should:
1. Start with a clear executive summary of the business idea
2. Define the target customer and problem being solved
3. Specify the product features and user workflows
4. Include monetization strategy and pricing model
5. Define technical requirements and constraints
6. Specify brand identity and UX preferences
7. Include scope, timeline, and budget constraints
8. End with specific instructions for each agent in the pipeline

Write in a clear, professional tone. Be specific and actionable. Include all relevant details from the questionnaire.
Output the prompt in the SAME LANGUAGE as the questionnaire answers (if answers are in Spanish, write in Spanish, etc.).`;

function buildUserPrompt(businessType: string, answers: QuestionnaireAnswers): string {
  const parts: string[] = [
    `Business Type: ${businessType}`,
    '',
    '=== QUESTIONNAIRE ANSWERS ===',
  ];

  if (answers.sectionA) {
    parts.push('\n--- Section A: Business Intent ---');
    parts.push(`Business Idea: ${answers.sectionA.businessIdea || 'N/A'}`);
    parts.push(`Problem Being Solved: ${answers.sectionA.problemSolved || 'N/A'}`);
    parts.push(`Target Customer: ${answers.sectionA.targetCustomer || 'N/A'}`);
    if (answers.sectionA.marketContext) parts.push(`Market Context: ${answers.sectionA.marketContext}`);
    if (answers.sectionA.urgencyMotivation) parts.push(`Urgency/Motivation: ${answers.sectionA.urgencyMotivation}`);
  }

  if (answers.sectionB) {
    parts.push('\n--- Section B: Product Definition ---');
    if (answers.sectionB.coreFeatures?.length) parts.push(`Core Features: ${answers.sectionB.coreFeatures.join(', ')}`);
    if (answers.sectionB.userRoles?.length) parts.push(`User Roles: ${answers.sectionB.userRoles.join(', ')}`);
    parts.push(`Key Workflows: ${answers.sectionB.keyWorkflows || 'N/A'}`);
    parts.push(`Value Proposition: ${answers.sectionB.valueProposition || 'N/A'}`);
    if (answers.sectionB.competitiveAdvantage) parts.push(`Competitive Advantage: ${answers.sectionB.competitiveAdvantage}`);
  }

  if (answers.sectionC) {
    parts.push('\n--- Section C: Monetization ---');
    parts.push(`Monetization Type: ${answers.sectionC.monetizationType || 'N/A'}`);
    parts.push(`Revenue Target: ${answers.sectionC.revenueTarget || 'N/A'}`);
    if (answers.sectionC.pricingNotes) parts.push(`Pricing Notes: ${answers.sectionC.pricingNotes}`);
    if (answers.sectionC.paymentIntegrations?.length) parts.push(`Payment Integrations: ${answers.sectionC.paymentIntegrations.join(', ')}`);
  }

  if (answers.sectionD) {
    parts.push('\n--- Section D: Brand & Expression ---');
    if (answers.sectionD.productName) parts.push(`Product Name: ${answers.sectionD.productName}`);
    parts.push(`Brand Tone: ${answers.sectionD.brandTone || 'N/A'}`);
    parts.push(`UX Feel: ${answers.sectionD.uxFeel || 'N/A'}`);
    parts.push(`Visual Preference: ${answers.sectionD.visualPreference || 'N/A'}`);
    if (answers.sectionD.inspirationRefs) parts.push(`Inspiration: ${answers.sectionD.inspirationRefs}`);
  }

  if (answers.sectionE) {
    parts.push('\n--- Section E: Technical Scope ---');
    parts.push(`Scope Level: ${answers.sectionE.scopeLevel || 'N/A'}`);
    if (answers.sectionE.authNeeds?.length) parts.push(`Auth Needs: ${answers.sectionE.authNeeds.join(', ')}`);
    parts.push(`Payment Integration: ${answers.sectionE.paymentIntegration ? 'Yes' : 'No'}`);
    parts.push(`Admin Panel: ${answers.sectionE.adminPanel ? 'Yes' : 'No'}`);
    parts.push(`AI Features: ${answers.sectionE.aiFeatures ? 'Yes' : 'No'}`);
    if (answers.sectionE.aiDescription) parts.push(`AI Description: ${answers.sectionE.aiDescription}`);
  }

  if (answers.sectionF) {
    parts.push('\n--- Section F: Constraints ---');
    parts.push(`Timeline: ${answers.sectionF.timeline || 'N/A'}`);
    parts.push(`Budget Range: ${answers.sectionF.budgetRange || 'N/A'}`);
    parts.push(`Technical Level: ${answers.sectionF.technicalLevel || 'N/A'}`);
    if (answers.sectionF.mustHaveFeatures?.length) parts.push(`Must-Have Features: ${answers.sectionF.mustHaveFeatures.join(', ')}`);
    if (answers.sectionF.dealBreakers) parts.push(`Deal Breakers: ${answers.sectionF.dealBreakers}`);
  }

  parts.push('\n=== END OF QUESTIONNAIRE ===');
  parts.push('\nGenerate a comprehensive Master Prompt based on these answers. The prompt should be detailed enough for specialized AI agents to generate complete business, product, technical, UX/UI, and build blueprints.');

  return parts.join('\n');
}