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

function pick<T>(arr: T[], rand: number): T {
  return arr[Math.floor(rand * arr.length)];
}

const SECTORS = [
  'SaaS', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech',
  'MarketPlace', 'AI/ML', 'DevTools', 'PropTech', 'FoodTech',
  'CleanTech', 'Gaming', 'LegalTech', 'HRTech', 'InsurTech',
  'LogiTech', 'AgriTech', 'CyberSec',
];

const MONETIZATION_TYPES = [
  'subscription', 'one-time', 'freemium', 'usage-based', 'marketplace',
] as const;

// 55 title templates
const TITLE_TEMPLATES: Record<string, string[]> = {
  SaaS: ['AI Workflow Orchestrator', 'Smart Subscription Manager', 'SaaS Metrics Command Center', 'Churn Prediction Engine', 'Multi-Tenant Billing Hub'],
  'E-commerce': ['Personalized Storefront Builder', 'Dynamic Pricing Engine', 'Social Commerce Toolkit', 'Returns Optimization Platform', 'Headless Commerce Accelerator'],
  FinTech: ['Embedded Finance API', 'Real-Time Fraud Shield', 'Open Banking Aggregator', 'Crypto Portfolio Tracker', 'Invoice Factoring Marketplace'],
  HealthTech: ['Remote Patient Monitor', 'Clinical Trial Matcher', 'Mental Health Companion App', 'EHR Interoperability Bridge', 'Telehealth Scheduling Suite'],
  EdTech: ['Adaptive Learning Engine', 'Micro-Credential Platform', 'AI Tutoring Assistant', 'Skill Gap Analyzer', 'Cohort-Based Course Builder'],
  MarketPlace: ['Niche Service Marketplace', 'B2B Procurement Exchange', 'Freelancer Talent Pool', 'Local Artisan Marketplace', 'Equipment Rental Hub'],
  'AI/ML': ['AutoML Pipeline Builder', 'LLM Fine-Tuning Studio', 'Computer Vision Inspector', 'Synthetic Data Generator', 'AI Model Marketplace'],
  DevTools: ['API Observability Dashboard', 'Feature Flag Manager', 'CI/CD Pipeline Optimizer', 'Code Review Copilot', 'Database Migration Wizard'],
  PropTech: ['Smart Lease Manager', 'Property Valuation AI', 'Tenant Screening Platform', 'Building Energy Optimizer', 'Co-Living Space Finder'],
  FoodTech: ['Ghost Kitchen Orchestrator', 'Meal Prep Subscription Box', 'Food Waste Reducer', 'Restaurant Analytics Suite', 'Farm-to-Table Connector'],
  CleanTech: ['Carbon Footprint Tracker', 'Solar Panel Optimizer', 'EV Charging Network Planner', 'Waste Stream Analyzer', 'Green Supply Chain Auditor'],
};

const GENERIC_TITLES = [
  'AI-Powered Analytics Platform', 'Next-Gen Automation Tool', 'Smart Workflow Engine',
  'Intelligent Dashboard Builder', 'Predictive Insights Hub', 'Real-Time Monitoring Suite',
  'Collaborative Workspace Pro', 'Data Integration Gateway', 'Customer Success Platform',
  'Revenue Intelligence Engine',
];

// 35 hook templates
const HOOK_TEMPLATES = [
  'Transform how businesses approach {sector} with intelligent automation that saves 20+ hours per week',
  'The missing piece in modern {sector} workflows — finally, a tool built for how teams actually work',
  'Empower {sector} teams to achieve 10x productivity with zero learning curve',
  'Bridge the gap between legacy {sector} systems and modern cloud-native architecture',
  'Unlock hidden revenue in {sector} by turning operational data into actionable insights',
  'Reduce {sector} operational costs by 40% through AI-driven process optimization',
  'Give {sector} professionals superpowers with context-aware automation',
  'Stop losing customers to poor {sector} experiences — deliver delight at every touchpoint',
  'The first {sector} platform designed for the API-first, composable enterprise',
  'Democratize {sector} intelligence so every team member can make data-driven decisions',
  'Eliminate manual {sector} processes with end-to-end workflow automation',
  'Turn {sector} complexity into competitive advantage with smart orchestration',
  'Scale {sector} operations without scaling headcount using AI agents',
  'Bring enterprise-grade {sector} capabilities to SMBs at a fraction of the cost',
  'Predict and prevent {sector} failures before they impact your bottom line',
  'Connect every {sector} data source into a single source of truth',
  'Accelerate {sector} innovation cycles from months to days',
  'Make {sector} compliance effortless with automated monitoring and reporting',
  'Personalize every {sector} interaction using real-time behavioral signals',
  'Build resilient {sector} systems that self-heal and auto-scale',
  'Capture the $50B {sector} market opportunity with a platform-first approach',
  'Replace spreadsheet chaos with purpose-built {sector} intelligence',
  'Enable {sector} teams to ship faster with integrated dev-to-deploy pipelines',
  'Monetize {sector} data assets with privacy-preserving analytics',
  'Create frictionless {sector} experiences that drive 3x conversion rates',
  'Automate {sector} decision-making with explainable AI recommendations',
  'Unify fragmented {sector} tools into one cohesive platform',
  'Deliver {sector} insights in real-time instead of waiting for monthly reports',
  'Reduce {sector} time-to-market by 60% with no-code configuration',
  'Protect {sector} operations with proactive threat detection and response',
  'Streamline {sector} onboarding from weeks to hours with guided workflows',
  'Maximize {sector} ROI with attribution modeling and spend optimization',
  'Enable {sector} self-service analytics for non-technical stakeholders',
  'Build {sector} products 5x faster with pre-built components and templates',
  'Transform {sector} customer support from cost center to revenue driver',
];

