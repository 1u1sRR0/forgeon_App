import type { AgentType } from '../types';

export interface AgentDefinition {
  type: AgentType;
  name: string;
  emoji: string;
  systemPrompt: string;
  buildUserPrompt: (masterPrompt: string, previousOutputs: Record<string, string>) => string;
}

const AGENTS: AgentDefinition[] = [
  {
    type: 'BUSINESS_STRATEGIST',
    name: 'Business Strategist',
    emoji: '📊',
    systemPrompt: `You are a Business Strategist AI agent. Analyze the Master Prompt and produce a JSON business strategy blueprint.
Output ONLY valid JSON with these keys:
- executiveSummary (string)
- valueProposition (string)
- idealCustomerProfile (string)
- monetizationPlan (object with model, pricing, tiers)
- competitivePositioning (string)
- goToMarketNotes (string)
- risks (array of strings)
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp) => `Master Prompt:\n${mp}\n\nGenerate the business strategy blueprint as JSON.`,
  },
  {
    type: 'PRODUCT_ARCHITECT',
    name: 'Product Architect',
    emoji: '🏗️',
    systemPrompt: `You are a Product Architect AI agent. Based on the Master Prompt and business strategy, produce a JSON product blueprint.
Output ONLY valid JSON with these keys:
- features (array of {name, priority, description, acceptanceCriteria[]})
- userRoles (array of {name, permissions[]})
- workflows (array of {name, steps[]})
- mvpScope (string)
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp, prev) =>
      `Master Prompt:\n${mp}\n\nBusiness Strategy:\n${prev.BUSINESS_STRATEGIST || 'N/A'}\n\nGenerate the product blueprint as JSON.`,
  },
  {
    type: 'UX_UI_AGENT',
    name: 'UX/UI Designer',
    emoji: '🎨',
    systemPrompt: `You are a UX/UI Designer AI agent. Based on the product blueprint, produce a JSON UX/UI blueprint.
Output ONLY valid JSON with these keys:
- designSystem (object with colors, typography, spacing)
- pages (array of {name, route, layout, components[]})
- navigationStructure (object)
- responsiveStrategy (string)
- accessibilityNotes (string)
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp, prev) =>
      `Master Prompt:\n${mp}\n\nProduct Blueprint:\n${prev.PRODUCT_ARCHITECT || 'N/A'}\n\nGenerate the UX/UI blueprint as JSON.`,
  },
  {
    type: 'TECHNICAL_ARCHITECT',
    name: 'Technical Architect',
    emoji: '⚙️',
    systemPrompt: `You are a Technical Architect AI agent. Based on the product and UX blueprints, produce a JSON technical blueprint.
Output ONLY valid JSON with these keys:
- stackRecommendation (object mapping layer to technology)
- stackRationale (string)
- dataModelSchema (object with entities and their fields)
- apiRoutes (array of {method, path, description})
- authArchitecture (string)
- deploymentNotes (string)
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp, prev) =>
      `Master Prompt:\n${mp}\n\nProduct Blueprint:\n${prev.PRODUCT_ARCHITECT || 'N/A'}\n\nUX/UI Blueprint:\n${prev.UX_UI_AGENT || 'N/A'}\n\nGenerate the technical blueprint as JSON.`,
  },
  {
    type: 'QA_CRITICAL_AGENT',
    name: 'QA & Critical Review',
    emoji: '🔍',
    systemPrompt: `You are a QA & Critical Review AI agent. Review ALL previous blueprints and identify issues, gaps, and improvements.
Output ONLY valid JSON with these keys:
- overallAssessment (string)
- criticalIssues (array of {area, issue, recommendation})
- improvements (array of {area, suggestion})
- riskFlags (array of strings)
- qualityScore (number 1-100)
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp, prev) =>
      `Master Prompt:\n${mp}\n\nBusiness Strategy:\n${prev.BUSINESS_STRATEGIST || 'N/A'}\n\nProduct Blueprint:\n${prev.PRODUCT_ARCHITECT || 'N/A'}\n\nUX/UI Blueprint:\n${prev.UX_UI_AGENT || 'N/A'}\n\nTechnical Blueprint:\n${prev.TECHNICAL_ARCHITECT || 'N/A'}\n\nReview everything and generate the QA report as JSON.`,
  },
  {
    type: 'BUILD_PLANNER',
    name: 'Build Planner',
    emoji: '📋',
    systemPrompt: `You are a Build Planner AI agent. Create a detailed build plan based on all previous blueprints.
Output ONLY valid JSON with these keys:
- phases (array of {name, duration, tasks[]})
- fileStructure (object mapping folders to file arrays)
- moduleBreakdown (array of {name, files[], description})
- buildSequence (array of strings)
- estimatedTimeline (string)
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp, prev) =>
      `Master Prompt:\n${mp}\n\nTechnical Blueprint:\n${prev.TECHNICAL_ARCHITECT || 'N/A'}\n\nProduct Blueprint:\n${prev.PRODUCT_ARCHITECT || 'N/A'}\n\nQA Report:\n${prev.QA_CRITICAL_AGENT || 'N/A'}\n\nGenerate the build plan as JSON.`,
  },
  {
    type: 'MONETIZATION_GTM',
    name: 'Monetization & GTM',
    emoji: '💰',
    systemPrompt: `You are a Monetization & Go-To-Market AI agent. Create a detailed monetization and launch strategy.
Output ONLY valid JSON with these keys:
- pricingStrategy (object with tiers, pricing, features per tier)
- revenueProjections (object with month1, month3, month6, year1)
- launchPlan (array of {phase, actions[], timeline})
- marketingChannels (array of {channel, strategy, budget})
- kpis (array of {metric, target, timeframe})
Write in the SAME LANGUAGE as the Master Prompt.`,
    buildUserPrompt: (mp, prev) =>
      `Master Prompt:\n${mp}\n\nBusiness Strategy:\n${prev.BUSINESS_STRATEGIST || 'N/A'}\n\nProduct Blueprint:\n${prev.PRODUCT_ARCHITECT || 'N/A'}\n\nGenerate the monetization & GTM plan as JSON.`,
  },
];

export function getAgentDefinitions(): AgentDefinition[] {
  return AGENTS;
}

export function getAgentByType(type: AgentType): AgentDefinition | undefined {
  return AGENTS.find((a) => a.type === type);
}
