import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createSession } from '@/modules/multiAgent/questionnaire/questionnaireEngine';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.generationSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching generation sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generation sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await createSession(session.user.id);

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('Error creating generation session:', error);
    return NextResponse.json(
      { error: 'Failed to create generation session' },
      { status: 500 }
    );
  }
}
