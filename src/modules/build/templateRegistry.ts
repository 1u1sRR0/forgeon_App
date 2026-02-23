// Template registry with all available templates

import { TemplateConfig, TemplateType } from './types';

export const TEMPLATE_REGISTRY: Record<TemplateType, TemplateConfig> = {
  SAAS_BASIC: {
    type: 'SAAS_BASIC',
    name: 'SaaS Basic',
    description: 'Basic SaaS template with authentication, dashboard, and core entity CRUD operations',
    requiredArtifacts: ['PRODUCT_REQUIREMENTS', 'TECHNICAL_ARCHITECTURE'],
    defaultParameters: {
      entityName: 'Item',
      brandingColors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
    features: [
      'NextAuth authentication',
      'User dashboard',
      'Core entity CRUD',
      'Prisma + PostgreSQL',
      'TailwindCSS styling',
      'API routes',
    ],
  },
  
  MARKETPLACE_MINI: {
    type: 'MARKETPLACE_MINI',
    name: 'Marketplace Mini',
    description: 'Two-sided marketplace with listings, search, and basic transactions',
    requiredArtifacts: ['PRODUCT_REQUIREMENTS', 'TECHNICAL_ARCHITECTURE', 'USER_STORIES'],
    defaultParameters: {
      entityName: 'Listing',
      brandingColors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
      },
    },
    features: [
      'Seller and buyer roles',
      'Listing management',
      'Search and filters',
      'Basic messaging',
      'Transaction tracking',
      'Rating system',
    ],
  },
  
  ECOMMERCE_MINI: {
    type: 'ECOMMERCE_MINI',
    name: 'E-commerce Mini',
    description: 'E-commerce store with product catalog, cart, and checkout',
    requiredArtifacts: ['PRODUCT_REQUIREMENTS', 'TECHNICAL_ARCHITECTURE'],
    defaultParameters: {
      entityName: 'Product',
      brandingColors: {
        primary: '#F59E0B',
        secondary: '#EF4444',
      },
    },
    features: [
      'Product catalog',
      'Shopping cart',
      'Checkout flow',
      'Order management',
      'Inventory tracking',
      'Payment integration ready',
    ],
  },
  
  LANDING_BLOG: {
    type: 'LANDING_BLOG',
    name: 'Landing + Blog',
    description: 'Marketing landing page with blog and content management',
    requiredArtifacts: ['PRODUCT_REQUIREMENTS', 'GO_TO_MARKET'],
    defaultParameters: {
      entityName: 'Post',
      brandingColors: {
        primary: '#06B6D4',
        secondary: '#8B5CF6',
      },
    },
    features: [
      'Landing page',
      'Blog with CMS',
      'SEO optimization',
      'Contact forms',
      'Newsletter signup',
      'Analytics ready',
    ],
  },
};

export function getTemplate(type: TemplateType): TemplateConfig {
  return TEMPLATE_REGISTRY[type];
}

export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplateByBusinessType(businessType: string): TemplateType {
  const type = businessType.toLowerCase();
  
  if (type === 'marketplace') return 'MARKETPLACE_MINI';
  if (type === 'ecommerce' || type === 'e-commerce') return 'ECOMMERCE_MINI';
  if (type === 'content' || type === 'community') return 'LANDING_BLOG';
  
  return 'SAAS_BASIC'; // Default
}
