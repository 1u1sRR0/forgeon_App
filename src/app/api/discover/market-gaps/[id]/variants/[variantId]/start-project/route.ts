// POST /api/discover/market-gaps/[id]/variants/[variantId]/start-project - Create project from variant

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketGapService } from '@/modules/marketGapEngine/marketGapService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { variantId } = await params;

    const service = new MarketGapService();
    const result = await service.createProjectFromVariant(variantId, session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating project from variant:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
