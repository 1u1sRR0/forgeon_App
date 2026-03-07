// POST /api/discover/market-gaps/seed - Generate market gaps

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketGapService } from '@/modules/marketGapEngine/marketGapService';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { count = 8, sectors } = body;

    const service = new MarketGapService();
    const created = await service.generateAndSaveMarketGaps(
      session.user.id,
      count,
      sectors
    );

    return NextResponse.json({
      message: `Generated ${created} market gaps`,
      count: created,
    });
  } catch (error) {
    console.error('Error generating market gaps:', error);
    return NextResponse.json(
      { error: 'Failed to generate market gaps' },
      { status: 500 }
    );
  }
}
