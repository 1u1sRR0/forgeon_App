// Evaluation engine types

export interface WizardInputs {
  // Step 1
  userRole?: string;
  experience?: string;
  
  // Step 2
  goal?: string;
  timeline?: string;
  
  // Step 3
  businessType: string;
  industry?: string;
  
  // Step 4
  targetAudience: string;
  audienceSize?: string;
  
  // Step 5
  problemStatement: string;
  currentSolution?: string;
  
  // Step 6
  valueProposition: string;
  keyFeatures?: string;
  
  // Step 7
  monetizationModel: string;
  pricing?: string;
  
  // Step 8
  differentiation?: string;
  competition?: string;
  
  // Step 9
  deliveryModel?: string;
  operationsModel?: string;
  
  // Step 10
  mainRisks?: string;
  resources?: string;
}

export interface Finding {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  code: string;
  message: string;
  relatedFields: string[];
  penaltyPoints: number;
  blocksBuild: boolean;
}

export interface Risk {
  category: 'MARKET' | 'PRODUCT' | 'FINANCIAL' | 'TECHNICAL' | 'LEGAL' | 'EXECUTION';
  title: string;
  description: string;
  impact: number; // 1-5
  probability: number; // 1-5
  mitigation: string;
}

export interface AgentEvaluation {
  subscore: number; // 0-25
  findings: Finding[];
  risks: Risk[];
  reasoning: string[];
}

export interface Agent {
  name: string;
  evaluate(inputs: WizardInputs): AgentEvaluation;
}

export interface ViabilityScoreResult {
  marketScore: number;
  productScore: number;
  financialScore: number;
  executionScore: number;
  totalScore: number;
  breakdownReasons: Array<{
    category: string;
    reason: string;
    points: number;
    penalty: number;
  }>;
  criticalFlags: string[];
}

export interface EvaluationResults {
  viabilityScore: ViabilityScoreResult;
  findings: Finding[];
  risks: Risk[];
  newState: 'VALIDATED' | 'BUILD_READY' | 'BLOCKED';
}
