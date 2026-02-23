import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/projects/[id]/evaluation - Get evaluation results
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get latest viability score
    const viabilityScore = await prisma.viabilityScore.findFirst({
      where: { projectId: id },
      orderBy: { computedAt: 'desc' },
    });

    if (!viabilityScore) {
      return NextResponse.json({ error: 'No evaluation found' }, { status: 404 });
    }

    // Get findings
    const findings = await prisma.evaluationFinding.findMany({
      where: { projectId: id },
      orderBy: { severity: 'desc' },
    });

    // Get risks
    const risks = await prisma.riskMatrix.findMany({
      where: { projectId: id },
      orderBy: { riskScore: 'desc' },
    });

    // Get artifacts
    const artifacts = await prisma.generatedArtifact.findMany({
      where: { projectId: id },
    });

    // Get template mapping
    const templateMapping = await prisma.templateMapping.findUnique({
      where: { projectId: id },
    });

    return NextResponse.json({
      viabilityScore,
      findings,
      risks,
      artifacts,
      templateMapping,
    });
  } catch (error) {
    console.error('Get evaluation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
