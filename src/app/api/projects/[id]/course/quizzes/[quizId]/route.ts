import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, quizId } = await params;

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

    // Get quiz (without correct answers)
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
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
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Remove correct answers from questions
    const questions = (quiz.questions as any[]).map((q: any) => ({
      ...q,
      correctAnswer: undefined, // Hide correct answer
    }));

    // Get previous attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        quizId,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json({
      quiz: {
        ...quiz,
        questions,
      },
      attempts,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
