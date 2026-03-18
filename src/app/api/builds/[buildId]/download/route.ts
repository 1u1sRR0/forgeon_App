import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// GET /api/builds/[buildId]/download - Download build ZIP
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ buildId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get build artifact
    const buildArtifact = await prisma.buildArtifact.findUnique({
      where: { id: params.buildId },
      include: {
        Project: {
          include: {
            User: true,
          },
        },
      },
    });

    if (!buildArtifact) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    // Verify user owns the project
    if ((buildArtifact as any).Project?.User?.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify build status is COMPLETED before serving ZIP
    if (buildArtifact.status !== 'COMPLETED') {
      const statusMessages: Record<string, string> = {
        PENDING: 'Build has not started yet. Please wait for the build to complete before downloading.',
        IN_PROGRESS: 'Build is still in progress. Please wait for the build to complete before downloading.',
        FAILED: 'Build failed and cannot be downloaded. Check the build logs for error details.',
      };
      const message = statusMessages[buildArtifact.status]
        || `Build is not ready for download (current status: ${buildArtifact.status}).`;

      return NextResponse.json(
        { error: message, status: buildArtifact.status },
        { status: 400 }
      );
    }

    // Verify quality checks passed
    if (!buildArtifact.qualityChecksPassed) {
      return NextResponse.json(
        { error: 'Build did not pass quality checks and cannot be downloaded.' },
        { status: 400 }
      );
    }

    // Verify ZIP path exists
    if (!buildArtifact.zipPath) {
      return NextResponse.json(
        { error: 'ZIP file path not found. The build may have completed without generating a package.' },
        { status: 404 }
      );
    }

    // Prevent path traversal attacks
    const zipPath = path.resolve(buildArtifact.zipPath);
    const buildsRoot = path.resolve(process.cwd(), 'builds');

    if (!zipPath.startsWith(buildsRoot)) {
      console.error('Path traversal attempt detected:', zipPath);
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Verify file exists
    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: 'ZIP file not found on server. It may have been cleaned up.' },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = fs.statSync(zipPath);
    const fileSize = stats.size;

    // Generate filename
    const projectName = ((buildArtifact as any).Project?.name || 'project')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const filename = `${projectName}-mvp.zip`;

    // Stream the file
    const fileStream = fs.createReadStream(zipPath);

    // Convert Node.js stream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => {
          const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
          controller.enqueue(new Uint8Array(buffer));
        });
        fileStream.on('end', () => {
          controller.close();
        });
        fileStream.on('error', (error) => {
          controller.error(error);
        });
      },
      cancel() {
        fileStream.destroy();
      },
    });

    // Return file with proper headers
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileSize.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download build' },
      { status: 500 }
    );
  }
}
