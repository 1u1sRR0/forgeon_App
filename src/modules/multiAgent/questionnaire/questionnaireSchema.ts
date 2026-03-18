// Questionnaire Schema — Defines structure, validations, conditional logic for all 6 sections

import type {
  BusinessType,
  QuestionnaireAnswers,
  SectionEAnswers,
} from '../types/index';

// ─── Field Types ───

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'boolean'
  | 'dynamic-list';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  /** Field only visible when condition returns true */
  conditional?: (businessType: BusinessType, answers: QuestionnaireAnswers) => boolean;
  options?: FieldOption[];
  validation?: {
    minLength?: number;
    minItems?: number;
  };
  placeholder?: string;
  aiSuggestible?: boolean;
}

export interface SectionDefinition {
  id: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ComplexityLevel = 'simple' | 'moderate' | 'complex';

export type SectionStatus = 'empty' | 'in-progress' | 'complete';

// ─── Section Definitions ───

const sectionA: SectionDefinition = {
  id: 'A',
  title: 'Business Intent',
  description: 'Describe what you want to build, the problem you solve, and your target customer.',
  fields: [
    {
      name: 'businessIdea',
      label: 'Business Idea',
      type: 'textarea',
      required: true,
      validation: { minLength: 20 },
      placeholder: 'Describe your business idea in detail...',
      aiSuggestible: false,
    },
    {
      name: 'problemSolved',
      label: 'Problem Being Solved',
      type: 'textarea',
      required: true,
      placeholder: 'What problem does your product solve?',
      aiSuggestible: true,
    },
    {
      name: 'targetCustomer',
      label: 'Target Customer',
      type: 'textarea',
      required: true,
      placeholder: 'Who is your ideal customer?',
      aiSuggestible: true,
    },
    {
      name: 'marketContext',
      label: 'Market Context',
      type: 'textarea',
      required: false,
      placeholder: 'Describe the market landscape...',
      aiSuggestible: true,
    },
    {
      name: 'urgencyMotivation',
      label: 'Urgency / Motivation',
      type: 'select',
      required: false,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
      ],
      aiSuggestible: false,
    },
  ],
};

