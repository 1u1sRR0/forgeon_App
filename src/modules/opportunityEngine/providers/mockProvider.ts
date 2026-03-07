import {
  BusinessIntelligenceDossier,
  DemandSignal,
  OpportunityProvider,
} from '../opportunityTypes';
import { calculateViabilityScore } from '../utils/viabilityCalculator';

// Seeded random number generator for deterministic generation
function seededRandom(seed: string, index: number): number {
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, index);
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

const SECTORS = [
  'SaaS',
  'E-commerce',
  'FinTech',
  'HealthTech',
  'EdTech',
  'MarketPlace',
  'AI/ML',
  'DevTools',
  'PropTech',
  'FoodTech',
  'CleanTech',
  'Gaming',
];

const MONETIZATION_TYPES = [
  'subscription',
  'one-time',
  'freemium',
  'usage-based',
  'marketplace',
] as const;

export class MockOpportunityProvider implements OpportunityProvider {
  async generateOpportunities(
    userId: string,
    count: number = 12,
    sectors?: string[]
  ): Promise<BusinessIntelligenceDossier[]> {
    const opportunities: BusinessIntelligenceDossier[] = [];
    const targetSectors = sectors && sectors.length > 0 ? sectors : SECTORS;

    for (let i = 0; i < count; i++) {
      const seed = `${userId}-${i}`;
      const sectorIndex = Math.floor(seededRandom(seed, 0) * targetSectors.length);
      const sector = targetSectors[sectorIndex];

      opportunities.push(this.generateOpportunity(seed, i, sector));
    }

    return opportunities;
  }

