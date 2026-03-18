import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET — fetch all agent artifacts/blueprints for a session
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
      include: {
        QuestionnaireResponse: true,
        PromptVersion: { where: { isActive: true }, take: 1 },
      },
    });

    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const artifacts = await prisma.agentArtifact.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' },
      select: { agentType: true, content: true, createdAt: true },
    });

    const sectionD = genSession.QuestionnaireResponse?.sectionD as Record<string, string> | null;
    const sectionA = genSession.QuestionnaireResponse?.sectionA as Record<string, string> | null;

    return NextResponse.json({
      sessionState: genSession.state,
      projectId: genSession.projectId,
      projectName: sectionD?.productName || sectionA?.businessIdea?.split('\n')[0]?.substring(0, 100) || 'Generated Project',
      artifacts: artifacts.map((a) => ({
        agentType: a.agentType,
        content: a.content,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