// 25 buyer personas
const BUYER_PERSONAS = [
  'Small business owners with 5-20 employees seeking growth tools',
  'Enterprise CTOs managing 50+ person engineering teams',
  'Freelancers and solopreneurs building their first product',
  'Mid-market VP of Operations optimizing team efficiency',
  'Startup founders in pre-seed to Series A stage',
  'Product managers at growth-stage companies',
  'Marketing directors at B2B SaaS companies',
  'CFOs at mid-market companies seeking cost reduction',
  'DevOps engineers managing cloud infrastructure',
  'HR directors at companies with 100-500 employees',
  'Sales leaders managing distributed teams',
  'Customer success managers at subscription businesses',
  'Data analysts at enterprise organizations',
  'Agency owners managing multiple client accounts',
  'E-commerce store owners doing $1M-$10M annual revenue',
  'Healthcare administrators managing multi-location practices',
  'Real estate portfolio managers with 50+ properties',
  'Restaurant chain operators with 10-50 locations',
  'Supply chain managers at manufacturing companies',
  'Compliance officers at regulated financial institutions',
  'University department heads managing research budgets',
  'Non-profit directors seeking operational efficiency',
  'Insurance brokers managing diverse client portfolios',
  'Construction project managers handling multiple sites',
  'Retail operations managers overseeing 20+ stores',
];

const MVP_SCOPES = [
  'Core platform with essential features, user auth, and basic analytics for early adopters',
  'Minimum viable product with API integration, dashboard, and automated workflows',
  'Landing page, core workflow engine, payment integration, and onboarding flow',
  'Single-tenant deployment with key features, admin panel, and reporting module',
  'Mobile-first MVP with push notifications, core CRUD, and social sharing',
  'API-first backend with React dashboard, webhook support, and basic billing',
  'Chrome extension + web app combo with sync, notifications, and team features',
  'Slack/Teams integration with core automation, alerts, and configuration UI',
];

const SIGNAL_SOURCES = [
  'Google Trends', 'Reddit discussions', 'Twitter/X mentions', 'LinkedIn posts',
  'Industry reports', 'Customer surveys', 'Gartner research', 'CB Insights data',
  'Product Hunt launches', 'GitHub stars growth', 'Stack Overflow questions',
  'Crunchbase funding data', 'App Store reviews', 'G2 Crowd reviews',
];

const COMPETITION_SNAPSHOTS = [
  'Fragmented market with 10+ small players but no clear leader. Strong opportunity for a well-executed platform play.',
  'Dominated by 2-3 incumbents with aging products. Ripe for disruption with modern UX and API-first approach.',
  'Emerging market with mostly bootstrapped competitors. First-mover advantage available for well-funded entrant.',
  'Moderate competition with 5-7 established players. Differentiation through AI/ML capabilities is the key wedge.',
  'Crowded space but most solutions are horizontal. Vertical specialization creates defensible niche.',
  'Low competition in this specific segment. Adjacent markets are competitive but this niche is underserved.',
];

const DIFFERENTIATION_ANGLES = [
  'Superior UX with 50% fewer clicks to complete core workflows',
  'AI-powered recommendations that improve with usage',
  'API-first architecture enabling deep integrations',
  'Transparent pricing with no hidden fees or lock-in',
  'Real-time collaboration features competitors lack',
  'Mobile-native experience vs competitors desktop-only approach',
  'Built-in compliance and audit trail features',
  'Self-service onboarding that takes minutes not days',
  'Open-source core with premium enterprise features',
  'Vertical-specific templates and best practices built in',
  'White-label capability for agency and reseller channels',
  'Offline-first architecture for unreliable connectivity',
];

