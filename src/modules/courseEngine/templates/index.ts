import { saasTemplates } from './saasTemplates';
import { marketplaceTemplates } from './marketplaceTemplates';
import { ecommerceTemplates } from './ecommerceTemplates';
import { genericTemplates } from './genericTemplates';
import { ProjectContext } from '../courseTypes';

export function selectTemplate(context: ProjectContext): any {
  const businessType = context.businessType.toLowerCase();
  
  switch (businessType) {
    case 'saas':
    case 'software':
      return saasTemplates;
    case 'marketplace':
    case 'platform':
      return marketplaceTemplates;
    case 'ecommerce':
    case 'e-commerce':
    case 'store':
      return ecommerceTemplates;
    default:
      return genericTemplates;
  }
}

export function getTemplateContent(topic: string, businessType: string, template: any): any {
  // Try to get specific template content
  if (template[topic]) {
    return template[topic];
  }
  
  // Fallback to generic template
  const genericTemplatesWithIndex = genericTemplates as Record<string, any>;
  if (genericTemplatesWithIndex[topic]) {
    return genericTemplatesWithIndex[topic];
  }
  
  // Return default structure
  return {
    introduction: `Learn about ${topic.replace(/_/g, ' ')} for your ${businessType} business.`,
    sections: [
      {
        title: 'Overview',
        content: `This lesson covers the fundamentals of ${topic.replace(/_/g, ' ')}.`,
      },
    ],
    summary: `Understanding ${topic.replace(/_/g, ' ')} is essential for your project's success.`,
  };
}
