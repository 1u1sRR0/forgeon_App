// ============================================================================
// GENERIC TEMPLATES
// ============================================================================

import { ContentBlock, ProjectContext } from '../courseTypes';

export const genericTemplates = {
  business_model: {
    introduction: `Understanding your business model is crucial for success.`,
    sections: [
      {
        title: 'Business Model Basics',
        content: `Every successful business has a clear model for creating and capturing value.`,
      },
    ],
    summary: `A solid business model is the foundation of your venture.`,
  },
  value_proposition: {
    introduction: `Your value proposition defines why customers choose you.`,
    sections: [
      {
        title: 'Defining Value',
        content: `Value comes from solving real problems in unique ways.`,
      },
    ],
    summary: `A clear value proposition drives all business decisions.`,
  },
  tech_stack: {
    introduction: `Your technology stack determines how you build your product.`,
    sections: [
      {
        title: 'Technology Choices',
        content: `Choose technologies that balance speed and reliability.`,
      },
    ],
    summary: `The right tech stack enables rapid development.`,
  },
  deployment: {
    introduction: `Deployment makes your product accessible to users.`,
    sections: [
      {
        title: 'Deployment Strategy',
        content: `Modern deployment practices enable continuous delivery.`,
      },
    ],
    summary: `Reliable deployment is essential for user satisfaction.`,
  },
  mvp_validation: {
    introduction: `Validate your MVP with real users.`,
    sections: [
      {
        title: 'Validation Methods',
        content: `Use data and feedback to validate your assumptions.`,
      },
    ],
    summary: `Validation reduces risk and guides development.`,
  },
  scaling_strategy: {
    introduction: `Scaling requires careful planning.`,
    sections: [
      {
        title: 'Growth Planning',
        content: `Scale what works and fix what doesn't.`,
      },
    ],
    summary: `Sustainable scaling builds long-term success.`,
  },
  target_market: {
    introduction: `Understanding your target market is essential.`,
    sections: [
      {
        title: 'Market Analysis',
        content: `Know who your customers are and what they need.`,
      },
    ],
    summary: `Target market clarity drives product decisions.`,
  },
  competitive_analysis: {
    introduction: `Analyze your competition to find your edge.`,
    sections: [
      {
        title: 'Competitive Landscape',
        content: `Understand what competitors offer and how you differ.`,
      },
    ],
    summary: `Competitive analysis reveals opportunities.`,
  },
  architecture: {
    introduction: `System architecture defines how components work together.`,
    sections: [
      {
        title: 'Architecture Patterns',
        content: `Choose patterns that support your requirements.`,
      },
    ],
    summary: `Good architecture enables scalability.`,
  },
  database: {
    introduction: `Database design impacts performance and scalability.`,
    sections: [
      {
        title: 'Data Modeling',
        content: `Model your data to support your use cases.`,
      },
    ],
    summary: `Solid data models prevent future problems.`,
  },
  authentication: {
    introduction: `Authentication secures your application.`,
    sections: [
      {
        title: 'Auth Strategies',
        content: `Implement secure authentication for your users.`,
      },
    ],
    summary: `Security is non-negotiable.`,
  },
  api_design: {
    introduction: `API design affects developer experience.`,
    sections: [
      {
        title: 'API Best Practices',
        content: `Design APIs that are intuitive and consistent.`,
      },
    ],
    summary: `Good APIs make integration easy.`,
  },
  local_setup: {
    introduction: `Set up your development environment.`,
    sections: [
      {
        title: 'Development Setup',
        content: `Configure your local environment for productivity.`,
      },
    ],
    summary: `A good setup accelerates development.`,
  },
  environment_config: {
    introduction: `Environment configuration manages settings.`,
    sections: [
      {
        title: 'Config Management',
        content: `Separate configuration from code.`,
      },
    ],
    summary: `Proper config enables multiple environments.`,
  },
  monitoring: {
    introduction: `Monitoring helps you understand system health.`,
    sections: [
      {
        title: 'Monitoring Strategy',
        content: `Track metrics that matter for your application.`,
      },
    ],
    summary: `You can't improve what you don't measure.`,
  },
  ci_cd: {
    introduction: `CI/CD automates your deployment pipeline.`,
    sections: [
      {
        title: 'Automation Benefits',
        content: `Automate testing and deployment for reliability.`,
      },
    ],
    summary: `Automation reduces errors and speeds delivery.`,
  },
  business_registration: {
    introduction: `Register your business legally.`,
    sections: [
      {
        title: 'Legal Structure',
        content: `Choose the right business structure for your needs.`,
      },
    ],
    summary: `Proper registration protects you legally.`,
  },
  terms_of_service: {
    introduction: `Terms of service define user agreements.`,
    sections: [
      {
        title: 'TOS Essentials',
        content: `Create clear terms that protect both parties.`,
      },
    ],
    summary: `Clear terms prevent disputes.`,
  },
  privacy_policy: {
    introduction: `Privacy policies explain data handling.`,
    sections: [
      {
        title: 'Privacy Requirements',
        content: `Be transparent about how you use data.`,
      },
    ],
    summary: `Privacy builds trust with users.`,
  },
  gdpr: {
    introduction: `GDPR regulates data protection in the EU.`,
    sections: [
      {
        title: 'GDPR Compliance',
        content: `Understand your obligations under GDPR.`,
      },
    ],
    summary: `Compliance is mandatory for EU users.`,
  },
  payment_compliance: {
    introduction: `Payment compliance ensures secure transactions.`,
    sections: [
      {
        title: 'Payment Standards',
        content: `Follow PCI DSS and other payment standards.`,
      },
    ],
    summary: `Compliance protects you and your users.`,
  },
  user_acquisition: {
    introduction: `Acquire users through effective channels.`,
    sections: [
      {
        title: 'Acquisition Strategies',
        content: `Find channels that work for your audience.`,
      },
    ],
    summary: `Focus on channels with best ROI.`,
  },
  metrics: {
    introduction: `Metrics guide your business decisions.`,
    sections: [
      {
        title: 'Key Metrics',
        content: `Track metrics that indicate business health.`,
      },
    ],
    summary: `Data-driven decisions reduce risk.`,
  },
  feedback_loops: {
    introduction: `Feedback loops enable continuous improvement.`,
    sections: [
      {
        title: 'Gathering Feedback',
        content: `Create systems to collect and act on feedback.`,
      },
    ],
    summary: `Feedback drives product evolution.`,
  },
  analytics: {
    introduction: `Analytics reveal user behavior patterns.`,
    sections: [
      {
        title: 'Analytics Setup',
        content: `Implement analytics to understand usage.`,
      },
    ],
    summary: `Analytics inform product decisions.`,
  },
  marketing: {
    introduction: `Marketing communicates your value.`,
    sections: [
      {
        title: 'Marketing Fundamentals',
        content: `Reach your audience with clear messaging.`,
      },
    ],
    summary: `Effective marketing drives growth.`,
  },
  customer_support: {
    introduction: `Support builds customer loyalty.`,
    sections: [
      {
        title: 'Support Strategy',
        content: `Provide excellent support to retain customers.`,
      },
    ],
    summary: `Great support creates advocates.`,
  },
  iteration: {
    introduction: `Iteration improves your product over time.`,
    sections: [
      {
        title: 'Iterative Development',
        content: `Release, learn, and improve continuously.`,
      },
    ],
    summary: `Iteration is the path to excellence.`,
  },
  team_building: {
    introduction: `Build a team that executes your vision.`,
    sections: [
      {
        title: 'Team Growth',
        content: `Hire strategically as you scale.`,
      },
    ],
    summary: `Your team determines your success.`,
  },
};

