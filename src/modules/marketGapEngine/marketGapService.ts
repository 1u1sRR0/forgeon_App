// Market Gap Service - Business Logic Orchestration

import { prisma } from '@/lib/prisma';
import type {
  MarketGapData,
  MarketGapFilters,
  PaginatedMarketGaps,
  GapVariant,
} from './marketGapTypes';
import { getMarketGapProvider } from './providerFactory';
import { generateWizardSeed } from '../opportunityEngine/utils/wizardSeedGenerator';

export class MarketGapService {
  private provider = getMarketGapProvider();

  /**
   * Generates and saves market gaps to database
   */
  async generateAndSaveMarketGaps(
    userId: string,
    count: number = 8,
    sectors?: string[]
  ): Promise<number> {
    const gaps = await this.provider.generateMarketGaps(userId, count, sectors);

    const created = await prisma.marketGap.createMany({
      data: gaps.map((gap) => ({
        id: crypto.randomUUID(),
        userId,
        title: gap.title,
        sector: gap.sector,
        underservedSegment: gap.underservedSegment,
        competitionLevel: gap.competitionLevel,
        gapDescription: gap.gapDescription,
        evidence: gap.evidence as any,
        wedgeStrategy: gap.wedgeStrategy,
        estimatedMarketSize: gap.estimatedMarketSize,
        updatedAt: new Date(),
      })) as any,
    });

    return created.count;
  }

  /**
   * Gets market gaps with auto-seeding if empty
   */
  async getMarketGapsWithAutoSeed(
    userId: string,
    filters: MarketGapFilters = {}
  ): Promise<PaginatedMarketGaps> {
    // Check if user has any gaps
    const existingCount = await prisma.marketGap.count({
      where: { userId },
    });

    // Auto-seed if empty
    if (existingCount === 0) {
      await this.generateAndSaveMarketGaps(userId, 8);
    }

    return this.getMarketGaps(userId, filters);
  }

  /**
   * Gets market gaps with filtering and pagination
   */
  async getMarketGaps(
    userId: string,
    filters: MarketGapFilters = {}
  ): Promise<PaginatedMarketGaps> {
    const {
      sector,
      competitionLevel,
      sort = 'newest',
      page = 1,
      pageSize = 12,
    } = filters;

    const where: any = { userId };

    if (sector) {
      where.sector = sector;
    }

    if (competitionLevel) {
      where.competitionLevel = competitionLevel;
    }

    const orderBy: any = sort === 'newest' ? { createdAt: 'desc' } : { competitionLevel: 'asc' };

    const [gaps, total] = await Promise.all([
      prisma.marketGap.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          MarketGapVariant: true,
        },
      }),
      prisma.marketGap.count({ where }),
    ]);

    // Get unique sectors for filter dropdown
    const allGaps = await prisma.marketGap.findMany({
      where: { userId },
      select: { sector: true },
      distinct: ['sector'],
    });
    const sectors = allGaps.map((g) => g.sector);

    return {
      gaps: gaps.map((g: any) => ({
        id: g.id,
        title: g.title,
        sector: g.sector,
        underservedSegment: g.underservedSegment,
        competitionLevel: g.competitionLevel as 'low' | 'medium' | 'high',
        gapDescription: g.gapDescription,
        evidence: g.evidence as any,
        wedgeStrategy: g.wedgeStrategy,
        estimatedMarketSize: g.estimatedMarketSize,
        variants: (g as any).MarketGapVariant.map((v: any) => ({
          id: v.id,
          approach: v.approach as 'Premium' | 'Volume' | 'Niche',
          title: v.title,
          targetSubSegment: v.targetSubSegment,
          differentiator: v.differentiator,
          fullDossier: v.fullDossier as any,
        })),
        createdAt: g.createdAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      sectors,
    };
  }

  /**
   * Generates and saves 3 variants for a market gap
   */
  async generateVariantsForGap(gapId: string, userId: string): Promise<GapVariant[]> {
    // Get the gap
    const gap = await prisma.marketGap.findFirst({
      where: { id: gapId, userId },
    });

    if (!gap) {
      throw new Error('Market gap not found');
    }

    // Check if variants already exist
    const existingVariants = await prisma.marketGapVariant.findMany({
      where: { marketGapId: gapId },
    });

    if (existingVariants.length > 0) {
      return existingVariants.map((v: any) => ({
        id: v.id,
        approach: v.approach as 'Premium' | 'Volume' | 'Niche',
        title: v.title,
        targetSubSegment: v.targetSubSegment,
        differentiator: v.differentiator,
        fullDossier: v.fullDossier as any,
      }));
    }

    // Generate variants
    const gapData: MarketGapData = {
      id: gap.id,
      title: gap.title,
      sector: gap.sector,
      underservedSegment: (gap as any).underservedSegment,
      competitionLevel: (gap as any).competitionLevel as 'low' | 'medium' | 'high',
      gapDescription: (gap as any).gapDescription,
      evidence: (gap as any).evidence as any,
      wedgeStrategy: (gap as any).wedgeStrategy,
      estimatedMarketSize: (gap as any).estimatedMarketSize,
      createdAt: gap.createdAt,
    };

    const variants = this.provider.generateVariants(gapData);

    // Save variants
    await prisma.marketGapVariant.createMany({
      data: variants.map((v) => ({
        id: crypto.randomUUID(),
        marketGapId: gapId,
        approach: v.approach,
        title: v.title,
        targetSubSegment: v.targetSubSegment,
        differentiator: v.differentiator,
        fullDossier: v.fullDossier as any,
      })) as any,
    });

    return variants;
  }

  /**
   * Creates a project from a market gap variant
   */
  async createProjectFromVariant(
    variantId: string,
    userId: string
  ): Promise<{ projectId: string; wizardSeedCreated: boolean }> {
    // Get variant with gap
    const variant = await prisma.marketGapVariant.findFirst({
      where: { id: variantId },
      include: { MarketGap: true },
    });

    if (!variant || (variant as any).MarketGap.userId !== userId) {
      throw new Error('Variant not found');
    }

    const dossier = (variant as any).fullDossier as any;

    // Create project
    const project = await prisma.project.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        name: dossier.title,
        description: dossier.problemStatement,
        state: 'IDEA',
        updatedAt: new Date(),
      },
    });

    // Generate wizard seed
    const wizardSeed = generateWizardSeed(dossier);

    // Create link with wizard seed
    await prisma.marketGapProjectLink.create({
      data: {
        id: crypto.randomUUID(),
        projectId: project.id,
        marketGapId: (variant as any).MarketGap.id,
        marketGapVariantId: variantId,
        wizardSeed: wizardSeed as any,
      } as any,
    });

    return {
      projectId: project.id,
      wizardSeedCreated: true,
    };
  }
}