const GTM_CHANNELS = [
  'Content marketing and SEO', 'LinkedIn thought leadership', 'Product-led growth',
  'Strategic partnerships', 'Direct enterprise sales', 'Community building',
  'Developer evangelism', 'Paid search and social ads', 'Affiliate program',
  'Industry conference sponsorships', 'Podcast advertising', 'Cold outreach campaigns',
  'Referral program with incentives', 'Webinar series', 'Free tool / calculator lead magnets',
];

const RISKS = [
  'Market adoption slower than projected due to switching costs',
  'Well-funded competitor launches similar product within 6 months',
  'Technical complexity underestimated leading to timeline delays',
  'Customer acquisition costs exceed initial projections by 2x',
  'Regulatory changes create compliance burden',
  'Key talent attrition during critical development phase',
  'Platform dependency risk if major API provider changes terms',
  'Economic downturn reduces target market spending',
  'Data privacy regulations limit feature capabilities',
  'Integration complexity with legacy systems higher than expected',
];

const MITIGATIONS = [
  'Start with focused niche and expand after product-market fit',
  'Build strong moat through network effects and data advantages',
  'Validate with 20+ customer interviews before building',
  'Implement usage-based pricing to lower adoption barrier',
  'Hire compliance advisor early and build regulatory features first',
  'Create detailed technical spec and prototype before full build',
  'Diversify platform dependencies with abstraction layers',
  'Build 12-month runway and focus on capital-efficient growth',
  'Implement privacy-by-design architecture from day one',
  'Partner with system integrators for enterprise deployments',
];

const REQUIRED_SKILLS_BY_SECTOR: Record<string, string[]> = {
  SaaS: ['Full-stack TypeScript', 'Cloud infrastructure', 'Billing systems', 'Multi-tenancy'],
  FinTech: ['Financial APIs', 'Security & compliance', 'Real-time processing', 'Regulatory knowledge'],
  HealthTech: ['HIPAA compliance', 'HL7/FHIR standards', 'Telehealth protocols', 'Clinical workflows'],
  'AI/ML': ['Python/PyTorch', 'MLOps', 'Data engineering', 'Model deployment'],
  DevTools: ['CLI development', 'Language servers', 'CI/CD systems', 'Developer experience'],
  default: ['Full-stack development', 'UI/UX design', 'API integration', 'Database design'],
};

