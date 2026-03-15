import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MarketIntelService } from '@/modules/marketIntelEngine/marketIntelService';

const service = new MarketIntelService();

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await service.regenerateItems(session.user.id);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error regenerating market intelligence:', error);
    return NextResponse.json({ error: 'Failed to regenerate' }, { status: 500 });
  }
}
