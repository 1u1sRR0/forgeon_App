import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateBusinessType } from '@/modules/multiAgent/questionnaire/questionnaireEngine';

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
    const { businessType } = body;

    if (!businessType || typeof businessType !== 'string') {
      return NextResponse.json(
        { error: 'businessType is required' },
        { status: 400 }
      );
    }

    await updateBusinessType(id, businessType as any);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating business type:', error);
    return NextResponse.json(
      { error: 'Failed to update business type' },
      { status: 500 }
    );
  }
}
