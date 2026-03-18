import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, lessonId } = await params;

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

    // Get lesson with quiz
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        CourseLevel: {
          Course: {
            projectId,
          },
        },
      },
      include: {
        CourseLevel: {
          select: {
            id: true,
            title: true,
            levelNumber: true,
            Quiz: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check completion status
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    });

    // Transform lesson to match frontend interface
    const quiz = lesson.CourseLevel.Quiz?.[0];
    const transformedLesson = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      estimatedMinutes: lesson.estimatedMinutes,
      content: lesson.content || [],
      quiz: quiz ? { id: quiz.id, title: quiz.title } : undefined,
      level: {
        id: lesson.CourseLevel.id,
        title: lesson.CourseLevel.title,
        order: lesson.CourseLevel.levelNumber,
      },
    };

    return NextResponse.json({
      lesson: transformedLesson,
      completed: progress?.completed || false,
      timeSpent: progress?.timeSpent || 0,
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
