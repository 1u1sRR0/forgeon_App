import { Agent, AgentEvaluation, WizardInputs, Finding, Risk } from '../types';

export class DevilsAdvocateAgent implements Agent {
  name = "Devil's Advocate";

  evaluate(inputs: WizardInputs): AgentEvaluation {
    const findings: Finding[] = [];
    const risks: Risk[] = [];
    const reasoning: string[] = [];

    // Look for contradictions and critical issues
    this.checkContradictions(inputs, findings, risks, reasoning);

    return {
      subscore: 0, // Devil's Advocate doesn't contribute to score, only penalties
      findings,
      risks,
      reasoning,
    };
  }

  private checkContradictions(inputs: WizardInputs, findings: Finding[], risks: Risk[], reasoning: string[]): void {
    // Mass audience + niche value prop
    if (inputs.audienceSize === 'mass' && inputs.differentiation?.toLowerCase().includes('niche')) {
      findings.push({
        severity: 'CRITICAL',
        code: 'MASS_AUDIENCE_NICHE_PRODUCT',
        message: 'Contradiction: Mass market audience with niche product positioning.',
        relatedFields: ['audienceSize', 'differentiation'],
        penaltyPoints: 15,
        blocksBuild: true,
      });
      reasoning.push('Critical contradiction in market positioning');
    }

    // B2C monetization + B2B audience
    const audience = inputs.targetAudience?.toLowerCase() || '';
    const isB2B = audience.includes('business') || audience.includes('company') || audience.includes('enterprise');
    const isB2CModel = inputs.monetizationModel === 'advertising' || inputs.pricing?.includes('$9') || inputs.pricing?.includes('$19');

    if (isB2B && isB2CModel) {
      findings.push({
        severity: 'WARNING',
        code: 'B2B_B2C_MISMATCH',
        message: 'B2B audience with B2C pricing model may not align.',
        relatedFields: ['targetAudience', 'monetizationModel', 'pricing'],
        penaltyPoints: 7,
        blocksBuild: false,
      });
      reasoning.push('Potential mismatch in business model and audience');
    }

    // Saturated market + no differentiation
    const competition = inputs.competition?.toLowerCase() || '';
    const differentiation = inputs.differentiation || '';
    const isSaturated = competition.includes('many') || competition.includes('crowded') || competition.includes('saturated');

    if (isSaturated && (!differentiation || differentiation.length < 30)) {
      findings.push({
        severity: 'CRITICAL',
        code: 'SATURATED_NO_DIFF',
        message: 'Entering saturated market without clear differentiation.',
        relatedFields: ['competition', 'differentiation'],
        penaltyPoints: 20,
        blocksBuild: true,
      });
      risks.push({
        category: 'MARKET',
        title: 'High competition without differentiation',
        description: 'Competing in a saturated market without a unique value proposition',
        impact: 5,
        probability: 5,
        mitigation: 'Develop a strong differentiation strategy or pivot to a niche',
      });
      reasoning.push('Critical market risk identified');
    }

    // "AI tool" without specific use case
    const solution = inputs.valueProposition?.toLowerCase() || '';
    if ((solution.includes('ai') || solution.includes('artificial intelligence')) && solution.length < 100) {
      findings.push({
        severity: 'WARNING',
        code: 'VAGUE_AI_TOOL',
        message: '"AI-powered" is not a differentiation. Be specific about the use case.',
        relatedFields: ['valueProposition'],
        penaltyPoints: 5,
        blocksBuild: false,
      });
      reasoning.push('Generic AI positioning without specificity');
    }

    // Marketplace without supply strategy
    if (inputs.businessType === 'marketplace') {
      const operations = inputs.operationsModel?.toLowerCase() || '';
      const hasSupplyStrategy = operations.includes('supplier') || operations.includes('vendor') || operations.includes('seller');

      if (!hasSupplyStrategy) {
        findings.push({
          severity: 'CRITICAL',
          code: 'MARKETPLACE_NO_SUPPLY',
          message: 'Marketplace without supply-side strategy. How will you attract suppliers?',
          relatedFields: ['businessType', 'operationsModel'],
          penaltyPoints: 12,
          blocksBuild: true,
        });
        risks.push({
          category: 'EXECUTION',
          title: 'Marketplace chicken-and-egg problem',
          description: 'Need both supply and demand to launch successfully',
          impact: 5,
          probability: 4,
          mitigation: 'Develop a supply-side acquisition strategy before launch',
        });
        reasoning.push('Critical marketplace execution risk');
      }
    }
  }
}
