// GET /api/discover/market-gaps/[id] - Get single market gap

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const gap = await prisma.marketGap.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        variants: true,
      },
    });

    if (!gap) {
      return NextResponse.json({ error: 'Market gap not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: gap.id,
      title: gap.title,
      sector: gap.sector,
      underservedSegment: gap.underservedSegment,
      competitionLevel: gap.competitionLevel,
      gapDescription: gap.gapDescription,
      evidence: gap.evidence,
      wedgeStrategy: gap.wedgeStrategy,
      estimatedMarketSize: gap.estimatedMarketSize,
      variants: gap.variants.map((v) => ({
        id: v.id,
        approach: v.approach,
        title: v.title,
        targetSubSegment: v.targetSubSegment,
        differentiator: v.differentiator,
        fullDossier: v.fullDossier,
      })),
      createdAt: gap.createdAt,
    });
  } catch (error) {
    console.error('Error fetching market gap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market gap' },
      { status: 500 }
    );
  }
}
