import prisma from '@/lib/prisma';
import {
  MarketIntelItemData,
  MarketIntelFilters,
  PaginatedMarketIntelItems,
} from './marketIntelTypes';
import { getMarketIntelProvider } from './providerFactory';

export class MarketIntelService {
  private provider = getMarketIntelProvider();

  async getItemsWithAutoSeed(
    userId: string,
    filters: MarketIntelFilters = {}
  ): Promise<PaginatedMarketIntelItems> {
    const count = await prisma.marketIntelItem.count({ where: { userId } });

    if (count === 0) {
      const items = await this.provider.generateItems(userId, 15);
      await prisma.marketIntelItem.createMany({
        data: items.map((item) => ({
          id: crypto.randomUUID(),
          userId,
          title: item.title,
          type: item.type,
          summary: item.summary,
          sector: item.sector,
          confidence: item.confidence,
          signals: item.signals as any,
          content: item.content as any,
          region: item.region,
          timeframe: item.timeframe,
          updatedAt: new Date(),
        })) as any,
      });
    }

    return this.getItems(userId, filters);
  }

  private async getItems(
    userId: string,
    filters: MarketIntelFilters = {}
  ): Promise<PaginatedMarketIntelItems> {
    const {
      search,
      sector,
      timeframe,
      region,
      sort = 'relevance',
      page = 1,
      pageSize = 60,
    } = filters;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (sector) where.sector = sector;
    if (timeframe) where.timeframe = timeframe;
    if (region) where.region = region;

    let orderBy: any = {};
    if (sort === 'confidence') orderBy = { confidence: 'desc' };
    else if (sort === 'latest') orderBy = { createdAt: 'desc' };
    else orderBy = { confidence: 'desc' }; // relevance = confidence desc

    const [items, total] = await Promise.all([
      prisma.marketIntelItem.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.marketIntelItem.count({ where }),
    ]);

    const allSectors = await prisma.marketIntelItem.findMany({
      where: { userId },
      select: { sector: true },
      distinct: ['sector'],
    });

    return {
      items: items.map((item: any) => ({
        id: item.id,
        userId: item.userId,
        title: item.title,
        type: item.type,
        summary: item.summary,
        sector: item.sector,
        confidence: item.confidence,
        signals: item.signals as any,
        content: item.content as any,
        region: item.region,
        timeframe: item.timeframe,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      sectors: allSectors.map((s) => s.sector),
    };
  }

  async regenerateItems(userId: string): Promise<MarketIntelItemData[]> {
    // Delete existing items
    await prisma.marketIntelItem.deleteMany({ where: { userId } });

    // Generate new items
    const items = await this.provider.regenerateItems(userId, 15);

    // Persist
    await prisma.marketIntelItem.createMany({
      data: items.map((item) => ({
        id: crypto.randomUUID(),
        userId,
        title: item.title,
        type: item.type,
        summary: item.summary,
        sector: item.sector,
        confidence: item.confidence,
        signals: item.signals as any,
        content: item.content as any,
        region: item.region,
        timeframe: item.timeframe,
        updatedAt: new Date(),
      })) as any,
    });

    // Return fresh data
    const result = await this.getItems(userId);
    return result.items;
  }

  async saveToProject(
    userId: string,
    itemId: string,
    projectId: string
  ): Promise<void> {
    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new Error('Project not found');

    // Verify item exists
    const item = await prisma.marketIntelItem.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) throw new Error('Market intel item not found');

    // Create link (unique constraint handles duplicates)
    await prisma.projectResearchItem.create({
      data: {
        id: crypto.randomUUID(),
        projectId,
        marketIntelId: itemId,
      },
    });
  }
}
