/**
 * Build/Repair Loop Interfaces
 *
 * Groundwork for future generate-validate-detect-repair loop functionality.
 * Interfaces and types only — no concrete implementations.
 *
 * The BuildRepairOrchestrator connects to the AI Runtime for generate and
 * repair operations (using CODE_ARCHITECTURE and BUILD_REPAIR task types)
 * and to the Telemetry Logger to log each operation in the repair loop.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import type { ProviderName } from './aiTypes';

// ─── Generated Artifact ───

export interface GeneratedArtifactResult {
  content: string;
  metadata: Record<string, unknown>;
  generatedBy: { provider: ProviderName; model: string };
}

// ─── Validation ───

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Issue Detection ───

export interface DetectedIssue {
  severity: 'error' | 'warning';
  location: string;
  message: string;
  suggestedFix?: string;
}

// ─── Repair Loop Result ───

export interface RepairLoopResult {
  originalArtifact: GeneratedArtifactResult;
  detectedIssues: DetectedIssue[];
  repairedArtifact: GeneratedArtifactResult | null;
  iterationCount: number;
  success: boolean;
}

// ─── Build/Repair Orchestrator ───

export interface BuildRepairOrchestrator {
  generate(
    prompt: string,
    context: Record<string, unknown>
  ): Promise<GeneratedArtifactResult>;

  validate(artifact: GeneratedArtifactResult): Promise<ValidationResult>;

  detectIssues(artifact: GeneratedArtifactResult): Promise<DetectedIssue[]>;

  repair(
    artifact: GeneratedArtifactResult,
    issues: DetectedIssue[]
  ): Promise<GeneratedArtifactResult>;

  save(
    projectId: string,
    artifact: GeneratedArtifactResult
  ): Promise<void>;
}
