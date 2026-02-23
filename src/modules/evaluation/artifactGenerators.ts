import { WizardInputs } from './types';

export function generateBusinessModelCanvas(inputs: WizardInputs): string {
  return `# Business Model Canvas

## Customer Segments
${inputs.targetAudience || 'Not defined'}

## Value Propositions
${inputs.valueProposition || 'Not defined'}

## Channels
${inputs.deliveryModel || 'Web application'}

## Customer Relationships
Self-service platform with support

## Revenue Streams
${inputs.monetizationModel || 'Not defined'}
${inputs.pricing ? `Pricing: ${inputs.pricing}` : ''}

## Key Resources
- Technical team
- Platform infrastructure
${inputs.resources || ''}

## Key Activities
- Product development
- Customer acquisition
- Customer support

## Key Partners
- Technology providers
- Payment processors

## Cost Structure
- Development costs
- Infrastructure costs
- Marketing costs
- Operations costs
`;
}

export function generatePRD(inputs: WizardInputs): string {
  return `# Product Requirements Document

## Overview
${inputs.goal || 'Product goal not defined'}

## Problem Statement
${inputs.problemStatement}

## Solution
${inputs.valueProposition}

## Target Users
${inputs.targetAudience}

## Key Features
${inputs.keyFeatures || 'Features not defined'}

## Success Metrics
- User acquisition
- User engagement
- Revenue generation
- Customer satisfaction

## Timeline
${inputs.timeline || 'Timeline not defined'}
`;
}

export function generateTechnicalArchitecture(inputs: WizardInputs): string {
  const template = inputs.businessType === 'marketplace' ? 'MARKETPLACE_MINI' : 
                   inputs.businessType === 'ecommerce' ? 'ECOMMERCE_MINI' : 'SAAS_BASIC';

  return `# Technical Architecture

## Tech Stack
- Frontend: Next.js 15 + React + TypeScript + TailwindCSS
- Backend: Next.js API Routes
- Database: PostgreSQL + Prisma ORM
- Authentication: NextAuth.js
- Deployment: Vercel / AWS

## System Architecture
- Monolithic Next.js application
- Server-side rendering (SSR)
- API routes for backend logic
- PostgreSQL database

## Data Model
Based on ${inputs.businessType} requirements

## API Design
RESTful API with Next.js API routes

## Security
- Authentication with NextAuth
- HTTPS encryption
- Input validation
- SQL injection prevention (Prisma)

## Scalability
- Horizontal scaling via serverless
- Database connection pooling
- CDN for static assets

## Recommended Template
${template}
`;
}

export function generateUserStories(inputs: WizardInputs): string {
  const features = inputs.keyFeatures?.split('\n').filter(f => f.trim()) || [];
  
  let stories = `# User Stories\n\n## Target User\n${inputs.targetAudience}\n\n## Stories\n\n`;
  
  features.forEach((feature, index) => {
    stories += `### Story ${index + 1}: ${feature}\n`;
    stories += `As a user, I want to ${feature.toLowerCase()}, so that I can solve my problem.\n\n`;
    stories += `**Acceptance Criteria:**\n`;
    stories += `- Feature is accessible\n`;
    stories += `- Feature works as expected\n`;
    stories += `- User receives feedback\n\n`;
  });

  return stories;
}

export function generateRiskAssessment(risks: any[]): string {
  let content = `# Risk Assessment Report\n\n## Risk Matrix\n\n`;
  
  content += `| Risk | Category | Impact | Probability | Score | Critical |\n`;
  content += `|------|----------|--------|-------------|-------|----------|\n`;
  
  risks.forEach(risk => {
    const score = risk.impact * risk.probability;
    const isCritical = score >= 16;
    content += `| ${risk.title} | ${risk.category} | ${risk.impact} | ${risk.probability} | ${score} | ${isCritical ? '⚠️ YES' : 'No'} |\n`;
  });

  content += `\n## Risk Details\n\n`;
  
  risks.forEach(risk => {
    content += `### ${risk.title}\n`;
    content += `**Category:** ${risk.category}\n`;
    content += `**Description:** ${risk.description}\n`;
    content += `**Mitigation:** ${risk.mitigation}\n\n`;
  });

  return content;
}

export function generateGoToMarket(inputs: WizardInputs): string {
  return `# Go-to-Market Strategy

## Target Market
${inputs.targetAudience}

Market Size: ${inputs.audienceSize || 'Not estimated'}

## Positioning
${inputs.differentiation || 'Differentiation not defined'}

## Competitive Landscape
${inputs.competition || 'Competition not analyzed'}

## Channels
- ${inputs.deliveryModel || 'Web application'}
- Social media
- Content marketing
- Partnerships

## Pricing Strategy
${inputs.monetizationModel}
${inputs.pricing ? `Price Point: ${inputs.pricing}` : ''}

## Launch Plan
1. Beta testing with early adopters
2. Gather feedback and iterate
3. Public launch
4. Growth and scaling

## Success Metrics
- User acquisition rate
- Conversion rate
- Customer lifetime value
- Churn rate
`;
}

export function determineTemplate(inputs: WizardInputs): {
  template: string;
  confidence: number;
  reasoning: string;
} {
  const businessType = inputs.businessType?.toLowerCase() || '';
  
  if (businessType === 'marketplace') {
    return {
      template: 'MARKETPLACE_MINI',
      confidence: 0.9,
      reasoning: 'Business type is marketplace, requires supply and demand management',
    };
  }
  
  if (businessType === 'ecommerce') {
    return {
      template: 'ECOMMERCE_MINI',
      confidence: 0.9,
      reasoning: 'Business type is e-commerce, requires product catalog and checkout',
    };
  }
  
  if (businessType === 'content' || businessType === 'community') {
    return {
      template: 'LANDING_BLOG',
      confidence: 0.8,
      reasoning: 'Content-focused business, landing page with blog functionality',
    };
  }
  
  return {
    template: 'SAAS_BASIC',
    confidence: 0.85,
    reasoning: 'Default SaaS template with authentication and core CRUD functionality',
  };
}
