/**
 * Core type definitions for MVP Incubator SaaS
 */

// Project State Machine
export enum ProjectState {
  IDEA = 'IDEA',
  STRUCTURED = 'STRUCTURED',
  VALIDATED = 'VALIDATED',
  BUILD_READY = 'BUILD_READY',
  MVP_GENERATED = 'MVP_GENERATED',
  BLOCKED = 'BLOCKED',
}

// Finding Severity
export enum FindingSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

// Risk Category
export enum RiskCategory {
  MARKET = 'MARKET',
  PRODUCT = 'PRODUCT',
  FINANCIAL = 'FINANCIAL',
  TECHNICAL = 'TECHNICAL',
  LEGAL = 'LEGAL',
  EXECUTION = 'EXECUTION',
}

// Artifact Type
export enum ArtifactType {
  BUSINESS_MODEL_CANVAS = 'BUSINESS_MODEL_CANVAS',
  PRODUCT_REQUIREMENTS = 'PRODUCT_REQUIREMENTS',
  TECHNICAL_ARCHITECTURE = 'TECHNICAL_ARCHITECTURE',
  USER_STORIES = 'USER_STORIES',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  GO_TO_MARKET = 'GO_TO_MARKET',
}

// Template Type
export enum TemplateType {
  SAAS_BASIC = 'SAAS_BASIC',
  MARKETPLACE_MINI = 'MARKETPLACE_MINI',
  ECOMMERCE_MINI = 'ECOMMERCE_MINI',
  LANDING_BLOG = 'LANDING_BLOG',
}

// Build Status
export enum BuildStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
