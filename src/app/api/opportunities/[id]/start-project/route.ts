import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpportunityService } from '@/modules/opportunityEngine/opportunityService';

const service = new OpportunityService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await service.createProjectFromOpportunity(session.user.id, id);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === 'Opportunity not found') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('Error creating project from opportunity:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
