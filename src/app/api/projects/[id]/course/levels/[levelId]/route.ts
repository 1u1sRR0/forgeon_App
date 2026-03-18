import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateLevelProgress } from '@/modules/courseEngine/progressTracker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformLevelResponse(level: any) {
  if (!level) return level;
  const quiz = level.Quiz?.[0];
  return {
    id: level.id,
    title: level.title,
    description: level.description,
    order: level.levelNumber,
    learningObjectives: Array.isArray(level.objectives) ? level.objectives : [],
    lessons: (level.Lesson || []).map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      order: lesson.lessonNumber,
      estimatedMinutes: lesson.estimatedMinutes,
      quiz: quiz ? { id: quiz.id } : undefined,
    })),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; levelId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, levelId } = await params;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get level with lessons
    const level = await prisma.courseLevel.findFirst({
      where: {
        id: levelId,
        Course: {
          projectId,
        },
      },
      include: {
        Lesson: {
          orderBy: { lessonNumber: 'asc' },
        },
        Quiz: true,
      },
    });

    if (!level) {
      return NextResponse.json({ error: 'Level not found' }, { status: 404 });
    }

    // Calculate progress for this level
    const progress = await calculateLevelProgress(levelId, session.user.id);

    return NextResponse.json({
      level: transformLevelResponse(level),
      progress,
    });
  } catch (error) {
    console.error('Error fetching level:', error);
    return NextResponse.json(
      { error: 'Failed to fetch level' },
      { status: 500 }
    );
  }
}
