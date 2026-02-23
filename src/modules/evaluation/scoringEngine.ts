import { WizardInputs, ViabilityScoreResult, Finding, Agent } from './types';
import { MarketAgent } from './agents/MarketAgent';
import { ProductAgent } from './agents/ProductAgent';
import { FinancialAgent } from './agents/FinancialAgent';
import { TechnicalAgent } from './agents/TechnicalAgent';
import { DevilsAdvocateAgent } from './agents/DevilsAdvocateAgent';

export function calculateViabilityScore(inputs: WizardInputs): {
  score: ViabilityScoreResult;
  allFindings: Finding[];
  allRisks: any[];
} {
  // Initialize agents
  const agents: Agent[] = [
    new MarketAgent(),
    new ProductAgent(),
    new FinancialAgent(),
    new TechnicalAgent(),
    new DevilsAdvocateAgent(),
  ];

  // Run evaluations
  const marketEval = agents[0].evaluate(inputs);
  const productEval = agents[1].evaluate(inputs);
  const financialEval = agents[2].evaluate(inputs);
  const technicalEval = agents[3].evaluate(inputs);
  const devilsEval = agents[4].evaluate(inputs);

  // Collect all findings and risks
  const allFindings = [
    ...marketEval.findings,
    ...productEval.findings,
    ...financialEval.findings,
    ...technicalEval.findings,
    ...devilsEval.findings,
  ];

  const allRisks = [
    ...marketEval.risks,
    ...productEval.risks,
    ...financialEval.risks,
    ...technicalEval.risks,
    ...devilsEval.risks,
  ];

  // Calculate subscores (before penalties)
  let marketScore = marketEval.subscore;
  let productScore = productEval.subscore;
  let financialScore = financialEval.subscore;
  let executionScore = technicalEval.subscore;

  // Apply penalties proportionally
  const marketPenalty = allFindings
    .filter((f) =>
      f.relatedFields.some((field) =>
        ['targetAudience', 'competition', 'differentiation', 'audienceSize'].includes(field)
      )
    )
    .reduce((sum, f) => sum + f.penaltyPoints, 0);

  const productPenalty = allFindings
    .filter((f) =>
      f.relatedFields.some((field) =>
        ['problemStatement', 'valueProposition', 'keyFeatures', 'solution'].includes(field)
      )
    )
    .reduce((sum, f) => sum + f.penaltyPoints, 0);

  const financialPenalty = allFindings
    .filter((f) =>
      f.relatedFields.some((field) =>
        ['monetizationModel', 'pricing', 'resources'].includes(field)
      )
    )
    .reduce((sum, f) => sum + f.penaltyPoints, 0);

  const executionPenalty = allFindings
    .filter((f) =>
      f.relatedFields.some((field) =>
        ['timeline', 'operationsModel', 'deliveryModel', 'mainRisks'].includes(field)
      )
    )
    .reduce((sum, f) => sum + f.penaltyPoints, 0);

  // Apply penalties (capped at subscore)
  marketScore = Math.max(0, marketScore - marketPenalty);
  productScore = Math.max(0, productScore - productPenalty);
  financialScore = Math.max(0, financialScore - financialPenalty);
  executionScore = Math.max(0, executionScore - executionPenalty);

  // Calculate total score (0-100)
  const totalScore = marketScore + productScore + financialScore + executionScore;

  // Build breakdown reasons
  const breakdownReasons = [
    {
      category: 'Market',
      reason: marketEval.reasoning.join('; '),
      points: marketScore,
      penalty: marketPenalty,
    },
    {
      category: 'Product',
      reason: productEval.reasoning.join('; '),
      points: productScore,
      penalty: productPenalty,
    },
    {
      category: 'Financial',
      reason: financialEval.reasoning.join('; '),
      points: financialScore,
      penalty: financialPenalty,
    },
    {
      category: 'Execution',
      reason: technicalEval.reasoning.join('; '),
      points: executionScore,
      penalty: executionPenalty,
    },
  ];

  // Collect critical flags
  const criticalFlags = allFindings.filter((f) => f.severity === 'CRITICAL').map((f) => f.code);

  const score: ViabilityScoreResult = {
    marketScore,
    productScore,
    financialScore,
    executionScore,
    totalScore,
    breakdownReasons,
    criticalFlags,
  };

  return {
    score,
    allFindings,
    allRisks,
  };
}
