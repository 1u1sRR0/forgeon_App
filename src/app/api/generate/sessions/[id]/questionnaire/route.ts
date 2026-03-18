import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  saveQuestionnaireSection,
  getQuestionnaireProgress,
} from '@/modules/multiAgent/questionnaire/questionnaireEngine';

const VALID_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const genSession = await prisma.generationSession.findUnique({
      where: { id },
    });
    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await request.json();
    const { section, answers } = body;

    if (!section || !VALID_SECTIONS.includes(section)) {
      return NextResponse.json(
        { error: 'section must be one of A, B, C, D, E, F' },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'answers object is required' },
        { status: 400 }
      );
    }

    await saveQuestionnaireSection(id, section, answers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving questionnaire section:', error);
    return NextResponse.json(
      { error: 'Failed to save questionnaire section' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const genSession = await prisma.generationSession.findUnique({
      where: { id },
    });
    if (!genSession || genSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const questionnaire = await prisma.questionnaireResponse.findUnique({
      where: { sessionId: id },
    });

    const progress = await getQuestionnaireProgress(id);

    return NextResponse.json({
      answers: {
        sectionA: questionnaire?.sectionA ?? null,
        sectionB: questionnaire?.sectionB ?? null,
        sectionC: questionnaire?.sectionC ?? null,
        sectionD: questionnaire?.sectionD ?? null,
        sectionE: questionnaire?.sectionE ?? null,
        sectionF: questionnaire?.sectionF ?? null,
      },
      progress,
    });
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire' },
      { status: 500 }
    );
  }
}
