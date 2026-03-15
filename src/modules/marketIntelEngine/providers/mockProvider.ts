import {
  MarketIntelProvider,
  MarketIntelItemData,
  MarketIntelType,
  MarketIntelSignal,
  MarketIntelContent,
} from '../marketIntelTypes';

// Seeded PRNG based on userId + day
function seededRandom(seed: string, index: number): number {
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, index);
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], rand: number): T {
  return arr[Math.floor(rand * arr.length)];
}

const SIGNAL_TAXONOMY = [
  'search interest', 'hiring velocity', 'funding trend',
  'competitor density', 'regulatory tailwinds', 'regulatory headwinds',
  'community chatter', 'pricing power', 'platform shifts',
] as const;

const SECTORS = [
  'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
  'AI/ML', 'DevTools', 'CleanTech', 'PropTech', 'CyberSec',
  'HRTech', 'LegalTech',
];

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Global'];
const TIMEFRAMES = ['short', 'medium', 'long'];

const TREND_TITLES = [
  'AI Agent Adoption Accelerating in Enterprise', 'Vertical SaaS Outperforming Horizontal Plays',
  'API-First Architecture Becoming Standard', 'No-Code Platforms Reaching Enterprise Maturity',
  'Edge Computing Enabling Real-Time Applications', 'Composable Commerce Replacing Monoliths',
  'Privacy-First Analytics Gaining Traction', 'Embedded Finance Expanding Beyond FinTech',
  'Developer Experience as Competitive Moat', 'Sustainability Tech Attracting Record Funding',
  'Micro-SaaS Bootstrapping Renaissance', 'AI-Powered Code Generation Reshaping DevTools',
  'Decentralized Identity Solutions Emerging', 'Real-Time Collaboration Becoming Table Stakes',
  'Platform Engineering Replacing DevOps', 'Usage-Based Pricing Models Dominating SaaS',
  'Synthetic Data Enabling Privacy-Safe ML', 'Low-Latency Streaming Infrastructure Boom',
];

const SECTOR_INSIGHT_TITLES = [
  'HealthTech Consolidation Wave Incoming', 'EdTech Pivoting to B2B Enterprise Training',
  'FinTech Regulatory Landscape Shifting', 'E-commerce Margins Under Pressure',
  'PropTech Smart Building Adoption Surge', 'CyberSec Zero-Trust Becoming Mandatory',
  'HRTech Skills-Based Hiring Revolution', 'LegalTech Contract AI Reaching Maturity',
  'CleanTech Carbon Credit Market Expanding', 'AI/ML Model Marketplace Fragmentation',
  'DevTools Observability Stack Consolidation', 'SaaS PLG Motion Hitting Ceiling',
  'InsurTech Parametric Products Growing', 'AgriTech Precision Farming Data Play',
  'Gaming Cloud Streaming Infrastructure', 'MarketPlace Trust & Safety Investment',
  'FoodTech Ghost Kitchen Optimization', 'LogiTech Last-Mile Automation',
];

const STARTUP_DATA_TITLES = [
  'Series A Valuations Normalizing Post-Correction', 'Pre-Seed Rounds Getting Larger',
  'AI Startups Commanding 3x Revenue Multiples', 'B2B SaaS Median ARR at Series A: $2M',
  'Developer Tool Startups Seeing Faster Adoption', 'Climate Tech Funding Hits New Record',
  'Latin America Startup Ecosystem Maturing', 'Solo Founder Success Rate Improving',
  'Open Source Business Models Evolving', 'Vertical AI Startups Outperforming Horizontal',
  'Remote-First Startups Showing Better Retention', 'PLG Companies Reaching $10M ARR Faster',
  'Bootstrapped SaaS Exits Increasing', 'Corporate Venture Arms More Active',
  'Seed Stage Competition Intensifying', 'AI Infrastructure Startups Well-Funded',
  'Cross-Border SaaS Expansion Accelerating', 'Micro-PE Acquiring More SaaS Companies',
];

const DEMAND_INDICATOR_TITLES = [
  'Enterprise AI Budget Allocation Doubling', 'SMB Software Spend Recovering',
  'Developer Tooling Budget Growing 40% YoY', 'Compliance Software Demand Surging',
  'Customer Data Platform Interest Spiking', 'Workflow Automation Search Volume Up 60%',
  'API Management Tools in High Demand', 'Security Audit Tool Searches Tripling',
  'No-Code Database Interest Accelerating', 'Real-Time Analytics Demand Outpacing Supply',
  'Integration Platform Searches at All-Time High', 'AI Writing Tool Adoption Plateauing',
  'Project Management Tool Fatigue Setting In', 'Video Collaboration Tools Commoditizing',
  'Data Pipeline Tool Interest Growing Steadily', 'Identity Verification Demand Surging',
  'Subscription Management Tool Gap Widening', 'Customer Success Platform Demand Rising',
];

