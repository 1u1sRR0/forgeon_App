import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkWizardCompletion } from '@/modules/wizard/validation';
import { MANDATORY_FIELDS } from '@/modules/wizard/types';

// GET /api/projects/[id]/wizard/validate - Validate wizard completion
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all wizard answers
    const answers = await prisma.wizardAnswer.findMany({
      where: { projectId: id },
      select: {
        step: true,
        key: true,
        value: true,
        completed: true,
      },
    });

    // Check completion status
    const completionStatus = checkWizardCompletion(answers);

    // Build validation response
    const mandatoryFields: Record<string, boolean> = {};
    MANDATORY_FIELDS.forEach((field) => {
      const answer = answers.find((a) => a.key === field);
      mandatoryFields[field] = !!(answer?.value && answer.value.trim() !== '');
    });

    const errors = completionStatus.missingMandatoryFields.map((field) => ({
      step: 0, // Will be determined by field
      key: field,
      message: `${field} is required`,
    }));

    return NextResponse.json({
      isValid: completionStatus.canTransitionToStructured,
      errors,
      mandatoryFields,
      completionStatus,
    });
  } catch (error) {
    console.error('Validate wizard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
