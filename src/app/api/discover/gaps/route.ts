import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketGapService } from '@/modules/marketGapEngine/marketGapService';

const marketGapService = new MarketGapService();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const sector = searchParams.get('sector') || undefined;
    const competitionLevel = searchParams.get('competitionLevel') as 'low' | 'medium' | 'high' | undefined;
    const sortParam = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 12;

    // Map sort parameter
    const sort: 'newest' | 'competition-asc' = sortParam === 'competition-asc' ? 'competition-asc' : 'newest';

    // Get market gaps from service with auto-seeding
    const result = await marketGapService.getMarketGapsWithAutoSeed(
      session.user.id,
      {
        sector,
        competitionLevel,
        sort,
        page,
        pageSize,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching market gaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market gaps' },
      { status: 500 }
    );
  }
}
