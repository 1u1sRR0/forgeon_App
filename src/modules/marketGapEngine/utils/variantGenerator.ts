// Variant Generator Utility for Market Gaps

import type { GapVariant, MarketGapData, BusinessIntelligenceDossier } from '../marketGapTypes';

/**
 * Generates 3 opportunity variants from a market gap
 * Each variant takes a different strategic approach:
 * - Premium: High-end solution with premium pricing
 * - Volume: Mass-market solution with competitive pricing
 * - Niche: Specialized solution for specific sub-segment
 */
export function generateVariants(gap: MarketGapData): GapVariant[] {
  const variants: GapVariant[] = [];

  // Premium Variant
  variants.push({
    id: `${gap.id}-premium`,
    approach: 'Premium',
    title: `Premium ${gap.title}`,
    targetSubSegment: `High-end ${gap.underservedSegment}`,
    differentiator: 'Premium quality, white-glove service, enterprise features',
    fullDossier: generatePremiumDossier(gap),
  });

  // Volume Variant
  variants.push({
    id: `${gap.id}-volume`,
    approach: 'Volume',
    title: `Accessible ${gap.title}`,
    targetSubSegment: `Mass-market ${gap.underservedSegment}`,
    differentiator: 'Affordable pricing, self-service, rapid onboarding',
    fullDossier: generateVolumeDossier(gap),
  });

  // Niche Variant
  variants.push({
    id: `${gap.id}-niche`,
    approach: 'Niche',
    title: `Specialized ${gap.title}`,
    targetSubSegment: `Niche ${gap.underservedSegment} with specific needs`,
    differentiator: 'Deep specialization, industry-specific features, expert support',
    fullDossier: generateNicheDossier(gap),
  });

  return variants;
}

function generatePremiumDossier(gap: MarketGapData): BusinessIntelligenceDossier {
  return {
    title: `Premium ${gap.title}`,
    hook: `Enterprise-grade solution for ${gap.underservedSegment} willing to pay for excellence`,
    category: 'B2B SaaS',
    sector: gap.sector,
    problemStatement: `${gap.gapDescription} Current solutions lack the sophistication and support that premium customers demand.`,
    targetAudience: `Enterprise ${gap.underservedSegment}`,
    buyerPersona: 'C-level executives, VPs, Directors with budget authority',
    painLevel: 8,
    solutionOverview: `A premium platform designed specifically for ${gap.underservedSegment} with white-glove service, advanced features, and dedicated support.`,
    mvpScope: 'Core platform with premium features, dedicated onboarding, priority support',
    coreFeatures: [
      'Advanced analytics and reporting',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantees',
      'Enterprise security and compliance',
    ],
    demandScore: 75,
    demandSignals: gap.evidence.map((e) => ({
      source: e.source,
      signal: e.signal,
      strength: e.strength === 'strong' ? 85 : e.strength === 'moderate' ? 70 : 55,
    })),
    competitionScore: gap.competitionLevel === 'low' ? 30 : gap.competitionLevel === 'medium' ? 50 : 70,
    competitionSnapshot: `${gap.competitionLevel} competition in premium segment. ${gap.wedgeStrategy}`,
    differentiationAngles: [
      'Premium positioning with enterprise features',
      'White-glove onboarding and support',
      'Advanced customization capabilities',
      'Proven ROI for enterprise customers',
    ],
    pricingSuggestions: '$500-2000/month per seat or custom enterprise pricing',
    pricingRationale: 'Premium pricing justified by superior features, support, and ROI',
    monetizationType: 'subscription',
    timingSignals: [
      'Growing enterprise demand in sector',
      'Increasing willingness to pay for quality solutions',
      'Market maturation creating premium segment',
    ],
    gtmChannels: [
      'Enterprise sales team',
      'Industry conferences and events',
      'LinkedIn targeted advertising',
      'Strategic partnerships',
      'Analyst relations (Gartner, Forrester)',
    ],
    risks: [
      'Long sales cycles',
      'High customer acquisition costs',
      'Need for significant upfront investment',
    ],
    mitigations: [
      'Focus on high-value accounts with strong fit',
      'Build case studies and ROI calculators',
      'Secure early design partners for validation',
    ],
    executionDifficulty: 4,
    executionReasons: [
      'Requires enterprise-grade infrastructure',
      'Need experienced sales team',
      'Complex compliance requirements',
    ],
    timeToMVP: '6-9 months',
    requiredSkills: ['Enterprise software development', 'B2B sales', 'Customer success', 'Security/compliance'],
    recommendedStack: ['Next.js', 'PostgreSQL', 'AWS', 'Stripe', 'Auth0'],
    acceptanceCriteria: [
      '5 enterprise pilot customers',
      'Average deal size > $10k ARR',
      'NPS score > 50',
      'SOC 2 Type II certification',
    ],
    nextSteps: [
      'Validate premium positioning with target customers',
      'Build enterprise feature roadmap',
      'Hire enterprise sales leader',
      'Develop security and compliance documentation',
      'Create ROI calculator and case studies',
    ],
  };
}

