import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  suggestForField,
  suggestFeatures,
} from '@/modules/multiAgent/questionnaire/aiSuggestions';
import type { BusinessType, QuestionnaireAnswers, SectionAAnswers } from '@/modules/multiAgent/types/index';

export async function POST(
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
    const { section, field, existingAnswers } = body;

    if (!section || !field) {
      return NextResponse.json(
        { error: 'section and field are required' },
        { status: 400 }
      );
    }

    // If field is 'coreFeatures' or similar feature suggestion, use suggestFeatures
    if (field === 'coreFeatures' || field === 'suggestFeatures') {
      const businessType = genSession.businessType as BusinessType;
      const sectionAAnswers = (existingAnswers?.sectionA ?? {}) as SectionAAnswers;

      const features = await suggestFeatures(businessType, sectionAAnswers);
      return NextResponse.json({ suggestion: features });
    }

    // Otherwise use suggestForField for individual field suggestions
    const answers = (existingAnswers ?? {}) as QuestionnaireAnswers;
    const suggestion = await suggestForField(id, section, field, answers);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
