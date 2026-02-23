import { Agent, AgentEvaluation, WizardInputs, Finding } from '../types';

export class TechnicalAgent implements Agent {
  name = 'Technical';

  evaluate(inputs: WizardInputs): AgentEvaluation {
    const findings: Finding[] = [];
    const risks: any[] = [];
    const reasoning: string[] = [];
    let subscore = 0;

    subscore += this.evaluateFeasibility(inputs, findings, reasoning);
    subscore += this.evaluateMVPReachability(inputs, findings, reasoning);
    subscore += this.evaluateRoadmap(inputs, findings, reasoning);

    return { subscore, findings, risks, reasoning };
  }

  private evaluateFeasibility(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const solution = inputs.valueProposition?.toLowerCase() || '';
    const features = inputs.keyFeatures?.toLowerCase() || '';

    // Check for complex technical requirements
    const complexIndicators = ['blockchain', 'ai model', 'machine learning model', 'real-time video', 'vr', 'ar'];
    const hasComplexTech = complexIndicators.some(term => solution.includes(term) || features.includes(term));

    if (hasComplexTech) {
      findings.push({
        severity: 'WARNING',
        code: 'COMPLEX_TECHNOLOGY',
        message: 'Solution requires advanced technology. Ensure technical feasibility.',
        relatedFields: ['valueProposition', 'keyFeatures'],
        penaltyPoints: 3,
        blocksBuild: false,
      });
      reasoning.push('Technical complexity is high');
      return 6;
    }

    reasoning.push('Technical feasibility is good');
    return 10;
  }

  private evaluateMVPReachability(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const features = inputs.keyFeatures || '';
    const featureCount = features.split('\n').filter(f => f.trim()).length;

    if (featureCount > 10) {
      findings.push({
        severity: 'WARNING',
        code: 'MVP_SCOPE_TOO_LARGE',
        message: 'MVP scope appears too large. Focus on 3-5 core features.',
        relatedFields: ['keyFeatures'],
        penaltyPoints: 4,
        blocksBuild: false,
      });
      reasoning.push('MVP scope is ambitious');
      return 4;
    }

    if (featureCount === 0) {
      reasoning.push('MVP scope unclear');
      return 5;
    }

    reasoning.push('MVP scope is achievable');
    return 8;
  }

  private evaluateRoadmap(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const timeline = inputs.timeline || '';
    const goal = inputs.goal || '';

    if (!timeline || timeline === "i don't know") {
      findings.push({
        severity: 'INFO',
        code: 'NO_TIMELINE',
        message: 'No timeline defined. Set realistic milestones.',
        relatedFields: ['timeline'],
        penaltyPoints: 1,
        blocksBuild: false,
      });
      reasoning.push('Roadmap not defined');
      return 4;
    }

    reasoning.push('Timeline defined');
    return 7;
  }
}