const sectionB: SectionDefinition = {
  id: 'B',
  title: 'Product Definition',
  description: 'Define your product features, user roles, workflows, and value proposition.',
  fields: [
    {
      name: 'coreFeatures',
      label: 'Core Features',
      type: 'dynamic-list',
      required: true,
      validation: { minItems: 1 },
      placeholder: 'Add a core feature...',
      aiSuggestible: true,
    },
    {
      name: 'userRoles',
      label: 'User Roles',
      type: 'multi-select',
      required: true,
      options: [
        { value: 'founder', label: 'Founder' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'customer', label: 'Customer' },
        { value: 'custom', label: 'Custom' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'keyWorkflows',
      label: 'Key Workflows',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the main user workflows...',
      aiSuggestible: true,
    },
    {
      name: 'valueProposition',
      label: 'Value Proposition',
      type: 'textarea',
      required: true,
      placeholder: 'What makes your product unique?',
      aiSuggestible: true,
    },
    {
      name: 'competitiveAdvantage',
      label: 'Competitive Advantage',
      type: 'textarea',
      required: false,
      placeholder: 'How do you differentiate from competitors?',
      aiSuggestible: true,
    },
    {
      name: 'multiTenancy',
      label: 'Multi-Tenancy Requirements',
      type: 'textarea',
      required: false,
      conditional: (businessType) =>
        businessType === 'SAAS' || businessType === 'MARKETPLACE',
      placeholder: 'Describe multi-tenancy needs...',
      aiSuggestible: true,
    },
    {
      name: 'userInteraction',
      label: 'User-to-User Interaction',
      type: 'textarea',
      required: false,
      conditional: (businessType) =>
        businessType === 'SAAS' || businessType === 'MARKETPLACE',
      placeholder: 'Describe user interaction patterns...',
      aiSuggestible: true,
    },
  ],
};

const sectionC: SectionDefinition = {
  id: 'C',
  title: 'Monetization & Business Model',
  description: 'Define your monetization strategy and business model.',
  fields: [
    {
      name: 'monetizationType',
      label: 'Monetization Type',
      type: 'select',
      required: true,
      options: [
        { value: 'subscription', label: 'Subscription' },
        { value: 'marketplace_commission', label: 'Marketplace Commission' },
        { value: 'ads', label: 'Ads' },
        { value: 'one_time', label: 'One-Time Purchase' },
        { value: 'freemium', label: 'Freemium' },
        { value: 'usage_based', label: 'Usage-Based' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'unknown', label: "I don't know" },
      ],
      aiSuggestible: false,
    },
    {
      name: 'pricingNotes',
      label: 'Pricing Strategy Notes',
      type: 'textarea',
      required: false,
      placeholder: 'Any notes on pricing...',
      aiSuggestible: true,
    },
    {
      name: 'revenueTarget',
      label: 'Revenue Target',
      type: 'select',
      required: true,
      options: [
        { value: 'bootstrapped', label: 'Bootstrapped' },
        { value: 'seed', label: 'Seed Stage' },
        { value: 'growth', label: 'Growth Stage' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'paymentIntegrations',
      label: 'Payment Integrations',
      type: 'multi-select',
      required: true,
      options: [
        { value: 'stripe', label: 'Stripe' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'crypto', label: 'Crypto' },
        { value: 'invoicing', label: 'Invoicing' },
        { value: 'none', label: 'None yet' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'billingCycle',
      label: 'Billing Cycle',
      type: 'select',
      required: false,
      conditional: (_businessType, answers) =>
        answers.sectionC?.monetizationType === 'subscription',
      options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'both', label: 'Both' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'commissionStructure',
      label: 'Commission Structure',
      type: 'textarea',
      required: false,
      conditional: (_businessType, answers) =>
        answers.sectionC?.monetizationType === 'marketplace_commission',
      placeholder: 'Describe your commission structure...',
      aiSuggestible: true,
    },
  ],
};

const sectionD: SectionDefinition = {
  id: 'D',
  title: 'Brand & Product Expression',
  description: 'Define your brand identity, tone, UX feel, and visual preferences.',
  fields: [
    {
      name: 'productName',
      label: 'Product / Brand Name',
      type: 'text',
      required: false,
      placeholder: 'Leave empty for AI suggestion',
      aiSuggestible: true,
    },
    {
      name: 'brandTone',
      label: 'Brand Tone',
      type: 'select',
      required: true,
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'playful', label: 'Playful' },
        { value: 'technical', label: 'Technical' },
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'bold', label: 'Bold' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'uxFeel',
      label: 'UX Feel',
      type: 'select',
      required: true,
      options: [
        { value: 'dashboard-heavy', label: 'Dashboard-Heavy' },
        { value: 'content-first', label: 'Content-First' },
        { value: 'wizard-driven', label: 'Wizard-Driven' },
        { value: 'marketplace-browse', label: 'Marketplace Browse' },
        { value: 'social-feed', label: 'Social Feed' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'visualPreference',
      label: 'Visual Preference',
      type: 'select',
      required: true,
      options: [
        { value: 'dark_premium', label: 'Dark Premium' },
        { value: 'light_clean', label: 'Light & Clean' },
        { value: 'colorful_vibrant', label: 'Colorful & Vibrant' },
        { value: 'neutral_corporate', label: 'Neutral Corporate' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'inspirationRefs',
      label: 'Inspiration References',
      type: 'textarea',
      required: false,
      placeholder: 'Links or names of products you admire...',
      aiSuggestible: true,
    },
  ],
};

const sectionE: SectionDefinition = {
  id: 'E',
  title: 'Technical Scope',
  description: 'Define the technical scope and complexity of your MVP.',
  fields: [
    {
      name: 'scopeLevel',
      label: 'Scope Level',
      type: 'select',
      required: true,
      options: [
        { value: 'mvp_minimal', label: 'MVP Minimal' },
        { value: 'mvp_complete', label: 'MVP Complete' },
        { value: 'full_product', label: 'Full Product' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'authNeeds',
      label: 'Authentication Needs',
      type: 'multi-select',
      required: true,
      options: [
        { value: 'email_password', label: 'Email / Password' },
        { value: 'oauth_google', label: 'OAuth Google' },
        { value: 'oauth_github', label: 'OAuth GitHub' },
        { value: 'magic_link', label: 'Magic Link' },
        { value: 'none', label: 'None' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'paymentIntegration',
      label: 'Payment Integration',
      type: 'boolean',
      required: true,
      aiSuggestible: false,
    },
    {
      name: 'adminPanel',
      label: 'Admin Panel',
      type: 'boolean',
      required: true,
      aiSuggestible: false,
    },
    {
      name: 'aiFeatures',
      label: 'AI Features',
      type: 'boolean',
      required: true,
      aiSuggestible: false,
    },
    {
      name: 'aiDescription',
      label: 'AI Capabilities Description',
      type: 'textarea',
      required: false,
      conditional: (_businessType, answers) =>
        answers.sectionE?.aiFeatures === true,
      placeholder: 'Describe the AI capabilities you want...',
      aiSuggestible: true,
    },
    {
      name: 'apiIntegrations',
      label: 'API / Integrations',
      type: 'textarea',
      required: false,
      placeholder: 'Any external APIs or integrations needed...',
      aiSuggestible: true,
    },
  ],
};

const sectionF: SectionDefinition = {
  id: 'F',
  title: 'Constraints',
  description: 'Specify your constraints: timeline, budget, technical level, and must-haves.',
  fields: [
    {
      name: 'timeline',
      label: 'Timeline',
      type: 'select',
      required: true,
      options: [
        { value: '1_week', label: '1 Week' },
        { value: '2_weeks', label: '2 Weeks' },
        { value: '1_month', label: '1 Month' },
        { value: '3_months', label: '3 Months' },
        { value: 'flexible', label: 'Flexible' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'budgetRange',
      label: 'Budget Range',
      type: 'select',
      required: true,
      options: [
        { value: '0_bootstrapped', label: '$0 — Bootstrapped' },
        { value: 'under_500', label: 'Under $500' },
        { value: '500_2000', label: '$500 – $2,000' },
        { value: '2000_10000', label: '$2,000 – $10,000' },
        { value: '10000_plus', label: '$10,000+' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'technicalLevel',
      label: 'Technical Level',
      type: 'select',
      required: true,
      options: [
        { value: 'non_technical', label: 'Non-Technical' },
        { value: 'beginner', label: 'Beginner Developer' },
        { value: 'intermediate', label: 'Intermediate Developer' },
        { value: 'senior', label: 'Senior Developer' },
      ],
      aiSuggestible: false,
    },
    {
      name: 'mustHaveFeatures',
      label: 'Must-Have Features',
      type: 'dynamic-list',
      required: true,
      validation: { minItems: 1 },
      placeholder: 'Add a must-have feature...',
      aiSuggestible: true,
    },
    {
      name: 'dealBreakers',
      label: 'Deal Breakers',
      type: 'textarea',
      required: false,
      placeholder: 'Anything that would be a deal-breaker...',
      aiSuggestible: true,
    },
  ],
};

// ─── Exported Schema ───

export const QUESTIONNAIRE_SCHEMA: Record<string, SectionDefinition> = {
  A: sectionA,
  B: sectionB,
  C: sectionC,
  D: sectionD,
  E: sectionE,
  F: sectionF,
};

// ─── Section Keys ───

const SECTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

// ─── Helpers ───

function getSectionAnswers(
  answers: QuestionnaireAnswers,
  sectionId: string,
): Record<string, unknown> | undefined {
  const key = `section${sectionId}` as keyof QuestionnaireAnswers;
  const value = answers[key];
  if (!value) return undefined;
  return value as unknown as Record<string, unknown>;
}

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return true;
  return true;
}

// ─── validateSection ───

/**
 * Validates answers for a given section. Returns an array of validation errors.
 * An empty array means the section is valid.
 */
export function validateSection(
  sectionId: SectionKey,
  answers: QuestionnaireAnswers,
  businessType: BusinessType,
): ValidationError[] {
  const section = QUESTIONNAIRE_SCHEMA[sectionId];
  if (!section) return [{ field: '_section', message: `Unknown section: ${sectionId}` }];

  const sectionAnswers = getSectionAnswers(answers, sectionId) ?? {};
  const errors: ValidationError[] = [];

  for (const field of section.fields) {
    // Skip conditional fields that are not visible
    if (field.conditional && !field.conditional(businessType, answers)) {
      continue;
    }

    const value = sectionAnswers[field.name];

    // Required check
    if (field.required && !hasValue(value)) {
      errors.push({ field: field.name, message: `${field.label} is required` });
      continue;
    }

    // Skip further validation if value is empty and not required
    if (!hasValue(value)) continue;

    // Min length for text/textarea
    if (field.validation?.minLength && typeof value === 'string') {
      if (value.trim().length < field.validation.minLength) {
        errors.push({
          field: field.name,
          message: `${field.label} must be at least ${field.validation.minLength} characters`,
        });
      }
    }

    // Min items for dynamic-list / multi-select
    if (field.validation?.minItems && Array.isArray(value)) {
      if (value.length < field.validation.minItems) {
        errors.push({
          field: field.name,
          message: `${field.label} must have at least ${field.validation.minItems} item(s)`,
        });
      }
    }
  }

  return errors;
}

// ─── getConditionalFields ───

/**
 * Returns the names of conditional fields that should be visible
 * based on the current businessType and answers.
 */
export function getConditionalFields(
  businessType: BusinessType,
  answers: QuestionnaireAnswers,
): string[] {
  const visible: string[] = [];

  for (const sectionId of SECTION_KEYS) {
    const section = QUESTIONNAIRE_SCHEMA[sectionId];
    for (const field of section.fields) {
      if (field.conditional && field.conditional(businessType, answers)) {
        visible.push(field.name);
      }
    }
  }

  return visible;
}

// ─── computeComplexity ───

/**
 * Computes complexity indicator based on Section E options.
 * Score: 0-2 → simple, 2.5-4 → moderate, 4.5+ → complex
 */
export function computeComplexity(sectionE: SectionEAnswers | undefined): ComplexityLevel {
  if (!sectionE) return 'simple';

  let score = 0;

  // Scope level
  switch (sectionE.scopeLevel) {
    case 'mvp_minimal':
      score += 0;
      break;
    case 'mvp_complete':
      score += 1;
      break;
    case 'full_product':
      score += 2;
      break;
  }

  // Auth methods: +0.5 each
  if (sectionE.authNeeds) {
    score += sectionE.authNeeds.length * 0.5;
  }

  // Payment integration: +1
  if (sectionE.paymentIntegration) {
    score += 1;
  }

  // Admin panel: +1
  if (sectionE.adminPanel) {
    score += 1;
  }

  // AI features: +1.5
  if (sectionE.aiFeatures) {
    score += 1.5;
  }

  if (score <= 2) return 'simple';
  if (score <= 4) return 'moderate';
  return 'complex';
}

// ─── computeProgress ───

/**
 * Calculates completion percentage and per-section status.
 * A section is 'empty' if no fields are filled, 'in-progress' if some required
 * fields are filled, and 'complete' if all required (visible) fields are filled.
 */
export function computeProgress(
  answers: QuestionnaireAnswers,
  businessType: BusinessType,
): {
  sections: Record<string, SectionStatus>;
  completionPercentage: number;
  canGenerate: boolean;
} {
  let totalRequired = 0;
  let totalFilled = 0;
  const sections: Record<string, SectionStatus> = {};

  for (const sectionId of SECTION_KEYS) {
    const section = QUESTIONNAIRE_SCHEMA[sectionId];
    const sectionAnswers = getSectionAnswers(answers, sectionId) ?? {};

    let sectionRequired = 0;
    let sectionFilled = 0;
    let anyFieldFilled = false;

    for (const field of section.fields) {
      // Skip conditional fields that are not visible
      if (field.conditional && !field.conditional(businessType, answers)) {
        continue;
      }

      if (field.required) {
        sectionRequired++;
        totalRequired++;

        const value = sectionAnswers[field.name];
        const filled = hasValue(value) && isFieldValid(field, value);
        if (filled) {
          sectionFilled++;
          totalFilled++;
          anyFieldFilled = true;
        }
      } else {
        // Optional fields still count toward "any filled" for in-progress
        const value = sectionAnswers[field.name];
        if (hasValue(value)) {
          anyFieldFilled = true;
        }
      }
    }

    if (sectionRequired === 0) {
      // Section with no required fields: complete if any field filled, else empty
      sections[sectionId] = anyFieldFilled ? 'complete' : 'empty';
    } else if (sectionFilled === sectionRequired) {
      sections[sectionId] = 'complete';
    } else if (anyFieldFilled) {
      sections[sectionId] = 'in-progress';
    } else {
      sections[sectionId] = 'empty';
    }
  }

  const completionPercentage =
    totalRequired === 0 ? 100 : Math.round((totalFilled / totalRequired) * 100);

  const canGenerate = SECTION_KEYS.every((id) => {
    const errs = validateSection(id, answers, businessType);
    return errs.length === 0;
  });

  return { sections, completionPercentage, canGenerate };
}

// ─── Internal: field-level validity check ───

function isFieldValid(field: FieldDefinition, value: unknown): boolean {
  if (field.validation?.minLength && typeof value === 'string') {
    if (value.trim().length < field.validation.minLength) return false;
  }
  if (field.validation?.minItems && Array.isArray(value)) {
    if (value.length < field.validation.minItems) return false;
  }
  return true;
}
