import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpportunityService } from '@/modules/opportunityEngine/opportunityService';

const opportunityService = new OpportunityService();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { count = 12, sectors } = body;

    const created = await opportunityService.generateAndSaveOpportunities(
      session.user.id,
      count,
      sectors
    );

    return NextResponse.json({
      success: true,
      created,
      message: `Generated ${created} opportunities`,
    });
  } catch (error) {
    console.error('Error seeding opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to seed opportunities' },
      { status: 500 }
    );
  }
}
