import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpportunityService } from '@/modules/opportunityEngine/opportunityService';

const opportunityService = new OpportunityService();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('q') || undefined,
      sector: searchParams.get('sector') || undefined,
      minViability: searchParams.get('minViability')
        ? parseInt(searchParams.get('minViability')!)
        : undefined,
      maxDifficulty: searchParams.get('maxDifficulty')
        ? parseInt(searchParams.get('maxDifficulty')!)
        : undefined,
      monetizationType: searchParams.get('monetizationType') || undefined,
      sort: (searchParams.get('sort') as any) || 'viability',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      pageSize: searchParams.get('pageSize')
        ? parseInt(searchParams.get('pageSize')!)
        : 12,
    };

    const result = await opportunityService.getOpportunitiesWithAutoSeed(
      session.user.id,
      filters
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
