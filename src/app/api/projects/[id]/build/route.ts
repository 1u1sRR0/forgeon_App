import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildService } from '@/modules/build/buildService';
import { BuildParameters } from '@/modules/build/types';

// POST /api/projects/[id]/build - Initiate async build
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
        User: { email: session.user.email },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Validate build gate before creating artifact
    const validation = await buildService.validateBuildGate(params.id);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Build gate validation failed',
          validation,
        },
        { status: 400 }
      );
    }

    // Parse build parameters
    const body = await request.json();
    const parameters: BuildParameters = {
      appName: body.appName || project.name,
      entityName: body.entityName || 'Item',
      brandingColors: body.brandingColors,
      featureFlags: body.featureFlags,
    };

    // Create build job with PENDING status
    const buildJob = await buildService.createBuildJob(params.id, parameters);

    // Execute BuildExecutor asynchronously (fire-and-forget with error handling)
    import('@/modules/build/buildExecutor').then(({ BuildExecutor }) => {
      const executor = new BuildExecutor(
        buildJob.id,
        params.id,
        buildJob.templateType,
        parameters
      );
      executor.execute().catch((error) => {
        console.error(`[Build ${buildJob.id}] Async execution error:`, error);
      });
    }).catch((error) => {
      console.error(`[Build ${buildJob.id}] Failed to import BuildExecutor:`, error);
    });

    // Return buildId and redirect URL to progress page
    const redirectUrl = `/dashboard/projects/${params.id}/build/progress`;

    return NextResponse.json({
      success: true,
      buildId: buildJob.id,
      redirectUrl,
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
        User: { email: session.user.email },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Query most recent BuildArtifact for the project
    const buildJob = await buildService.getLatestBuild(params.id);

    if (!buildJob) {
      return NextResponse.json({ error: 'No build found for this project' }, { status: 404 });
    }

    // Return current BuildArtifact status, buildLog array, errorMessage, and zipPath
    return NextResponse.json({
      buildId: buildJob.id,
      status: buildJob.status,
      buildLog: buildJob.buildLog,
      errorMessage: buildJob.errorMessage || null,
      zipPath: buildJob.zipPath || null,
      qualityChecksPassed: buildJob.qualityChecksPassed,
      templateType: buildJob.templateType,
      createdAt: buildJob.createdAt,
      completedAt: buildJob.completedAt || null,
    });
  } catch (error: any) {
    console.error('Get build status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get build status' },
      { status: 500 }
    );
  }
}
