// Mock Market Gap Provider

import type { MarketGapData, MarketGapProvider, GapEvidence, GapVariant } from '../marketGapTypes';
import { generateVariants } from '../utils/variantGenerator';

export class MockMarketGapProvider implements MarketGapProvider {
  /**
   * Generates deterministic market gaps based on userId seed
   */
  async generateMarketGaps(userId: string, count: number = 8, sectors?: string[]): Promise<MarketGapData[]> {
    const seed = this.hashUserId(userId);
    const gaps: MarketGapData[] = [];

    const allSectors = sectors && sectors.length > 0 ? sectors : [
      'Healthcare',
      'Education',
      'Finance',
      'Real Estate',
      'E-commerce',
      'Manufacturing',
      'Logistics',
      'Legal',
    ];

    const gapTemplates = [
      {
        titleTemplate: 'AI-Powered {sector} Analytics',
        segmentTemplate: 'Mid-market {sector} companies',
        descriptionTemplate:
          'Mid-market {sector} companies lack affordable, easy-to-use analytics tools. Enterprise solutions are too expensive and complex, while basic tools lack necessary features.',
        wedgeTemplate: 'Start with automated reporting, expand to predictive analytics',
      },
      {
        titleTemplate: 'Compliance Automation for {sector}',
        segmentTemplate: 'Small {sector} businesses',
        descriptionTemplate:
          'Small {sector} businesses struggle with regulatory compliance due to complexity and cost. Manual processes are error-prone and time-consuming.',
        wedgeTemplate: 'Focus on most common compliance requirements, build trust through accuracy',
      },
      {
        titleTemplate: 'Workflow Optimization Platform for {sector}',
        segmentTemplate: '{sector} teams under 50 people',
        descriptionTemplate:
          '{sector} teams under 50 people need specialized workflow tools but generic project management software doesn\'t fit their needs.',
        wedgeTemplate: 'Build industry-specific templates, integrate with existing tools',
      },
      {
        titleTemplate: 'Customer Engagement Suite for {sector}',
        segmentTemplate: '{sector} service providers',
        descriptionTemplate:
          '{sector} service providers need better ways to engage customers but CRM systems are too complex and not tailored to their industry.',
        wedgeTemplate: 'Start with automated communications, expand to full customer lifecycle',
      },
      {
        titleTemplate: 'Resource Planning Tool for {sector}',
        segmentTemplate: 'Growing {sector} companies',
        descriptionTemplate:
          'Growing {sector} companies outgrow spreadsheets but ERP systems are too expensive and complex for their stage.',
        wedgeTemplate: 'Focus on core resource planning, add modules as customers grow',
      },
      {
        titleTemplate: 'Training & Onboarding Platform for {sector}',
        segmentTemplate: '{sector} companies with high turnover',
        descriptionTemplate:
          '{sector} companies with high turnover need efficient training systems but generic LMS platforms lack industry-specific content.',
        wedgeTemplate: 'Provide industry-specific training content, build certification programs',
      },
      {
        titleTemplate: 'Data Integration Hub for {sector}',
        segmentTemplate: '{sector} businesses with legacy systems',
        descriptionTemplate:
          '{sector} businesses with legacy systems struggle to integrate modern tools. Custom integrations are expensive and fragile.',
        wedgeTemplate: 'Start with most common integrations, build marketplace for connectors',
      },
      {
        titleTemplate: 'Quality Assurance System for {sector}',
        segmentTemplate: '{sector} operations teams',
        descriptionTemplate:
          '{sector} operations teams need systematic quality control but existing tools are either too basic or too complex.',
        wedgeTemplate: 'Focus on automated checks, expand to full quality management',
      },
    ];

    for (let i = 0; i < count; i++) {
      const sectorIndex = (seed + i) % allSectors.length;
      const templateIndex = (seed + i) % gapTemplates.length;
      const sector = allSectors[sectorIndex];
      const template = gapTemplates[templateIndex];

      const competitionLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      const competitionLevel = competitionLevels[(seed + i) % 3];

      gaps.push({
        id: `gap-${userId}-${i}`,
        title: template.titleTemplate.replace('{sector}', sector),
        sector,
        underservedSegment: template.segmentTemplate.replace('{sector}', sector),
        competitionLevel,
        gapDescription: template.descriptionTemplate.replace(/{sector}/g, sector),
        evidence: this.generateEvidence(seed + i, sector),
        wedgeStrategy: template.wedgeTemplate,
        estimatedMarketSize: this.generateMarketSize(seed + i),
        createdAt: new Date(),
      });
    }

    return gaps;
  }

  /**
   * Generates 3 opportunity variants for a market gap
   */
  generateVariants(gap: MarketGapData): GapVariant[] {
    return generateVariants(gap);
  }

  private generateEvidence(seed: number, sector: string): GapEvidence[] {
    const evidenceTemplates = [
      {
        signal: 'Reddit threads with 500+ upvotes discussing lack of affordable solutions',
        source: 'Reddit',
        strength: 'strong' as const,
      },
      {
        signal: 'Industry survey shows 67% dissatisfaction with current tools',
        source: 'Industry Report',
        strength: 'strong' as const,
      },
      {
        signal: 'Growing number of LinkedIn posts requesting recommendations',
        source: 'LinkedIn',
        strength: 'moderate' as const,
      },
      {
        signal: 'Competitor reviews mention missing features for this segment',
        source: 'G2/Capterra',
        strength: 'moderate' as const,
      },
      {
        signal: `${sector} professionals building custom solutions with spreadsheets`,
        source: 'User Interviews',
        strength: 'strong' as const,
      },
      {
        signal: 'Industry conferences highlighting this as emerging need',
        source: 'Conference Talks',
        strength: 'moderate' as const,
      },
    ];

    const count = 3 + (seed % 3); // 3-5 evidence signals
    const evidence: GapEvidence[] = [];

    for (let i = 0; i < count; i++) {
      const index = (seed + i) % evidenceTemplates.length;
      evidence.push(evidenceTemplates[index]);
    }

    return evidence;
  }

  private generateMarketSize(seed: number): string {
    const sizes = [
      '$50M-100M TAM',
      '$100M-250M TAM',
      '$250M-500M TAM',
      '$500M-1B TAM',
      '$1B-2B TAM',
    ];
    return sizes[seed % sizes.length];
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
