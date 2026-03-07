// POST /api/discover/market-gaps/[id]/generate-variants - Generate opportunity variants

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketGapService } from '@/modules/marketGapEngine/marketGapService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const service = new MarketGapService();
    const variants = await service.generateVariantsForGap(id, session.user.id);

    return NextResponse.json({
      variants,
      message: 'Generated 3 opportunity variants',
    });
  } catch (error) {
    console.error('Error generating variants:', error);
    return NextResponse.json(
      { error: 'Failed to generate variants' },
      { status: 500 }
    );
  }
}
