import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketIntelService } from '@/modules/marketIntelEngine/marketIntelService';

const service = new MarketIntelService();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sp = request.nextUrl.searchParams;
    const result = await service.getItemsWithAutoSeed(session.user.id, {
      search: sp.get('search') || undefined,
      sector: sp.get('sector') || undefined,
      timeframe: sp.get('timeframe') || undefined,
      region: sp.get('region') || undefined,
      sort: (sp.get('sort') as any) || 'relevance',
      page: parseInt(sp.get('page') || '1'),
      pageSize: parseInt(sp.get('pageSize') || '60'),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching market intelligence items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
