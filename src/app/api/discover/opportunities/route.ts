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

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('q') || undefined;
    const sector = searchParams.get('sector') || undefined;
    const minViability = searchParams.get('minViability') ? parseInt(searchParams.get('minViability')!) : undefined;
    const maxDifficulty = searchParams.get('maxDifficulty') ? parseInt(searchParams.get('maxDifficulty')!) : undefined;
    const monetizationType = searchParams.get('monetizationType') || undefined;
    const sortParam = searchParams.get('sort') || 'viability-desc';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 12;

    // Map sort parameter
    let sort: 'viability' | 'difficulty' | 'newest' = 'viability';
    if (sortParam === 'difficulty-asc') sort = 'difficulty';
    else if (sortParam === 'newest') sort = 'newest';

    // Get opportunities from service with auto-seeding
    const result = await opportunityService.getOpportunitiesWithAutoSeed(
      session.user.id,
      {
        search,
        sector,
        minViability,
        maxDifficulty,
        monetizationType,
        sort,
        page,
        pageSize,
      }
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