  private generateOpportunity(
    seed: string,
    index: number,
    sector: string
  ): BusinessIntelligenceDossier {
    const id = `opp-${seed}-${index}`;
    const rand = (offset: number) => seededRandom(seed, index + offset);

    // Generate demand signals
    const signalCount = 3 + Math.floor(rand(1) * 3); // 3-5 signals
    const demandSignals: DemandSignal[] = [];
    for (let i = 0; i < signalCount; i++) {
      demandSignals.push({
        source: this.getSignalSource(rand(100 + i)),
        strength: 60 + Math.floor(rand(200 + i) * 40), // 60-100
        description: this.getSignalDescription(sector, rand(300 + i)),
      });
    }

    const demandScore = 60 + Math.floor(rand(2) * 40); // 60-100
    const competitionScore = 20 + Math.floor(rand(3) * 60); // 20-80
    const viabilityScore = calculateViabilityScore(
      demandScore,
      competitionScore,
      demandSignals
    );

    const painLevel = 5 + Math.floor(rand(4) * 6); // 5-10
    const executionDifficulty = 1 + Math.floor(rand(5) * 5); // 1-5

    // Generate differentiation angles
    const differentiationAngles: string[] = [];
    const angleCount = 3 + Math.floor(rand(6) * 3); // 3-5
    for (let i = 0; i < angleCount; i++) {
      differentiationAngles.push(this.getDifferentiationAngle(sector, rand(400 + i)));
    }

    // Generate GTM channels
    const gtmChannels: string[] = [];
    const channelCount = 3 + Math.floor(rand(7) * 3); // 3-5
    for (let i = 0; i < channelCount; i++) {
      gtmChannels.push(this.getGTMChannel(rand(500 + i)));
    }

    // Generate risks and mitigations
    const risks: string[] = [];
    const mitigations: string[] = [];
    const riskCount = 3 + Math.floor(rand(8) * 3); // 3-5
    for (let i = 0; i < riskCount; i++) {
      risks.push(this.getRisk(sector, rand(600 + i)));
      mitigations.push(this.getMitigation(rand(700 + i)));
    }

    // Generate acceptance criteria
    const acceptanceCriteria: string[] = [];
    const criteriaCount = 5 + Math.floor(rand(9) * 3); // 5-7
    for (let i = 0; i < criteriaCount; i++) {
      acceptanceCriteria.push(this.getAcceptanceCriteria(sector, rand(800 + i)));
    }

    // Generate next steps
    const nextSteps: string[] = [];
    for (let i = 0; i < 7; i++) {
      nextSteps.push(this.getNextStep(i + 1, sector, rand(900 + i)));
    }

    const monetizationType =
      MONETIZATION_TYPES[Math.floor(rand(10) * MONETIZATION_TYPES.length)];

    return {
      id,
      title: this.getTitle(sector, rand(11)),
      hook: this.getHook(sector, rand(12)),
      sector,
      painLevel,
      buyerPersona: this.getBuyerPersona(sector, rand(13)),
      mvpScope: this.getMVPScope(sector, rand(14)),
      demandSignals,
      demandScore,
      competitionScore,
      competitionSnapshot: this.getCompetitionSnapshot(sector, rand(15)),
      timingSignals: this.getTimingSignals(sector, rand(16)),
      differentiationAngles,
      gtmChannels,
      pricingSuggestions: this.getPricingSuggestions(monetizationType, rand(17)),
      pricingRationale: this.getPricingRationale(sector, rand(18)),
      monetizationType,
      executionDifficulty,
      executionReasons: this.getExecutionReasons(executionDifficulty, rand(19)),
      timeToMVP: this.getTimeToMVP(executionDifficulty, rand(20)),
      requiredSkills: this.getRequiredSkills(sector, rand(21)),
      recommendedStack: this.getRecommendedStack(sector, rand(22)),
      risks,
      mitigations,
      acceptanceCriteria,
      nextSteps,
      viabilityScore,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private getTitle(sector: string, rand: number): string {
    const templates = [
      `AI-Powered ${sector} Platform`,
      `Next-Gen ${sector} Solution`,
      `Smart ${sector} Automation Tool`,
      `${sector} Analytics Dashboard`,
      `Collaborative ${sector} Workspace`,
    ];
    return templates[Math.floor(rand * templates.length)];
  }

  private getHook(sector: string, rand: number): string {
    const templates = [
      `Transform how businesses approach ${sector.toLowerCase()} with intelligent automation`,
      `Streamline ${sector.toLowerCase()} operations and boost productivity by 10x`,
      `The missing piece in modern ${sector.toLowerCase()} workflows`,
      `Empower teams to achieve more in ${sector.toLowerCase()} with less effort`,
    ];
    return templates[Math.floor(rand * templates.length)];
  }

  private getBuyerPersona(sector: string, rand: number): string {
    const personas = [
      'Small business owners',
      'Enterprise teams',
      'Freelancers and consultants',
      'Mid-market companies',
      'Startups and scale-ups',
    ];
    return personas[Math.floor(rand * personas.length)];
  }

  private getMVPScope(sector: string, rand: number): string {
    return `Core ${sector.toLowerCase()} functionality with essential features for early adopters`;
  }

  private getSignalSource(rand: number): string {
    const sources = [
      'Google Trends',
      'Reddit discussions',
      'Twitter mentions',
      'LinkedIn posts',
      'Industry reports',
      'Customer surveys',
    ];
    return sources[Math.floor(rand * sources.length)];
  }

  private getSignalDescription(sector: string, rand: number): string {
    const descriptions = [
      `Growing interest in ${sector.toLowerCase()} solutions`,
      `Increasing search volume for related keywords`,
      `Active community discussions about pain points`,
      `Rising demand from target market`,
    ];
    return descriptions[Math.floor(rand * descriptions.length)];
  }

  private getCompetitionSnapshot(sector: string, rand: number): string {
    return `Moderate competition with 3-5 established players. Market has room for differentiated solutions.`;
  }

  private getTimingSignals(sector: string, rand: number): string[] {
    return [
      'Market adoption accelerating',
      'Recent regulatory changes favor new entrants',
      'Technology maturity enables better solutions',
    ];
  }

  private getDifferentiationAngle(sector: string, rand: number): string {
    const angles = [
      'Superior user experience',
      'Advanced AI capabilities',
      'Better pricing model',
      'Faster implementation',
      'Enhanced security features',
    ];
    return angles[Math.floor(rand * angles.length)];
  }

  private getGTMChannel(rand: number): string {
    const channels = [
      'Content marketing',
      'SEO',
      'Paid ads',
      'Partnerships',
      'Direct sales',
      'Community building',
    ];
    return channels[Math.floor(rand * channels.length)];
  }

  private getPricingSuggestions(
    monetizationType: string,
    rand: number
  ): string {
    const suggestions: Record<string, string> = {
      subscription: '$49-$199/month with annual discounts',
      'one-time': '$299-$999 one-time purchase',
      freemium: 'Free tier + $29-$99/month premium',
      'usage-based': '$0.01-$0.10 per transaction',
      marketplace: '10-20% commission on transactions',
    };
    return suggestions[monetizationType] || '$49-$199/month';
  }

  private getPricingRationale(sector: string, rand: number): string {
    return `Pricing aligned with market standards and value delivered to ${sector.toLowerCase()} customers`;
  }

  private getExecutionReasons(difficulty: number, rand: number): string[] {
    if (difficulty <= 2) {
      return ['Simple tech stack', 'Clear requirements', 'Proven patterns'];
    } else if (difficulty <= 3) {
      return ['Moderate complexity', 'Some integration challenges', 'Standard features'];
    } else {
      return ['Complex architecture', 'Multiple integrations', 'Advanced features'];
    }
  }

  private getTimeToMVP(difficulty: number, rand: number): string {
    if (difficulty <= 2) return '4-6 weeks';
    if (difficulty <= 3) return '8-12 weeks';
    return '12-16 weeks';
  }

  private getRequiredSkills(sector: string, rand: number): string[] {
    return ['Full-stack development', 'UI/UX design', 'API integration', 'Database design'];
  }

  private getRecommendedStack(sector: string, rand: number): string[] {
    return ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Vercel'];
  }

  private getRisk(sector: string, rand: number): string {
    const risks = [
      'Market adoption slower than expected',
      'Competition intensifies',
      'Technical complexity underestimated',
      'Customer acquisition costs too high',
    ];
    return risks[Math.floor(rand * risks.length)];
  }

  private getMitigation(rand: number): string {
    const mitigations = [
      'Start with focused niche',
      'Build strong differentiation',
      'Validate with early customers',
      'Optimize conversion funnel',
    ];
    return mitigations[Math.floor(rand * mitigations.length)];
  }

  private getAcceptanceCriteria(sector: string, rand: number): string {
    const criteria = [
      'User can complete core workflow in under 5 minutes',
      'System handles 1000+ concurrent users',
      'Data syncs in real-time',
      'Mobile responsive on all devices',
      'Passes security audit',
    ];
    return criteria[Math.floor(rand * criteria.length)];
  }

  private getNextStep(day: number, sector: string, rand: number): string {
    const steps = [
      'Day 1: Validate problem with 10 target customers',
      'Day 2: Create wireframes and user flows',
      'Day 3: Set up development environment',
      'Day 4: Build core MVP features',
      'Day 5: Implement authentication and database',
      'Day 6: Add UI polish and testing',
      'Day 7: Deploy and gather initial feedback',
    ];
    return steps[day - 1] || `Day ${day}: Continue development`;
  }
}
