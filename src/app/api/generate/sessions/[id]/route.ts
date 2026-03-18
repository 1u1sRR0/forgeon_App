import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    return NextResponse.json(genSession);
  } catch (error) {
    console.error('Error fetching generation session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generation session' },
      { status: 500 }
    );
  }
}
