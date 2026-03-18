import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET — get current pipeline execution status
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

    const genSession = await prisma.generationSession.findUnique({
      where: { id },
      select: { id: true, userId: true, state: true, projectId: true },
    });

    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const agentRuns = await prisma.agentRun.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        agentType: true,
        status: true,
        errorMessage: true,
        startedAt: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      sessionState: genSession.state,
      projectId: genSession.projectId,
      agents: agentRuns,
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
