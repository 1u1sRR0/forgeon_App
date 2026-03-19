// Build engine types and template system

export type TemplateType = 'SAAS_BASIC' | 'MARKETPLACE_MINI' | 'ECOMMERCE_MINI' | 'LANDING_BLOG';

export type BuildStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

// --- New interfaces for emergent-level digital services ---

export interface ComponentSpec {
  name: string;
  props: Array<{ name: string; type: string; required: boolean }>;
  states: Array<{ name: string; type: string; initial: string }>;
  hasForm: boolean;
  hasDataFetching: boolean;
}

export interface FieldSpec {
  name: string;
  type: string;
  required: boolean;
  label: string;
}

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  entityName: string;
  zodSchema?: ZodSchemaSpec;
  requiresAuth: boolean;
  requiresOwnership: boolean;
  supportsPagination: boolean;
}

export interface ZodSchemaSpec {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    min?: number;
    max?: number;
    message?: string;
  }>;
}

export interface DetailedFlow {
  name: string;
  steps: Array<{
    page: string;
    action: string;
    dataRequired: string[];
    validations: string[];
    errorStates: string[];
  }>;
}

export interface ZodSchemaBlueprint {
  name: string;
  endpoint: string;
  fields: Array<{
    name: string;
    type: string;
    rules: string[];
  }>;
}

export interface ComponentSpecBlueprint {
  name: string;
  props: Array<{ name: string; type: string }>;
  states: string[];
  variants: string[];
}

export interface SharedComponentBlueprint {
  name: string;
  props: Array<{ name: string; type: string }>;
  description: string;
}

// --- End new interfaces ---

export interface BuildParameters {
  appName: string;
  entityName: string;
  brandingColors?: {
    primary: string;
    secondary: string;
  };
  featureFlags?: string[];
  detailedFlows?: DetailedFlow[];
  zodSchemas?: ZodSchemaBlueprint[];
  componentSpecs?: ComponentSpecBlueprint[];
  sharedComponents?: SharedComponentBlueprint[];
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
