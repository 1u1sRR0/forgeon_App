import prisma from '@/lib/prisma';
import {
  BusinessIntelligenceDossier,
  OpportunityFilters,
  PaginatedOpportunities,
} from './opportunityTypes';
import { getOpportunityProvider } from './providerFactory';
import { generateWizardSeed } from './utils/wizardSeedGenerator';

export class OpportunityService {
  private provider = getOpportunityProvider();

  /**
   * Generate and save opportunities for a user
   */
  async generateAndSaveOpportunities(
    userId: string,
    count: number = 30,
    sectors?: string[]
  ): Promise<number> {
    try {
      const opportunities = await this.provider.generateOpportunities(userId, count, sectors);

      await prisma.opportunity.createMany({
        data: opportunities.map((opp) => ({
          id: crypto.randomUUID(),
          userId,
          title: opp.title,
          hook: opp.hook,
          category: opp.sector,
          sector: opp.sector,
          problemStatement: opp.hook,
          targetAudience: opp.buyerPersona || 'General audience',
          solutionOverview: opp.mvpScope || 'Solution overview',
          coreFeatures: [],
          painLevel: opp.painLevel,
          buyerPersona: opp.buyerPersona,
          mvpScope: opp.mvpScope,
          demandSignals: opp.demandSignals as any,
          demandScore: opp.demandScore,
          competitionScore: opp.competitionScore,
          competitionSnapshot: opp.competitionSnapshot,
          timingSignals: opp.timingSignals,
          differentiationAngles: opp.differentiationAngles,
          gtmChannels: opp.gtmChannels,
          pricingSuggestions: opp.pricingSuggestions,
          pricingRationale: opp.pricingRationale,
          monetizationType: opp.monetizationType,
          executionDifficulty: opp.executionDifficulty,
          executionReasons: opp.executionReasons,
          timeToMVP: opp.timeToMVP,
          requiredSkills: opp.requiredSkills,
          recommendedStack: opp.recommendedStack,
          risks: opp.risks,
          mitigations: opp.mitigations,
          acceptanceCriteria: opp.acceptanceCriteria,
          nextSteps: opp.nextSteps,
          viabilityScore: opp.viabilityScore,
          updatedAt: new Date(),
        })) as any,
        skipDuplicates: true,
      });

      return opportunities.length;
    } catch (error) {
      console.error('Error generating opportunities:', error);
      throw error;
    }
  }

  /**
   * Get opportunities with auto-seeding if none exist
   */
  async getOpportunitiesWithAutoSeed(
    userId: string,
    filters: OpportunityFilters = {}
  ): Promise<PaginatedOpportunities> {
    // Check if user has any opportunities
    const count = await prisma.opportunity.count({ where: { userId } });

    // Auto-seed if none exist
    if (count === 0) {
      await this.generateAndSaveOpportunities(userId);
    }

    // Return filtered opportunities
    return this.getOpportunities(userId, filters);
  }

  /**
   * Get opportunities with filtering and pagination
   */
  async getOpportunities(
    userId: string,
    filters: OpportunityFilters = {}
  ): Promise<PaginatedOpportunities> {
    const {
      search,
      sector,
      minViability,
      maxDifficulty,
      monetizationType,
      sort = 'viability',
      page = 1,
      pageSize = 12,
    } = filters;

    // Build where clause
    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { hook: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (sector) {
      where.sector = sector;
    }

    if (minViability !== undefined) {
      where.viabilityScore = { gte: minViability };
    }

    if (maxDifficulty !== undefined) {
      where.executionDifficulty = { lte: maxDifficulty };
    }

    if (monetizationType) {
      where.monetizationType = monetizationType;
    }

    // Build order by
    const orderBy: any = {};
    if (sort === 'viability') {
      orderBy.viabilityScore = 'desc';
    } else if (sort === 'difficulty') {
      orderBy.executionDifficulty = 'asc';
    } else if (sort === 'newest') {
      orderBy.createdAt = 'desc';
    }

    // Execute query
    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.opportunity.count({ where }),
    ]);

    // Get unique sectors
    const sectors = await prisma.opportunity.findMany({
      where: { userId },
      select: { sector: true },
      distinct: ['sector'],
    });

    return {
      opportunities: opportunities as any[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      sectors: sectors.map((s) => s.sector),
    };
  }

  /**
   * Create project from opportunity
   */
  async createProjectFromOpportunity(
    userId: string,
    opportunityId: string
  ): Promise<{ projectId: string; wizardSeedCreated: boolean }> {
    // Get opportunity
    const opportunity = await prisma.opportunity.findFirst({
      where: { id: opportunityId, userId },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        name: opportunity.title,
        description: opportunity.hook,
        state: 'IDEA',
        updatedAt: new Date(),
      },
    });

    // Generate wizard seed
    const wizardSeed = generateWizardSeed(opportunity as any);

    // Create opportunity-project link with wizard seed
    await prisma.opportunityProjectLink.create({
      data: {
        id: crypto.randomUUID(),
        opportunityId,
        projectId: project.id,
        wizardSeed: wizardSeed as any,
      },
    });

    return {
      projectId: project.id,
      wizardSeedCreated: true,
    };
  }
}
