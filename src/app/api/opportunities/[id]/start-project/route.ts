import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpportunityService } from '@/modules/opportunityEngine/opportunityService';

const opportunityService = new OpportunityService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: opportunityId } = await params;

    const result = await opportunityService.createProjectFromOpportunity(
      session.user.id,
      opportunityId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating project from opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
