import { BusinessIntelligenceDossier, WizardSeed } from '../opportunityTypes';

/**
 * Generate wizard seed from opportunity dossier
 * Maps opportunity fields to wizard pre-filled fields
 */
export function generateWizardSeed(
  opportunity: BusinessIntelligenceDossier
): WizardSeed {
  return {
    sourceType: 'opportunity',
    sourceId: opportunity.id,
    timestamp: new Date(),
    prefilledFields: {
      title: opportunity.title,
      description: opportunity.hook,
      targetAudience: opportunity.buyerPersona,
      problemStatement: `Pain level: ${opportunity.painLevel}/10. ${opportunity.mvpScope}`,
      proposedSolution: opportunity.differentiationAngles.join('. '),
      monetizationModel: opportunity.monetizationType,
      techStack: opportunity.recommendedStack,
    },
  };
}
