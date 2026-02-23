// Build engine types and template system

export type TemplateType = 'SAAS_BASIC' | 'MARKETPLACE_MINI' | 'ECOMMERCE_MINI' | 'LANDING_BLOG';

export type BuildStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface BuildParameters {
  appName: string;
  entityName: string;
  brandingColors?: {
    primary: string;
    secondary: string;
  };
  featureFlags?: string[];
}

export interface TemplateConfig {
  type: TemplateType;
  name: string;
  description: string;
  requiredArtifacts: string[];
  defaultParameters: Partial<BuildParameters>;
  features: string[];
}

export interface BuildJob {
  id: string;
  projectId: string;
  templateType: TemplateType;
  status: BuildStatus;
  parameters: BuildParameters;
  buildLog: string[];
  errorMessage?: string;
  zipPath?: string;
  qualityChecksPassed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface BuildValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface QualityCheckResult {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}