const TITLES_BY_TYPE: Record<MarketIntelType, string[]> = {
  TREND: TREND_TITLES,
  SECTOR_INSIGHT: SECTOR_INSIGHT_TITLES,
  STARTUP_DATA: STARTUP_DATA_TITLES,
  DEMAND_INDICATOR: DEMAND_INDICATOR_TITLES,
};

const RISKS_POOL = [
  'Market timing may be premature for mainstream adoption',
  'Regulatory uncertainty could slow growth trajectory',
  'Incumbent players may respond aggressively with competing features',
  'Economic downturn could reduce enterprise spending in this area',
  'Technology maturity may not support production-scale deployments yet',
  'Talent shortage in this domain could limit execution speed',
  'Data availability and quality remain significant challenges',
  'Customer education costs may be higher than anticipated',
];

const HOW_TO_USE_POOL = [
  'Use this signal to validate your product positioning in the market',
  'Consider pivoting your GTM strategy to align with this trend',
  'Incorporate this insight into your pitch deck for investor conversations',
  'Adjust your product roadmap to capitalize on this emerging demand',
  'Use this data point when evaluating competitive landscape',
  'Factor this into your pricing strategy decisions',
  'Consider this when planning your next feature release',
  'Use this to identify potential partnership opportunities',
];

export class MockMarketIntelProvider implements MarketIntelProvider {
  private getDaySeed(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  }

  async generateItems(userId: string, countPerCategory: number = 15): Promise<MarketIntelItemData[]> {
    const daySeed = this.getDaySeed();
    const baseSeed = `${userId}-${daySeed}`;
    const items: MarketIntelItemData[] = [];
    const types: MarketIntelType[] = ['TREND', 'SECTOR_INSIGHT', 'STARTUP_DATA', 'DEMAND_INDICATOR'];

    for (const type of types) {
      const titles = TITLES_BY_TYPE[type];
      for (let i = 0; i < countPerCategory; i++) {
        const seed = `${baseSeed}-${type}-${i}`;
        const rand = (offset: number) => seededRandom(seed, i + offset);

        const sector = pick(SECTORS, rand(1));
        const confidence = 40 + Math.floor(rand(2) * 60); // 40-99
        const title = titles[i % titles.length];

        // Generate 3-5 signals from taxonomy
        const signalCount = 3 + Math.floor(rand(3) * 3);
        const signals: MarketIntelSignal[] = [];
        for (let s = 0; s < signalCount; s++) {
          const label = SIGNAL_TAXONOMY[Math.floor(rand(100 + s) * SIGNAL_TAXONOMY.length)];
          if (!signals.find(sig => sig.label === label)) {
            signals.push({
              label,
              strength: 1 + Math.floor(rand(200 + s) * 5), // 1-5
              explanation: `${label} data shows ${confidence > 70 ? 'strong' : 'moderate'} signal for ${sector.toLowerCase()} sector`,
            });
          }
        }
        while (signals.length < 3) {
          const label = SIGNAL_TAXONOMY[signals.length];
          signals.push({ label, strength: 3, explanation: `Baseline ${label} signal detected` });
        }

        const content: MarketIntelContent = {
          overview: `Analysis of ${title.toLowerCase()} reveals ${confidence > 70 ? 'significant' : 'emerging'} patterns in the ${sector} sector. Key indicators suggest ${confidence > 70 ? 'strong momentum' : 'early-stage development'} with implications for product strategy and market positioning.`,
          evidenceSignals: signals.map(s => ({ ...s })),
          risks: [
            pick(RISKS_POOL, rand(300)),
            pick(RISKS_POOL, rand(301)),
            pick(RISKS_POOL, rand(302)),
          ],
          howToUse: [
            pick(HOW_TO_USE_POOL, rand(400)),
            pick(HOW_TO_USE_POOL, rand(401)),
            pick(HOW_TO_USE_POOL, rand(402)),
          ],
          relatedItems: [],
        };

        items.push({
          id: crypto.randomUUID(),
          userId,
          title,
          type,
          summary: `${title} — ${confidence > 70 ? 'High' : 'Moderate'} confidence signal in ${sector} with ${signals.length} supporting indicators.`,
          sector,
          confidence,
          signals,
          content,
          region: pick(REGIONS, rand(500)),
          timeframe: pick(TIMEFRAMES, rand(501)),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return items;
  }

  async regenerateItems(userId: string, countPerCategory: number = 15): Promise<MarketIntelItemData[]> {
    return this.generateItems(userId, countPerCategory);
  }
}
