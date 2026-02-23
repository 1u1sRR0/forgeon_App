import { Agent, AgentEvaluation, WizardInputs, Finding } from '../types';

export class FinancialAgent implements Agent {
  name = 'Financial';

  evaluate(inputs: WizardInputs): AgentEvaluation {
    const findings: Finding[] = [];
    const risks: any[] = [];
    const reasoning: string[] = [];
    let subscore = 0;

    subscore += this.evaluateMonetization(inputs, findings, reasoning);
    subscore += this.evaluateCostRealism(inputs, findings, reasoning);
    subscore += this.evaluateSustainability(inputs, findings, reasoning);

    return { subscore, findings, risks, reasoning };
  }

  private evaluateMonetization(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const model = inputs.monetizationModel || '';
    const pricing = inputs.pricing || '';

    if (!model) {
      findings.push({
        severity: 'CRITICAL',
        code: 'NO_MONETIZATION',
        message: 'No monetization model defined.',
        relatedFields: ['monetizationModel'],
        penaltyPoints: 10,
        blocksBuild: true,
      });
      return 0;
    }

    if (!pricing || pricing === "i don't know") {
      findings.push({
        severity: 'WARNING',
        code: 'PRICING_UNDEFINED',
        message: 'Pricing not defined. Estimate expected pricing.',
        relatedFields: ['pricing'],
        penaltyPoints: 3,
        blocksBuild: false,
      });
      reasoning.push('Monetization model defined but pricing unclear');
      return 6;
    }

    reasoning.push('Clear monetization model with pricing');
    return 10;
  }

  private evaluateCostRealism(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const resources = inputs.resources?.toLowerCase() || '';
    const operations = inputs.operationsModel?.toLowerCase() || '';

    const hasCostAwareness = resources.includes('budget') || resources.includes('cost') || 
                             operations.includes('cost') || operations.includes('expense');

    if (!hasCostAwareness) {
      findings.push({
        severity: 'INFO',
        code: 'COSTS_NOT_CONSIDERED',
        message: 'Operating costs not mentioned. Consider cost structure.',
        relatedFields: ['resources', 'operationsModel'],
        penaltyPoints: 2,
        blocksBuild: false,
      });
      reasoning.push('Cost awareness low');
      return 4;
    }

    reasoning.push('Cost awareness present');
    return 8;
  }

  private evaluateSustainability(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const model = inputs.monetizationModel?.toLowerCase() || '';
    const audience = inputs.audienceSize || '';

    // Check for sustainability red flags
    if (model === 'advertising' && audience === 'niche') {
      findings.push({
        severity: 'WARNING',
        code: 'AD_MODEL_SMALL_AUDIENCE',
        message: 'Advertising model with small audience may not be sustainable.',
        relatedFields: ['monetizationModel', 'audienceSize'],
        penaltyPoints: 5,
        blocksBuild: false,
      });
      reasoning.push('Sustainability concerns with business model');
      return 3;
    }

    reasoning.push('Business model appears sustainable');
    return 7;
  }
}
