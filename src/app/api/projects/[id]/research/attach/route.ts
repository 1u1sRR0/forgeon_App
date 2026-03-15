import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketIntelService } from '@/modules/marketIntelEngine/marketIntelService';

const service = new MarketIntelService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const body = await request.json();
    const { intelItemId } = body;

    if (!intelItemId) {
      return NextResponse.json({ error: 'intelItemId is required' }, { status: 400 });
    }

    await service.saveToProject(session.user.id, intelItemId, projectId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Project not found') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (error.message === 'Market intel item not found') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already saved to this project' }, { status: 409 });
    }
    console.error('Error attaching research item:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
