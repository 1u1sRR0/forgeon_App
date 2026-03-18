import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { validateField, checkWizardCompletion } from '@/modules/wizard/validation';

// GET /api/projects/[id]/wizard - Get all wizard answers
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
      orderBy: [{ step: 'asc' }, { key: 'asc' }],
      select: {
        step: true,
        key: true,
        value: true,
        completed: true,
      },
    });

    // Calculate completion status
    const completionStatus = checkWizardCompletion(answers);

    return NextResponse.json({
      answers,
      completionStatus,
    });
  } catch (error) {
    console.error('Get wizard answers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/wizard - Save wizard answer (autosave)
export async function POST(
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
      select: { userId: true, state: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { step, key, value } = body;

    // Validate input
    if (!step || !key) {
      return NextResponse.json({ error: 'Step and key are required' }, { status: 400 });
    }

    if (step < 1 || step > 10) {
      return NextResponse.json({ error: 'Invalid step number' }, { status: 400 });
    }

    // Validate field value
    const validationError = validateField(key, value);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Upsert wizard answer
    const answer = await prisma.wizardAnswer.upsert({
      where: {
        projectId_step_key: {
          projectId: id,
          step,
          key,
        },
      },
      update: {
        value,
        completed: value !== null && value.trim() !== '',
      },
      create: {
        id: crypto.randomUUID(),
        projectId: id,
        step,
        key,
        value,
        completed: value !== null && value.trim() !== '',
        updatedAt: new Date(),
      },
    });

    // Check if wizard is complete and update project state
    const allAnswers = await prisma.wizardAnswer.findMany({
      where: { projectId: id },
      select: {
        step: true,
        key: true,
        value: true,
        completed: true,
      },
    });

    const completionStatus = checkWizardCompletion(allAnswers);

    // Transition to STRUCTURED if wizard is complete
    let projectState = project.state;
    if (completionStatus.canTransitionToStructured && project.state === 'IDEA') {
      await prisma.project.update({
        where: { id },
        data: { state: 'STRUCTURED' },
      });
      projectState = 'STRUCTURED';
    }

    return NextResponse.json({
      answer,
      projectState,
      completionStatus,
    });
  } catch (error) {
    console.error('Save wizard answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
