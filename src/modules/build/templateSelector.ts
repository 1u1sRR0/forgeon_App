// Template selection logic with conflict detection

import { TemplateType } from './types';
import { getTemplate, TEMPLATE_REGISTRY } from './templateRegistry';

export interface TemplateSelectionResult {
  recommendedTemplate: TemplateType;
  confidence: number; // 0-1
  reasoning: string;
  alternatives: Array<{
    template: TemplateType;
    score: number;
    reason: string;
  }>;
}

export interface ProjectContext {
  businessType?: string;
  monetizationModel?: string;
  keyFeatures?: string[];
  targetAudience?: string;
  deliveryModel?: string;
}

export class TemplateSelector {
  /**
   * Select best template based on project context
   * Deterministic: same inputs = same output
   */
  selectTemplate(context: ProjectContext): TemplateSelectionResult {
    const scores: Record<TemplateType, number> = {
      SAAS_BASIC: 0,
      MARKETPLACE_MINI: 0,
      ECOMMERCE_MINI: 0,
      LANDING_BLOG: 0,
    };

    const reasons: Record<TemplateType, string[]> = {
      SAAS_BASIC: [],
      MARKETPLACE_MINI: [],
      ECOMMERCE_MINI: [],
      LANDING_BLOG: [],
    };

    // Score based on business type
    if (context.businessType) {
      const type = context.businessType.toLowerCase();
      
      if (type.includes('marketplace') || type.includes('platform')) {
        scores.MARKETPLACE_MINI += 40;
        reasons.MARKETPLACE_MINI.push('Business type is marketplace/platform');
      }
      
      if (type.includes('ecommerce') || type.includes('e-commerce') || type.includes('store')) {
        scores.ECOMMERCE_MINI += 40;
        reasons.ECOMMERCE_MINI.push('Business type is e-commerce');
      }
      
      if (type.includes('content') || type.includes('blog') || type.includes('media')) {
        scores.LANDING_BLOG += 40;
        reasons.LANDING_BLOG.push('Business type is content-focused');
      }
      
      if (type.includes('saas') || type.includes('software') || type.includes('service')) {
        scores.SAAS_BASIC += 40;
        reasons.SAAS_BASIC.push('Business type is SaaS');
      }
    }

    // Score based on monetization model
    if (context.monetizationModel) {
      const model = context.monetizationModel.toLowerCase();
      
      if (model.includes('subscription') || model.includes('recurring')) {
        scores.SAAS_BASIC += 20;
        reasons.SAAS_BASIC.push('Subscription-based monetization');
      }
      
      if (model.includes('commission') || model.includes('transaction fee')) {
        scores.MARKETPLACE_MINI += 30;
        reasons.MARKETPLACE_MINI.push('Commission-based monetization');
      }
      
      if (model.includes('product sales') || model.includes('direct sales')) {
        scores.ECOMMERCE_MINI += 30;
        reasons.ECOMMERCE_MINI.push('Product sales monetization');
      }
      
      if (model.includes('advertising') || model.includes('sponsorship')) {
        scores.LANDING_BLOG += 25;
        reasons.LANDING_BLOG.push('Ad-based monetization');
      }
    }

    // Score based on key features
    if (context.keyFeatures && context.keyFeatures.length > 0) {
      const featuresText = context.keyFeatures.join(' ').toLowerCase();
      
      if (featuresText.includes('listing') || featuresText.includes('seller') || featuresText.includes('buyer')) {
        scores.MARKETPLACE_MINI += 15;
        reasons.MARKETPLACE_MINI.push('Features mention listings/sellers/buyers');
      }
      
      if (featuresText.includes('cart') || featuresText.includes('checkout') || featuresText.includes('inventory')) {
        scores.ECOMMERCE_MINI += 15;
        reasons.ECOMMERCE_MINI.push('Features mention cart/checkout/inventory');
      }
      
      if (featuresText.includes('blog') || featuresText.includes('article') || featuresText.includes('content')) {
        scores.LANDING_BLOG += 15;
        reasons.LANDING_BLOG.push('Features mention blog/articles/content');
      }
      
      if (featuresText.includes('dashboard') || featuresText.includes('user management') || featuresText.includes('api')) {
        scores.SAAS_BASIC += 10;
        reasons.SAAS_BASIC.push('Features mention dashboard/user management/API');
      }
    }

    // Score based on delivery model
    if (context.deliveryModel) {
      const delivery = context.deliveryModel.toLowerCase();
      
      if (delivery.includes('two-sided') || delivery.includes('multi-sided')) {
        scores.MARKETPLACE_MINI += 20;
        reasons.MARKETPLACE_MINI.push('Two-sided delivery model');
      }
      
      if (delivery.includes('direct') || delivery.includes('b2c')) {
        scores.ECOMMERCE_MINI += 10;
        reasons.ECOMMERCE_MINI.push('Direct B2C delivery');
      }
    }

    // Find best template
    const sortedTemplates = (Object.keys(scores) as TemplateType[])
      .map((template) => ({
        template,
        score: scores[template],
        reason: reasons[template].join('; ') || 'Default match',
      }))
      .sort((a, b) => b.score - a.score);

    const best = sortedTemplates[0];
    const alternatives = sortedTemplates.slice(1);

    // Calculate confidence (0-1)
    const maxPossibleScore = 100;
    const confidence = Math.min(best.score / maxPossibleScore, 1);

    // If no clear winner, default to SAAS_BASIC
    const recommendedTemplate = best.score > 0 ? best.template : 'SAAS_BASIC';
    const finalConfidence = best.score > 0 ? confidence : 0.5;
    const reasoning = best.score > 0 
      ? best.reason 
      : 'No strong indicators found, using default SaaS template';

    return {
      recommendedTemplate,
      confidence: finalConfidence,
      reasoning,
      alternatives,
    };
  }

  /**
   * Detect conflicts between template and project requirements
   */
  detectConflicts(
    templateType: TemplateType,
    context: ProjectContext
  ): string[] {
    const conflicts: string[] = [];
    const template = getTemplate(templateType);

    // Check if business type conflicts with template
    if (context.businessType) {
      const type = context.businessType.toLowerCase();
      
      if (templateType === 'MARKETPLACE_MINI' && !type.includes('marketplace') && !type.includes('platform')) {
        conflicts.push('Marketplace template selected but business type is not marketplace/platform');
      }
      
      if (templateType === 'ECOMMERCE_MINI' && !type.includes('ecommerce') && !type.includes('store')) {
        conflicts.push('E-commerce template selected but business type is not e-commerce');
      }
    }

    // Check if monetization conflicts with template
    if (context.monetizationModel) {
      const model = context.monetizationModel.toLowerCase();
      
      if (templateType === 'MARKETPLACE_MINI' && !model.includes('commission') && !model.includes('transaction')) {
        conflicts.push('Marketplace template typically requires commission-based monetization');
      }
      
      if (templateType === 'ECOMMERCE_MINI' && !model.includes('sales') && !model.includes('product')) {
        conflicts.push('E-commerce template typically requires product sales monetization');
      }
    }

    return conflicts;
  }
}

export const templateSelector = new TemplateSelector();
