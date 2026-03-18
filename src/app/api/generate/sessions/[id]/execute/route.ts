import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getMultiAgentProvider } from '@/modules/multiAgent/multiAgentProvider';
import { getAgentDefinitions } from '@/modules/multiAgent/agents/agentDefinitions';

// Background execution — runs after response is sent
async function executePipeline(sessionId: string, userId: string) {
  try {
    const genSession = await prisma.generationSession.findUnique({
      where: { id: sessionId },
      include: {
        PromptVersion: { where: { isActive: true }, take: 1 },
        QuestionnaireResponse: true,
      },
    });

    if (!genSession) return;

    const activePrompt = genSession.PromptVersion[0];
    if (!activePrompt) return;

    const provider = getMultiAgentProvider();
    const agents = getAgentDefinitions();
    const previousOutputs: Record<string, string> = {};
    const iteration = genSession.iteration;

    let completedCount = 0;
    for (const agent of agents) {
      const agentRun = await prisma.agentRun.create({
        data: {
          id: crypto.randomUUID(),
          sessionId,
          agentType: agent.type,
          status: 'RUNNING',
          iteration,
          startedAt: new Date(),
          inputSummary: `Processing ${agent.name}`,
        },
      });

      try {
        const userPrompt = agent.buildUserPrompt(
          activePrompt.content,
          previousOutputs
        );
        const result = await provider.generateStructured<Record<string, unknown>>(
          agent.systemPrompt,
          userPrompt
        );

        const resultStr = JSON.stringify(result);
        previousOutputs[agent.type] = resultStr;

        await prisma.agentArtifact.create({
          data: {
            id: crypto.randomUUID(),
            sessionId,
            agentRunId: agentRun.id,
            agentType: agent.type,
            iteration,
            content: result as any,
          },
        });

        await prisma.agentRun.update({
          where: { id: agentRun.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            outputSummary: resultStr.substring(0, 500),
          },
        });
        completedCount++;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        await prisma.agentRun.update({
          where: { id: agentRun.id },
          data: { status: 'FAILED', errorMessage: msg, completedAt: new Date() },
        });
        console.error(`[Execute] Agent ${agent.type} failed:`, msg);
      }
    }

    // If no agents completed, mark as failed
    if (completedCount === 0) {
      console.error('[Execute] ALL agents failed — no artifacts generated');
      await prisma.generationSession.update({
        where: { id: sessionId },
        data: { state: 'PROMPT_REVIEW', updatedAt: new Date() },
      });
      return;
    }

    // Extract project name from outputs or questionnaire
    let projectName = 'Generated Project';
    let projectDescription = '';
    try {
      if (previousOutputs.BUSINESS_STRATEGIST) {
        const biz = JSON.parse(previousOutputs.BUSINESS_STRATEGIST);
        projectDescription = biz.executiveSummary || biz.valueProposition || '';
      }
      const qr = genSession.QuestionnaireResponse;
      const sectionA = qr?.sectionA as Record<string, string> | null;
      const sectionD = qr?.sectionD as Record<string, string> | null;
      // Prefer productName, fallback to first line of businessIdea
      const rawName = sectionD?.productName || sectionA?.businessIdea || 'Generated Project';
      projectName = rawName.split('\n')[0].substring(0, 100);
    } catch { /* use defaults */ }

    // Create the Project
    const now = new Date();
    const project = await prisma.project.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        name: projectName.substring(0, 200),
        description: projectDescription.substring(0, 1000) || undefined,
        state: 'IDEA',
        updatedAt: now,
      },
    });

    // Generate landing page HTML from the artifacts
    try {
      const { generateAndStoreLandingPage } = await import('@/modules/preview/landingPageGenerator');
      await generateAndStoreLandingPage(sessionId);
      console.log(`[Execute] Landing page HTML generated for session: ${sessionId}`);
    } catch (lpError) {
      console.error('[Execute] Landing page generation failed (non-fatal):', lpError);
    }

    // Link session to project and mark completed
    await prisma.generationSession.update({
      where: { id: sessionId },
      data: { projectId: project.id, state: 'COMPLETED', updatedAt: new Date() },
    });

    console.log(`[Execute] Pipeline completed. Project created: ${project.id}`);
  } catch (error) {
    console.error('[Execute] Pipeline error:', error);
    // Mark session as failed — use a recognizable state so the UI can show the error
    try {
      await prisma.generationSession.update({
        where: { id: sessionId },
        data: { state: 'PROMPT_REVIEW', updatedAt: new Date() },
      });
    } catch { /* ignore */ }
  }
}

// POST — start pipeline execution (returns immediately, runs in background)
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
      include: { PromptVersion: { where: { isActive: true }, take: 1 } },
    });

    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!genSession.PromptVersion[0]) {
      return NextResponse.json({ error: 'No active prompt found' }, { status: 400 });
    }

    // Prevent double execution
    if (genSession.state === 'GENERATING') {
      return NextResponse.json({ status: 'already_running' });
    }
    if (genSession.state === 'COMPLETED') {
      return NextResponse.json({ status: 'already_completed', projectId: genSession.projectId });
    }

    // Update state to GENERATING
    await prisma.generationSession.update({
      where: { id },
      data: { state: 'GENERATING', updatedAt: new Date() },
    });

    // Fire and forget — pipeline runs in background
    executePipeline(id, session.user.id).catch((err) =>
      console.error('[Execute] Background pipeline error:', err)
    );

    return NextResponse.json({ status: 'started' });
  } catch (error) {
    console.error('[Execute] Start error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to start: ${msg}` }, { status: 500 });
  }
}