function generateVolumeDossier(gap: MarketGapData): BusinessIntelligenceDossier {
  return {
    title: `Accessible ${gap.title}`,
    hook: `Affordable, self-service solution bringing ${gap.title} to the masses`,
    category: 'B2B/B2C SaaS',
    sector: gap.sector,
    problemStatement: `${gap.gapDescription} Existing solutions are too expensive or complex for small businesses and individuals.`,
    targetAudience: `Small businesses, freelancers, and individuals in ${gap.underservedSegment}`,
    buyerPersona: 'Small business owners, solopreneurs, team leads with limited budgets',
    painLevel: 7,
    solutionOverview: `An affordable, easy-to-use platform that makes ${gap.title} accessible to everyone through self-service and automation.`,
    mvpScope: 'Core features with self-service onboarding, automated workflows, freemium model',
    coreFeatures: [
      'Intuitive self-service interface',
      'Automated workflows and templates',
      'Basic analytics',
      'Community support',
      'Mobile app',
    ],
    demandScore: 80,
    demandSignals: gap.evidence.map((e) => ({
      source: e.source,
      signal: e.signal,
      strength: e.strength === 'strong' ? 85 : e.strength === 'moderate' ? 70 : 55,
    })),
    competitionScore: gap.competitionLevel === 'low' ? 40 : gap.competitionLevel === 'medium' ? 60 : 80,
    competitionSnapshot: `${gap.competitionLevel} competition in mass market. ${gap.wedgeStrategy}`,
    differentiationAngles: [
      'Significantly lower price point',
      'Faster time-to-value with templates',
      'No technical expertise required',
      'Freemium model for viral growth',
    ],
    pricingSuggestions: 'Free tier + $10-50/month for premium features',
    pricingRationale: 'Low pricing enables mass adoption and viral growth',
    monetizationType: 'freemium',
    timingSignals: [
      'Growing SMB and freelancer market',
      'Demand for affordable alternatives',
      'Shift to self-service software',
    ],
    gtmChannels: [
      'Content marketing and SEO',
      'Social media advertising',
      'Product-led growth',
      'Affiliate partnerships',
      'App store optimization',
    ],
    risks: [
      'Low margins require high volume',
      'Churn risk with price-sensitive customers',
      'Support costs at scale',
    ],
    mitigations: [
      'Invest heavily in self-service and automation',
      'Build strong community for peer support',
      'Focus on product stickiness and retention',
    ],
    executionDifficulty: 3,
    executionReasons: [
      'Need scalable infrastructure',
      'Requires strong product-market fit',
      'Must optimize for low CAC',
    ],
    timeToMVP: '3-4 months',
    requiredSkills: ['Full-stack development', 'Growth marketing', 'Product design', 'Community management'],
    recommendedStack: ['Next.js', 'PostgreSQL', 'Vercel', 'Stripe', 'Clerk'],
    acceptanceCriteria: [
      '1000+ free users',
      '5% conversion to paid',
      'CAC < $50',
      'Monthly churn < 5%',
    ],
    nextSteps: [
      'Build viral loop into product',
      'Create content marketing strategy',
      'Develop self-service onboarding flow',
      'Set up analytics and growth tracking',
      'Launch beta with early adopters',
    ],
  };
}

