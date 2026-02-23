// Wizard step definitions and types

export interface WizardField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null; // Returns error message or null
  };
  helpText?: string;
  allowDontKnow?: boolean;
}

export interface WizardStep {
  step: number;
  title: string;
  description: string;
  fields: WizardField[];
}

export const WIZARD_STEPS: WizardStep[] = [
  // Step 1: User Profile
  {
    step: 1,
    title: 'User Profile',
    description: 'Tell us about yourself and your background',
    fields: [
      {
        key: 'userRole',
        label: 'What is your role?',
        type: 'select',
        required: false,
        options: [
          { value: 'founder', label: 'Founder / Entrepreneur' },
          { value: 'developer', label: 'Developer' },
          { value: 'designer', label: 'Designer' },
          { value: 'product_manager', label: 'Product Manager' },
          { value: 'student', label: 'Student' },
          { value: 'other', label: 'Other' },
        ],
        helpText: 'This helps us understand your perspective',
      },
      {
        key: 'experience',
        label: 'What is your experience level with building products?',
        type: 'select',
        required: false,
        options: [
          { value: 'first_time', label: 'First time' },
          { value: 'some_experience', label: 'Some experience (1-2 projects)' },
          { value: 'experienced', label: 'Experienced (3+ projects)' },
          { value: 'expert', label: 'Expert (10+ projects)' },
        ],
      },
    ],
  },

  // Step 2: Goal & Context
  {
    step: 2,
    title: 'Goal & Context',
    description: 'What are you trying to achieve?',
    fields: [
      {
        key: 'goal',
        label: 'What is your primary goal for this project?',
        type: 'textarea',
        placeholder: 'e.g., Build a SaaS product to solve X problem, Launch a marketplace for Y, etc.',
        required: false,
        validation: {
          minLength: 20,
          maxLength: 500,
        },
        helpText: 'Be specific about what you want to accomplish',
      },
      {
        key: 'timeline',
        label: 'What is your target timeline?',
        type: 'select',
        required: false,
        options: [
          { value: '1_month', label: '1 month' },
          { value: '3_months', label: '3 months' },
          { value: '6_months', label: '6 months' },
          { value: '1_year', label: '1 year' },
          { value: 'flexible', label: 'Flexible' },
        ],
        allowDontKnow: true,
      },
    ],
  },

  // Step 3: Business/Product Type
  {
    step: 3,
    title: 'Business/Product Type',
    description: 'What type of product are you building?',
    fields: [
      {
        key: 'businessType',
        label: 'What type of business model are you pursuing?',
        type: 'select',
        required: true,
        options: [
          { value: 'saas', label: 'SaaS (Software as a Service)' },
          { value: 'marketplace', label: 'Marketplace' },
          { value: 'ecommerce', label: 'E-commerce' },
          { value: 'content', label: 'Content/Media' },
          { value: 'community', label: 'Community Platform' },
          { value: 'tool', label: 'Tool/Utility' },
          { value: 'other', label: 'Other' },
        ],
        helpText: 'This helps us recommend the right template',
      },
      {
        key: 'industry',
        label: 'What industry or vertical are you targeting?',
        type: 'text',
        placeholder: 'e.g., Healthcare, Education, Finance, etc.',
        required: false,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
        allowDontKnow: true,
      },
    ],
  },

  // Step 4: Target Audience Definition
  {
    step: 4,
    title: 'Target Audience',
    description: 'Who are you building this for?',
    fields: [
      {
        key: 'targetAudience',
        label: 'Describe your target audience in detail',
        type: 'textarea',
        placeholder: 'e.g., Small business owners aged 30-50 who struggle with inventory management, have 5-20 employees, and use Excel for tracking',
        required: true,
        validation: {
          minLength: 50,
          maxLength: 1000,
        },
        helpText: 'Be specific: demographics, psychographics, behaviors, pain points',
      },
      {
        key: 'audienceSize',
        label: 'Estimated market size',
        type: 'select',
        required: false,
        options: [
          { value: 'niche', label: 'Niche (< 10K potential users)' },
          { value: 'small', label: 'Small (10K - 100K)' },
          { value: 'medium', label: 'Medium (100K - 1M)' },
          { value: 'large', label: 'Large (1M - 10M)' },
          { value: 'mass', label: 'Mass market (10M+)' },
        ],
        allowDontKnow: true,
      },
    ],
  },

  // Step 5: Problem Statement
  {
    step: 5,
    title: 'Problem Statement',
    description: 'What problem are you solving?',
    fields: [
      {
        key: 'problemStatement',
        label: 'Describe the problem you are solving',
        type: 'textarea',
        placeholder: 'e.g., Small business owners waste 10+ hours per week manually tracking inventory in Excel, leading to stockouts and lost revenue',
        required: true,
        validation: {
          minLength: 50,
          maxLength: 1000,
        },
        helpText: 'Be specific and quantify the pain if possible',
      },
      {
        key: 'currentSolution',
        label: 'How do people solve this problem today?',
        type: 'textarea',
        placeholder: 'e.g., They use Excel spreadsheets, hire extra staff, or just accept the inefficiency',
        required: false,
        validation: {
          maxLength: 500,
        },
        allowDontKnow: true,
      },
    ],
  },

  // Step 6: Value Proposition
  {
    step: 6,
    title: 'Value Proposition',
    description: 'How does your solution solve the problem?',
    fields: [
      {
        key: 'valueProposition',
        label: 'Describe your solution and its key benefits',
        type: 'textarea',
        placeholder: 'e.g., An automated inventory management system that syncs with POS, predicts stockouts, and sends alerts - saving 10+ hours/week',
        required: true,
        validation: {
          minLength: 50,
          maxLength: 1000,
        },
        helpText: 'Focus on concrete benefits, not just features',
      },
      {
        key: 'keyFeatures',
        label: 'List 3-5 key features (one per line)',
        type: 'textarea',
        placeholder: 'Real-time inventory tracking\nAutomated reorder alerts\nPOS integration\nSales forecasting',
        required: false,
        validation: {
          maxLength: 500,
        },
      },
    ],
  },

  // Step 7: Monetization Model
  {
    step: 7,
    title: 'Monetization',
    description: 'How will you make money?',
    fields: [
      {
        key: 'monetizationModel',
        label: 'What is your monetization model?',
        type: 'select',
        required: true,
        options: [
          { value: 'subscription', label: 'Subscription (monthly/annual)' },
          { value: 'freemium', label: 'Freemium (free + paid tiers)' },
          { value: 'one_time', label: 'One-time purchase' },
          { value: 'transaction_fee', label: 'Transaction fee / Commission' },
          { value: 'advertising', label: 'Advertising' },
          { value: 'usage_based', label: 'Usage-based pricing' },
          { value: 'hybrid', label: 'Hybrid (multiple models)' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        key: 'pricing',
        label: 'What is your expected pricing?',
        type: 'text',
        placeholder: 'e.g., $29/month, $99/year, 5% transaction fee, etc.',
        required: false,
        validation: {
          maxLength: 200,
        },
        allowDontKnow: true,
      },
    ],
  },

  // Step 8: Differentiation
  {
    step: 8,
    title: 'Differentiation',
    description: 'What makes you different?',
    fields: [
      {
        key: 'differentiation',
        label: 'What makes your solution different from existing alternatives?',
        type: 'textarea',
        placeholder: 'e.g., Unlike generic inventory software, we focus specifically on small retail businesses and integrate with their existing POS systems',
        required: false,
        validation: {
          minLength: 30,
          maxLength: 1000,
        },
        helpText: 'Be specific about your unique angle or wedge',
        allowDontKnow: true,
      },
      {
        key: 'competition',
        label: 'Who are your main competitors?',
        type: 'text',
        placeholder: 'e.g., QuickBooks, Shopify Inventory, Excel',
        required: false,
        validation: {
          maxLength: 200,
        },
        allowDontKnow: true,
      },
    ],
  },

  // Step 9: Operations/Delivery Model
  {
    step: 9,
    title: 'Operations & Delivery',
    description: 'How will you deliver and operate this product?',
    fields: [
      {
        key: 'deliveryModel',
        label: 'How will users access your product?',
        type: 'select',
        required: false,
        options: [
          { value: 'web_app', label: 'Web application' },
          { value: 'mobile_app', label: 'Mobile app' },
          { value: 'desktop_app', label: 'Desktop application' },
          { value: 'api', label: 'API / Integration' },
          { value: 'multi_platform', label: 'Multi-platform' },
        ],
      },
      {
        key: 'operationsModel',
        label: 'Describe your operations model',
        type: 'textarea',
        placeholder: 'e.g., Fully automated SaaS, requires manual onboarding, includes customer support, etc.',
        required: false,
        validation: {
          maxLength: 500,
        },
        helpText: 'How much manual work is involved in running this?',
        allowDontKnow: true,
      },
    ],
  },

  // Step 10: Risks/Constraints/Resources
  {
    step: 10,
    title: 'Risks & Resources',
    description: 'What challenges and resources do you have?',
    fields: [
      {
        key: 'mainRisks',
        label: 'What are the main risks or challenges you foresee?',
        type: 'textarea',
        placeholder: 'e.g., Competing with established players, technical complexity, regulatory requirements, etc.',
        required: false,
        validation: {
          maxLength: 500,
        },
        allowDontKnow: true,
      },
      {
        key: 'resources',
        label: 'What resources do you have available?',
        type: 'textarea',
        placeholder: 'e.g., Technical skills, budget, time, team members, domain expertise, etc.',
        required: false,
        validation: {
          maxLength: 500,
        },
        helpText: 'This helps us assess feasibility',
        allowDontKnow: true,
      },
    ],
  },
];

// Mandatory fields that must be filled to transition to STRUCTURED state
export const MANDATORY_FIELDS = [
  'targetAudience',
  'problemStatement',
  'valueProposition',
  'monetizationModel',
  'businessType',
];

export interface WizardAnswerData {
  step: number;
  key: string;
  value: string | null;
  completed: boolean;
}

export interface WizardCompletionStatus {
  totalSteps: number;
  completedSteps: number;
  mandatoryFieldsFilled: boolean;
  canTransitionToStructured: boolean;
  missingMandatoryFields: string[];
}
