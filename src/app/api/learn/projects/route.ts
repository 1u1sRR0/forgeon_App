// GET /api/learn/projects - Get projects with progress

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LearnService } from '@/modules/learnHub/learnService';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;

    const service = new LearnService();
    const projects = await service.getProjectsWithProgress(session.user.id, q);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching learn projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
