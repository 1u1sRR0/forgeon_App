import { Agent, AgentEvaluation, WizardInputs, Finding, Risk } from '../types';

export class MarketAgent implements Agent {
  name = 'Market';

  evaluate(inputs: WizardInputs): AgentEvaluation {
    const findings: Finding[] = [];
    const risks: Risk[] = [];
    const reasoning: string[] = [];
    let subscore = 0;

    // Evaluate audience clarity (0-7 points)
    const audienceScore = this.evaluateAudienceClarity(inputs, findings, reasoning);
    subscore += audienceScore;

    // Evaluate competition risk (0-6 points)
    const competitionScore = this.evaluateCompetition(inputs, findings, risks, reasoning);
    subscore += competitionScore;

    // Evaluate differentiation strength (0-7 points)
    const differentiationScore = this.evaluateDifferentiation(inputs, findings, reasoning);
    subscore += differentiationScore;

    // Evaluate demand plausibility (0-5 points)
    const demandScore = this.evaluateDemand(inputs, findings, reasoning);
    subscore += demandScore;

    return {
      subscore,
      findings,
      risks,
      reasoning,
    };
  }

  private evaluateAudienceClarity(
    inputs: WizardInputs,
    findings: Finding[],
    reasoning: string[]
  ): number {
    const audience = inputs.targetAudience?.toLowerCase() || '';

    // Check for vague audience definitions
    const vagueTerms = ['everyone', 'anyone', 'people', 'users', 'millennials', 'gen z'];
    const hasVagueTerms = vagueTerms.some((term) => audience.includes(term));

    if (audience.length < 50) {
      findings.push({
        severity: 'WARNING',
        code: 'AUDIENCE_TOO_VAGUE',
        message: 'Target audience description is too brief. Provide more specific demographics and psychographics.',
        relatedFields: ['targetAudience'],
        penaltyPoints: 3,
        blocksBuild: false,
      });
      reasoning.push('Audience definition lacks detail');
      return 2;
    }

    if (hasVagueTerms && audience.length < 100) {
      findings.push({
        severity: 'WARNING',
        code: 'AUDIENCE_TOO_BROAD',
        message: 'Target audience appears too broad. Consider narrowing to a specific segment.',
        relatedFields: ['targetAudience'],
        penaltyPoints: 2,
        blocksBuild: false,
      });
      reasoning.push('Audience definition is broad but has some specificity');
      return 3;
    }

    // Well-defined audience
    reasoning.push('Target audience is well-defined with specific characteristics');
    return 7;
  }

  private evaluateCompetition(
    inputs: WizardInputs,
    findings: Finding[],
    risks: Risk[],
    reasoning: string[]
  ): number {
    const competition = inputs.competition?.toLowerCase() || '';
    const differentiation = inputs.differentiation?.toLowerCase() || '';

    // No competition mentioned
    if (!competition || competition === "i don't know") {
      findings.push({
        severity: 'INFO',
        code: 'COMPETITION_UNKNOWN',
        message: 'Competition not identified. Research existing solutions in your space.',
        relatedFields: ['competition'],
        penaltyPoints: 1,
        blocksBuild: false,
      });
      reasoning.push('Competition landscape unclear');
      return 4;
    }

    // Check for saturated market indicators
    const saturatedIndicators = ['many', 'lots of', 'numerous', 'crowded', 'saturated'];
    const isSaturated = saturatedIndicators.some((term) => competition.includes(term));

    if (isSaturated && (!differentiation || differentiation.length < 30)) {
      findings.push({
        severity: 'CRITICAL',
        code: 'SATURATED_NO_DIFFERENTIATION',
        message: 'Market appears saturated with no clear differentiation. This is a major risk.',
        relatedFields: ['competition', 'differentiation'],
        penaltyPoints: 10,
        blocksBuild: true,
      });
      risks.push({
        category: 'MARKET',
        title: 'Saturated market without differentiation',
        description: 'Entering a crowded market without a clear competitive advantage',
        impact: 5,
        probability: 4,
        mitigation: 'Develop a unique value proposition or target a specific niche',
      });
      reasoning.push('High competition with weak differentiation');
      return 1;
    }

    if (isSaturated) {
      reasoning.push('Competitive market but with differentiation strategy');
      return 4;
    }

    // Moderate competition
    reasoning.push('Healthy competitive landscape');
    return 6;
  }

  private evaluateDifferentiation(
    inputs: WizardInputs,
    findings: Finding[],
    reasoning: string[]
  ): number {
    const differentiation = inputs.differentiation?.toLowerCase() || '';

    if (!differentiation || differentiation === "i don't know") {
      findings.push({
        severity: 'WARNING',
        code: 'NO_DIFFERENTIATION',
        message: 'No clear differentiation identified. Define what makes you unique.',
        relatedFields: ['differentiation'],
        penaltyPoints: 5,
        blocksBuild: false,
      });
      reasoning.push('Differentiation not defined');
      return 2;
    }

    // Check for generic differentiation claims
    const genericClaims = [
      'better ux',
      'better ui',
      'easier to use',
      'ai-powered',
      'machine learning',
      'faster',
      'cheaper',
    ];
    const hasGenericClaims = genericClaims.some((claim) => differentiation.includes(claim));

    if (hasGenericClaims && differentiation.length < 50) {
      findings.push({
        severity: 'WARNING',
        code: 'GENERIC_DIFFERENTIATION',
        message: 'Differentiation appears generic. Be more specific about your unique advantage.',
        relatedFields: ['differentiation'],
        penaltyPoints: 3,
        blocksBuild: false,
      });
      reasoning.push('Differentiation is generic');
      return 3;
    }

    // Strong differentiation
    reasoning.push('Clear and specific differentiation');
    return 7;
  }

  private evaluateDemand(
    inputs: WizardInputs,
    findings: Finding[],
    reasoning: string[]
  ): number {
    const problem = inputs.problemStatement?.toLowerCase() || '';
    const audience = inputs.targetAudience?.toLowerCase() || '';

    // Check for evidence of demand
    const demandIndicators = [
      'research',
      'survey',
      'interview',
      'waitlist',
      'pre-order',
      'beta',
      'pilot',
      'customer',
    ];
    const hasEvidence = demandIndicators.some(
      (term) => problem.includes(term) || audience.includes(term)
    );

    if (hasEvidence) {
      reasoning.push('Evidence of demand present');
      return 5;
    }

    // Logical demand based on problem
    if (problem.length > 100 && problem.includes('waste') || problem.includes('lose') || problem.includes('struggle')) {
      reasoning.push('Logical demand based on problem description');
      return 4;
    }

    // Speculative demand
    findings.push({
      severity: 'INFO',
      code: 'DEMAND_SPECULATIVE',
      message: 'Demand appears speculative. Consider validating with user research.',
      relatedFields: ['problemStatement', 'targetAudience'],
      penaltyPoints: 1,
      blocksBuild: false,
    });
    reasoning.push('Demand is speculative');
    return 2;
  }
}
