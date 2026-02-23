import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildService } from '@/modules/build/buildService';
import { BuildParameters } from '@/modules/build/types';

// POST /api/projects/[id]/build - Initiate build
export async function POST(
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

    // Parse build parameters
    const body = await request.json();
    const parameters: BuildParameters = {
      appName: body.appName || project.name,
      entityName: body.entityName || 'Item',
      brandingColors: body.brandingColors,
      featureFlags: body.featureFlags,
    };

    // Create build job
    const buildJob = await buildService.createBuildJob(params.id, parameters);

    // Trigger async build process
    // Note: In production, this should be done via a job queue
    // For now, we'll execute it asynchronously without blocking the response
    import('@/modules/build/buildExecutor').then(({ BuildExecutor }) => {
      const executor = new BuildExecutor(
        buildJob.id,
        params.id,
        buildJob.templateType,
        parameters
      );
      executor.execute().catch((error) => {
        console.error('Build execution error:', error);
      });
    });

    return NextResponse.json({
      success: true,
      buildJob,
    });
  } catch (error: any) {
    console.error('Build initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate build' },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/build - Get latest build status
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

    // Get latest build
    const buildJob = await buildService.getLatestBuild(params.id);

    if (!buildJob) {
      return NextResponse.json({ error: 'No build found' }, { status: 404 });
    }

    return NextResponse.json({ buildJob });
  } catch (error: any) {
    console.error('Get build error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get build status' },
      { status: 500 }
    );
  }
}
