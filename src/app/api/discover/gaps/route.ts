import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { marketGapService } from '@/modules/marketGapEngine/marketGapService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const sector = searchParams.get('sector') || '';
    const minViability = searchParams.get('minViability') ? parseInt(searchParams.get('minViability')!) : undefined;
    const maxDifficulty = searchParams.get('maxDifficulty') || '';
    const sort = searchParams.get('sort') || 'viability-desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;

    // Get market gaps from service
    const result = await marketGapService.getMarketGaps({
      query,
      sector,
      minViability,
      maxDifficulty,
      sort,
      page,
      limit,
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
