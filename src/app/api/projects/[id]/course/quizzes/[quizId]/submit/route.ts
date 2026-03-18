import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { recordQuizAttempt } from '@/modules/courseEngine/progressTracker';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, quizId } = await params;
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

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

    // Get quiz with correct answers
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        CourseLevel: {
          Course: {
            projectId,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Validate answers and calculate score
    const questions = quiz.questions as any[];
    let correctCount = 0;
    const results = questions.map((question: any) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= (quiz.passingScore || 70);

    // Record attempt
    await recordQuizAttempt(
      quizId,
      session.user.id,
      score,
      Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        selectedAnswer: answer,
      })),
      passed
    );

    return NextResponse.json({
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
      results,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
