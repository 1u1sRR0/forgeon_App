import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { generateCourse } from '@/modules/courseEngine/courseGenerator';

const prisma = new PrismaClient();

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 5; // 5 requests
const RATE_WINDOW = 60 * 1000; // per minute

// POST /api/projects/[id]/course/generate - Force regenerate course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const userId = session.user.id;

    // Rate limiting
    const now = Date.now();
    const userRequests = rateLimitMap.get(userId) || [];
    const recentRequests = userRequests.filter((time) => now - time < RATE_WINDOW);

    if (recentRequests.length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    recentRequests.push(now);
    rateLimitMap.set(userId, recentRequests);

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate course
    await generateCourse(projectId);

    return NextResponse.json({ success: true, message: 'Course regenerated successfully' });
  } catch (error) {
    console.error('Error regenerating course:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate course' },
      { status: 500 }
    );
  }
}
