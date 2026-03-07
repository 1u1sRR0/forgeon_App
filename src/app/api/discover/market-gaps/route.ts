// GET /api/discover/market-gaps - List market gaps with filters

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketGapService } from '@/modules/marketGapEngine/marketGapService';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || undefined;
    const competitionLevel = searchParams.get('competitionLevel') as 'low' | 'medium' | 'high' | undefined;
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    const service = new MarketGapService();
    const result = await service.getMarketGapsWithAutoSeed(session.user.id, {
      sector,
      competitionLevel,
      sort: sort as 'newest' | 'competition-asc',
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching market gaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market gaps' },
      { status: 500 }
    );
  }
}
