import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET — fetch blueprints for a project (via linked GenerationSession)
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

    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, userId: true, name: true, description: true, state: true },
    });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Find the GenerationSession linked to this project
    const genSession = await prisma.generationSession.findFirst({
      where: { projectId: id },
      select: { id: true, state: true },
    });

    if (!genSession) {
      return NextResponse.json({ artifacts: [], sessionId: null });
    }

    const artifacts = await prisma.agentArtifact.findMany({
      where: { sessionId: genSession.id },
      orderBy: { createdAt: 'asc' },
      select: { agentType: true, content: true, createdAt: true },
    });

    return NextResponse.json({
      sessionId: genSession.id,
      artifacts: artifacts.map((a) => ({
        agentType: a.agentType,
        content: a.content,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching project blueprints:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