const STACKS_BY_SECTOR: Record<string, string[]> = {
  SaaS: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Vercel', 'Redis'],
  FinTech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Plaid API', 'AWS', 'Redis'],
  HealthTech: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS HIPAA', 'Twilio', 'Docker'],
  'AI/ML': ['Python', 'FastAPI', 'React', 'PostgreSQL', 'AWS SageMaker', 'Docker'],
  DevTools: ['TypeScript', 'Rust', 'PostgreSQL', 'GitHub API', 'Docker', 'Vercel'],
  default: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Vercel', 'Redis'],
};

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
      // Distribute sectors evenly, then cycle
      const sectorIndex = i % targetSectors.length;
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
    const signalCount = 3 + Math.floor(rand(1) * 3);
    const demandSignals: DemandSignal[] = [];
    for (let i = 0; i < signalCount; i++) {
      demandSignals.push({
        source: pick(SIGNAL_SOURCES, rand(100 + i)),
        strength: 60 + Math.floor(rand(200 + i) * 40),
        description: pick(HOOK_TEMPLATES, rand(300 + i)).replace(/{sector}/g, sector.toLowerCase()),
      });
    }

    const demandScore = 60 + Math.floor(rand(2) * 40);
    const competitionScore = 20 + Math.floor(rand(3) * 60);
    const viabilityScore = calculateViabilityScore(demandScore, competitionScore, demandSignals);
    const painLevel = 5 + Math.floor(rand(4) * 6);
    const executionDifficulty = 1 + Math.floor(rand(5) * 5);
    const monetizationType = MONETIZATION_TYPES[Math.floor(rand(10) * MONETIZATION_TYPES.length)];

    // Pick sector-specific title or generic
    const sectorTitles = TITLE_TEMPLATES[sector] || GENERIC_TITLES;
    const allTitles = [...sectorTitles, ...GENERIC_TITLES];
    const title = pick(allTitles, rand(11));

    const hook = pick(HOOK_TEMPLATES, rand(12)).replace(/{sector}/g, sector.toLowerCase());
    const buyerPersona = pick(BUYER_PERSONAS, rand(13));
    const mvpScope = pick(MVP_SCOPES, rand(14));

    // Differentiation angles (3-5)
    const differentiationAngles: string[] = [];
    const angleCount = 3 + Math.floor(rand(6) * 3);
    for (let i = 0; i < angleCount; i++) {
      const angle = DIFFERENTIATION_ANGLES[(Math.floor(rand(400 + i) * DIFFERENTIATION_ANGLES.length)) % DIFFERENTIATION_ANGLES.length];
      if (!differentiationAngles.includes(angle)) differentiationAngles.push(angle);
    }
    while (differentiationAngles.length < 3) differentiationAngles.push(DIFFERENTIATION_ANGLES[differentiationAngles.length]);

    // GTM channels (3-5)
    const gtmChannels: string[] = [];
    const channelCount = 3 + Math.floor(rand(7) * 3);
    for (let i = 0; i < channelCount; i++) {
      const ch = GTM_CHANNELS[(Math.floor(rand(500 + i) * GTM_CHANNELS.length)) % GTM_CHANNELS.length];
      if (!gtmChannels.includes(ch)) gtmChannels.push(ch);
    }
    while (gtmChannels.length < 3) gtmChannels.push(GTM_CHANNELS[gtmChannels.length]);

    // Risks and mitigations (3-5)
    const risks: string[] = [];
    const mitigations: string[] = [];
    const riskCount = 3 + Math.floor(rand(8) * 3);
    for (let i = 0; i < riskCount; i++) {
      const r = RISKS[(Math.floor(rand(600 + i) * RISKS.length)) % RISKS.length];
      const m = MITIGATIONS[(Math.floor(rand(700 + i) * MITIGATIONS.length)) % MITIGATIONS.length];
      if (!risks.includes(r)) { risks.push(r); mitigations.push(m); }
    }
    while (risks.length < 3) { risks.push(RISKS[risks.length]); mitigations.push(MITIGATIONS[mitigations.length]); }

    // Acceptance criteria
    const acceptanceCriteria = [
      'User can complete core workflow in under 5 minutes',
      'System handles 1000+ concurrent users',
      'Data syncs in real-time across all connected sources',
      'Mobile responsive on all devices and screen sizes',
      'Passes security audit and penetration testing',
      `${sector}-specific compliance requirements met`,
      'API response time under 200ms at p95',
    ];

    // 7-day action plan
    const nextSteps = [
      `Day 1: Validate ${sector.toLowerCase()} problem with 10 target customers`,
      'Day 2: Create wireframes and user flow diagrams',
      'Day 3: Set up development environment and CI/CD pipeline',
      'Day 4: Build core MVP features and data models',
      'Day 5: Implement authentication, billing, and integrations',
      'Day 6: Add UI polish, error handling, and automated tests',
      'Day 7: Deploy to staging, gather feedback, iterate',
    ];

    const skills = REQUIRED_SKILLS_BY_SECTOR[sector] || REQUIRED_SKILLS_BY_SECTOR.default;
    const stack = STACKS_BY_SECTOR[sector] || STACKS_BY_SECTOR.default;

    const pricingSuggestions: Record<string, string> = {
      subscription: '$49-$199/month with annual discounts',
      'one-time': '$299-$999 one-time purchase',
      freemium: 'Free tier + $29-$99/month premium',
      'usage-based': '$0.01-$0.10 per transaction/API call',
      marketplace: '10-20% commission on transactions',
    };

    return {
      id,
      title,
      hook,
      sector,
      painLevel,
      buyerPersona,
      mvpScope,
      demandSignals,
      demandScore,
      competitionScore,
      competitionSnapshot: pick(COMPETITION_SNAPSHOTS, rand(15)),
      timingSignals: [
        `${sector} market adoption accelerating in 2025-2026`,
        'Recent regulatory changes favor new entrants',
        'Technology maturity enables better solutions at lower cost',
      ],
      differentiationAngles,
      gtmChannels,
      pricingSuggestions: pricingSuggestions[monetizationType] || '$49-$199/month',
      pricingRationale: `Pricing aligned with ${sector.toLowerCase()} market standards and value delivered`,
      monetizationType,
      executionDifficulty,
      executionReasons: executionDifficulty <= 2
        ? ['Simple tech stack', 'Clear requirements', 'Proven patterns']
        : executionDifficulty <= 3
          ? ['Moderate complexity', 'Some integration challenges', 'Standard features']
          : ['Complex architecture', 'Multiple integrations', 'Advanced features required'],
      timeToMVP: executionDifficulty <= 2 ? '4-6 weeks' : executionDifficulty <= 3 ? '8-12 weeks' : '12-16 weeks',
      requiredSkills: skills,
      recommendedStack: stack,
      risks,
      mitigations,
      acceptanceCriteria,
      nextSteps,
      viabilityScore,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
