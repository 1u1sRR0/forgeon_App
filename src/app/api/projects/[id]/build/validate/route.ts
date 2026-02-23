import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildService } from '@/modules/build/buildService';

// GET /api/projects/[id]/build/validate - Validate build gate
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        user: { email: session.user.email },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Validate build gate
    const validation = await buildService.validateBuildGate(params.id);

    return NextResponse.json({ validation });
  } catch (error: any) {
    console.error('Build validation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate build gate' },
      { status: 500 }
    );
  }
}