function generateNicheDossier(gap: MarketGapData): BusinessIntelligenceDossier {
  return {
    title: `Specialized ${gap.title}`,
    hook: `Purpose-built solution for ${gap.underservedSegment} with unique industry needs`,
    category: 'Vertical SaaS',
    sector: gap.sector,
    problemStatement: `${gap.gapDescription} Generic solutions don't address the specific workflows and compliance needs of this segment.`,
    targetAudience: `Specialized ${gap.underservedSegment} with industry-specific requirements`,
    buyerPersona: 'Industry practitioners, compliance officers, specialized team leads',
    painLevel: 9,
    solutionOverview: `A deeply specialized platform built specifically for ${gap.underservedSegment} with industry-specific features, workflows, and compliance.`,
    mvpScope: 'Core vertical-specific features, industry integrations, compliance tools',
    coreFeatures: [
      'Industry-specific workflows',
      'Compliance and regulatory features',
      'Specialized integrations',
      'Expert support and training',
      'Industry best practices built-in',
    ],
    demandScore: 85,
    demandSignals: gap.evidence.map((e) => ({
      source: e.source,
      signal: e.signal,
      strength: e.strength === 'strong' ? 90 : e.strength === 'moderate' ? 75 : 60,
    })),
    competitionScore: gap.competitionLevel === 'low' ? 25 : gap.competitionLevel === 'medium' ? 45 : 65,
    competitionSnapshot: `${gap.competitionLevel} competition in niche. ${gap.wedgeStrategy}`,
    differentiationAngles: [
      'Deep industry expertise and specialization',
      'Built-in compliance and regulatory features',
      'Industry-specific integrations',
      'Expert support from industry practitioners',
    ],
    pricingSuggestions: '$100-500/month with industry-specific tiers',
    pricingRationale: 'Specialized value justifies premium over generic solutions',
    monetizationType: 'subscription',
    timingSignals: [
      'Increasing regulatory complexity in industry',
      'Growing demand for specialized tools',
      'Dissatisfaction with generic solutions',
    ],
    gtmChannels: [
      'Industry associations and events',
      'Trade publications and media',
      'Industry influencer partnerships',
      'Specialized online communities',
      'Direct outreach to target accounts',
    ],
    risks: [
      'Limited market size',
      'Deep industry expertise required',
      'Regulatory changes',
    ],
    mitigations: [
      'Build advisory board of industry experts',
      'Focus on high-value customers',
      'Stay ahead of regulatory changes',
    ],
    executionDifficulty: 4,
    executionReasons: [
      'Requires deep industry knowledge',
      'Complex compliance requirements',
      'Need for specialized integrations',
    ],
    timeToMVP: '4-6 months',
    requiredSkills: ['Industry expertise', 'Compliance knowledge', 'Specialized integrations', 'B2B sales'],
    recommendedStack: ['Next.js', 'PostgreSQL', 'AWS', 'Industry-specific APIs', 'Auth0'],
    acceptanceCriteria: [
      '20 paying customers in target niche',
      'Average deal size > $2k ARR',
      'Customer retention > 95%',
      'Industry certification/compliance',
    ],
    nextSteps: [
      'Interview 20+ industry practitioners',
      'Map industry-specific workflows',
      'Identify key compliance requirements',
      'Build industry advisory board',
      'Develop specialized feature roadmap',
    ],
  };
}