export function selectTemplate(projectType: string): string {
  switch (projectType.toLowerCase()) {
    case 'saas':
      return 'saas';
    case 'marketplace':
      return 'marketplace';
    case 'ecommerce':
      return 'ecommerce';
    default:
      return 'generic';
  }
}

export function getTemplateContent(
  levelNumber: number,
  topicTitle: string,
  context: ProjectContext,
  template: string
): ContentBlock[] {
  const content: ContentBlock[] = [];

  // Add context-specific content based on level and topic
  if (topicTitle.includes('Problem')) {
    content.push({
      type: 'text',
      content: `## The Problem\n\n${context.problemStatement}\n\nThis is the core challenge that ${context.name} addresses.`,
    });

    content.push({
      type: 'callout',
      title: 'Why This Matters',
      content: `Understanding the problem deeply is crucial for building the right solution.`,
    });
  }

  if (topicTitle.includes('Solution')) {
    content.push({
      type: 'text',
      content: `## Your Solution\n\n${context.solution}\n\nThis is how ${context.name} solves the problem.`,
    });

    content.push({
      type: 'checklist',
      title: 'Solution Checklist',
      items: [
        'Clearly addresses the core problem',
        'Provides measurable value',
        'Is technically feasible',
        'Differentiates from competitors',
      ],
    });
  }

  if (topicTitle.includes('Target Audience') || topicTitle.includes('User')) {
    content.push({
      type: 'text',
      content: `## Your Target Audience\n\n${context.targetAudience}\n\nThese are the people who will benefit most from ${context.name}.`,
    });
  }

  if (topicTitle.includes('Technical') || topicTitle.includes('Architecture')) {
    content.push({
      type: 'text',
      content: `## Tech Stack\n\nYour project uses:\n\n${context.techStack.map((tech) => `- ${tech}`).join('\n')}`,
    });

    content.push({
      type: 'code',
      language: 'typescript',
      content: `// Example: Basic project structure\nconst project = {\n  name: "${context.name}",\n  type: "${context.projectType}",\n  techStack: ${JSON.stringify(context.techStack, null, 2)}\n};`,
    });
  }

  if (topicTitle.includes('MVP')) {
    content.push({
      type: 'text',
      content: `## MVP Approach\n\nFor ${context.name}, focus on these core features first:\n\n1. Essential functionality that solves the main problem\n2. Basic user interface\n3. Minimal but functional backend`,
    });

    content.push({
      type: 'warning',
      title: 'Avoid Feature Creep',
      content: 'Resist the temptation to add "nice-to-have" features in your MVP. Focus on core value.',
    });
  }

  // Add generic helpful content
  content.push({
    type: 'tip',
    title: 'Pro Tip',
    content: `Apply these concepts directly to ${context.name} as you progress through the course.`,
  });

  return content;
}
