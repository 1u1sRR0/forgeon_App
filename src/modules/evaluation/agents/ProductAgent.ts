import { Agent, AgentEvaluation, WizardInputs, Finding } from '../types';

export class ProductAgent implements Agent {
  name = 'Product';

  evaluate(inputs: WizardInputs): AgentEvaluation {
    const findings: Finding[] = [];
    const risks: any[] = [];
    const reasoning: string[] = [];
    let subscore = 0;

    // Problem clarity (0-8 points)
    subscore += this.evaluateProblemClarity(inputs, findings, reasoning);

    // Solution clarity (0-8 points)
    subscore += this.evaluateSolutionClarity(inputs, findings, reasoning);

    // Internal coherence (0-9 points)
    subscore += this.evaluateCoherence(inputs, findings, reasoning);

    return { subscore, findings, risks, reasoning };
  }

  private evaluateProblemClarity(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const problem = inputs.problemStatement || '';

    if (problem.length < 50) {
      findings.push({
        severity: 'CRITICAL',
        code: 'PROBLEM_TOO_VAGUE',
        message: 'Problem statement is too vague. Be specific about the pain point.',
        relatedFields: ['problemStatement'],
        penaltyPoints: 8,
        blocksBuild: true,
      });
      reasoning.push('Problem not clearly defined');
      return 0;
    }

    if (problem.length < 100) {
      findings.push({
        severity: 'WARNING',
        code: 'PROBLEM_LACKS_DETAIL',
        message: 'Problem statement could be more detailed.',
        relatedFields: ['problemStatement'],
        penaltyPoints: 3,
        blocksBuild: false,
      });
      reasoning.push('Problem defined but lacks detail');
      return 4;
    }

    reasoning.push('Problem is clearly and specifically defined');
    return 8;
  }

  private evaluateSolutionClarity(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const solution = inputs.valueProposition || '';
    const features = inputs.keyFeatures || '';

    if (solution.length < 50) {
      findings.push({
        severity: 'CRITICAL',
        code: 'SOLUTION_TOO_VAGUE',
        message: 'Solution is too vague. Describe concrete features and benefits.',
        relatedFields: ['valueProposition'],
        penaltyPoints: 8,
        blocksBuild: true,
      });
      reasoning.push('Solution not clearly defined');
      return 0;
    }

    if (!features || features.length < 20) {
      findings.push({
        severity: 'WARNING',
        code: 'FEATURES_MISSING',
        message: 'Key features not defined. List specific features.',
        relatedFields: ['keyFeatures'],
        penaltyPoints: 2,
        blocksBuild: false,
      });
      reasoning.push('Solution defined but features unclear');
      return 5;
    }

    reasoning.push('Solution is clear with defined features');
    return 8;
  }

  private evaluateCoherence(inputs: WizardInputs, findings: Finding[], reasoning: string[]): number {
    const problem = inputs.problemStatement?.toLowerCase() || '';
    const solution = inputs.valueProposition?.toLowerCase() || '';
    const audience = inputs.targetAudience?.toLowerCase() || '';

    // Check if solution addresses problem
    const problemKeywords = this.extractKeywords(problem);
    const solutionKeywords = this.extractKeywords(solution);
    const overlap = problemKeywords.filter(k => solutionKeywords.includes(k)).length;

    if (overlap === 0) {
      findings.push({
        severity: 'CRITICAL',
        code: 'SOLUTION_PROBLEM_MISMATCH',
        message: 'Solution does not clearly address the stated problem.',
        relatedFields: ['problemStatement', 'valueProposition'],
        penaltyPoints: 10,
        blocksBuild: true,
      });
      reasoning.push('Major incoherence between problem and solution');
      return 0;
    }

    if (overlap < 2) {
      findings.push({
        severity: 'WARNING',
        code: 'WEAK_PROBLEM_SOLUTION_LINK',
        message: 'Connection between problem and solution could be clearer.',
        relatedFields: ['problemStatement', 'valueProposition'],
        penaltyPoints: 4,
        blocksBuild: false,
      });
      reasoning.push('Some incoherence between problem and solution');
      return 5;
    }

    reasoning.push('Strong coherence between problem, solution, and audience');
    return 9;
  }

  private extractKeywords(text: string): string[] {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return text
      .split(/\s+/)
      .filter(word => word.length > 4 && !stopWords.includes(word))
      .slice(0, 10);
  }
}
