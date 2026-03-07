// ============================================================================
// GLOSSARY BUILDER
// ============================================================================

import { GlossaryTerm, ProjectContext } from './courseTypes';
import { generateContentId } from './utils/contentHelpers';

/**
 * Build a comprehensive glossary for the course
 */
export function buildGlossary(context: ProjectContext): GlossaryTerm[] {
  const glossary: GlossaryTerm[] = [];

  // Generate terms for each category
  glossary.push(...generateBusinessTerms(context));
  glossary.push(...generateTechnicalTerms(context));
  glossary.push(...generateLegalTerms(context));
  glossary.push(...generateMarketingTerms(context));

  return glossary;
}

function generateBusinessTerms(context: ProjectContext): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [
    {
      id: generateContentId('term', 'mvp'),
      term: 'MVP (Minimum Viable Product)',
      definition:
        'The most basic version of a product that can be released to validate core assumptions with real users.',
      category: 'business',
    },
    {
      id: generateContentId('term', 'business-model'),
      term: 'Business Model',
      definition: `How ${context.name} creates, delivers, and captures value. Your model: ${context.businessModel}`,
      category: 'business',
    },
    {
      id: generateContentId('term', 'target-market'),
      term: 'Target Market',
      definition: `The specific group of customers ${context.name} aims to serve: ${context.targetAudience}`,
      category: 'business',
    },
    {
      id: generateContentId('term', 'value-proposition'),
      term: 'Value Proposition',
      definition: `The unique benefit ${context.name} offers: ${context.uniqueValue}`,
      category: 'business',
    },
  ];

  // Add monetization-specific terms
  if (context.monetization.toLowerCase().includes('subscription')) {
    terms.push({
      id: generateContentId('term', 'mrr'),
      term: 'MRR (Monthly Recurring Revenue)',
      definition:
        'Predictable revenue generated each month from active subscriptions.',
      category: 'business',
    });
  }

  return terms;
}

function generateTechnicalTerms(context: ProjectContext): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [];

  // Add tech stack specific terms
  context.techStack.forEach((tech) => {
    const techLower = tech.toLowerCase();

    if (techLower.includes('react') || techLower.includes('next')) {
      terms.push({
        id: generateContentId('term', 'component'),
        term: 'Component',
        definition:
          'A reusable piece of UI that encapsulates structure, styling, and behavior.',
        category: 'technical',
      });
    }

    if (techLower.includes('api') || techLower.includes('rest')) {
      terms.push({
        id: generateContentId('term', 'api'),
        term: 'API (Application Programming Interface)',
        definition:
          'A set of rules and protocols that allows different software applications to communicate.',
        category: 'technical',
      });
    }

    if (techLower.includes('database') || techLower.includes('sql')) {
      terms.push({
        id: generateContentId('term', 'database'),
        term: 'Database',
        definition:
          'An organized collection of structured data stored electronically.',
        category: 'technical',
      });
    }
  });

  // Add common technical terms
  terms.push({
    id: generateContentId('term', 'deployment'),
    term: 'Deployment',
    definition:
      'The process of making your application available to users on a server or cloud platform.',
    category: 'technical',
  });

  return terms;
}

function generateLegalTerms(context: ProjectContext): GlossaryTerm[] {
  return [
    {
      id: generateContentId('term', 'privacy-policy'),
      term: 'Privacy Policy',
      definition:
        'A legal document explaining how you collect, use, and protect user data.',
      category: 'legal',
    },
    {
      id: generateContentId('term', 'terms-of-service'),
      term: 'Terms of Service',
      definition:
        'The legal agreement between you and your users defining rules and responsibilities.',
      category: 'legal',
    },
    {
      id: generateContentId('term', 'gdpr'),
      term: 'GDPR',
      definition:
        'General Data Protection Regulation - EU law governing data protection and privacy.',
      category: 'legal',
    },
  ];
}

function generateMarketingTerms(context: ProjectContext): GlossaryTerm[] {
  return [
    {
      id: generateContentId('term', 'customer-acquisition'),
      term: 'Customer Acquisition',
      definition:
        'The process of bringing new customers to your product or service.',
      category: 'marketing',
    },
    {
      id: generateContentId('term', 'conversion-rate'),
      term: 'Conversion Rate',
      definition:
        'The percentage of visitors who take a desired action (sign up, purchase, etc.).',
      category: 'marketing',
    },
    {
      id: generateContentId('term', 'user-retention'),
      term: 'User Retention',
      definition:
        'The ability to keep users engaged and active over time.',
      category: 'marketing',
    },
  ];
}
