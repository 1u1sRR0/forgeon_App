// Build service with build gate validation and job management

import { prisma } from '@/lib/prisma';
import { BuildStatus, TemplateType } from '@prisma/client';
import { BuildParameters, BuildValidationResult, BuildJob } from './types';
import { getTemplateByBusinessType } from './templateRegistry';

export class BuildService {
  /**
   * Validate if project can proceed to build
   * Checks: score >= 60, no critical findings, no critical risks
   */
  async validateBuildGate(projectId: string): Promise<BuildValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Get project with latest evaluation data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        viabilityScores: {
          orderBy: { computedAt: 'desc' },
          take: 1,
        },
        evaluationFindings: {
          where: { severity: 'CRITICAL' },
        },
        risks: {
          where: { isCritical: true },
        },
        artifacts: true,
        templateMapping: true,
      },
    });

    if (!project) {
      errors.push('Project not found');
      return { isValid: false, errors, warnings };
    }

    // Check project state
    if (project.state !== 'BUILD_READY') {
      errors.push(`Project must be in BUILD_READY state (current: ${project.state})`);
    }

    // Check viability score exists
    const latestScore = project.viabilityScores[0];
    if (!latestScore) {
      errors.push('No viability score found. Run evaluation first.');
      return { isValid: false, errors, warnings };
    }

    // Check score threshold
    if (latestScore.totalScore < 60) {
      errors.push(`Viability score too low: ${latestScore.totalScore}/100 (minimum: 60)`);
    }

    // Check critical findings
    if (project.evaluationFindings.length > 0) {
      errors.push(
        `${project.evaluationFindings.length} critical finding(s) must be resolved`
      );
      project.evaluationFindings.forEach((finding) => {
        errors.push(`  - ${finding.message}`);
      });
    }

    // Check critical risks
    if (project.risks.length > 0) {
      errors.push(`${project.risks.length} critical risk(s) must be mitigated`);
      project.risks.forEach((risk) => {
        errors.push(`  - ${risk.title} (score: ${risk.riskScore})`);
      });
    }

    // Check required artifacts
    const requiredArtifactTypes = [
      'PRODUCT_REQUIREMENTS',
      'TECHNICAL_ARCHITECTURE',
    ];
    const existingTypes = project.artifacts.map((a) => a.type);
    const missingArtifacts = requiredArtifactTypes.filter(
      (type) => !existingTypes.includes(type as any)
    );

    if (missingArtifacts.length > 0) {
      errors.push(`Missing required artifacts: ${missingArtifacts.join(', ')}`);
    }

    // Check template mapping
    if (!project.templateMapping) {
      warnings.push('No template mapping found. Will use default template.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Create a new build job
   */
  async createBuildJob(
    projectId: string,
    parameters: BuildParameters
  ): Promise<BuildJob> {
    // Validate build gate
    const validation = await this.validateBuildGate(projectId);
    if (!validation.isValid) {
      throw new Error(
        `Build gate validation failed:\n${validation.errors.join('\n')}`
      );
    }

    // Get template mapping or determine from business type
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        templateMapping: true,
        wizardAnswers: true,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    let templateType: TemplateType;
    if (project.templateMapping) {
      templateType = project.templateMapping.recommendedTemplate;
    } else {
      // Fallback: determine from business type
      const businessTypeAnswer = project.wizardAnswers.find(
        (a) => a.key === 'businessType'
      );
      const businessType = businessTypeAnswer?.value || 'saas';
      templateType = getTemplateByBusinessType(businessType) as TemplateType;
    }

    // Create build artifact record
    const buildArtifact = await prisma.buildArtifact.create({
      data: {
        projectId,
        templateType,
        status: 'PENDING',
        parameters: parameters as any,
        qualityChecksPassed: false,
      },
    });

    return {
      id: buildArtifact.id,
      projectId: buildArtifact.projectId,
      templateType: buildArtifact.templateType,
      status: buildArtifact.status,
      parameters: buildArtifact.parameters as any as BuildParameters,
      buildLog: [],
      qualityChecksPassed: buildArtifact.qualityChecksPassed,
      createdAt: buildArtifact.createdAt,
    };
  }

  /**
   * Get build job status
   */
  async getBuildJob(buildId: string): Promise<BuildJob | null> {
    const buildArtifact = await prisma.buildArtifact.findUnique({
      where: { id: buildId },
    });

    if (!buildArtifact) {
      return null;
    }

    return {
      id: buildArtifact.id,
      projectId: buildArtifact.projectId,
      templateType: buildArtifact.templateType,
      status: buildArtifact.status,
      parameters: buildArtifact.parameters as any as BuildParameters,
      buildLog: buildArtifact.buildLog ? buildArtifact.buildLog.split('\n') : [],
      errorMessage: buildArtifact.errorMessage || undefined,
      zipPath: buildArtifact.zipPath || undefined,
      qualityChecksPassed: buildArtifact.qualityChecksPassed,
      createdAt: buildArtifact.createdAt,
      completedAt: buildArtifact.completedAt || undefined,
    };
  }

  /**
   * Update build job status
   */
  async updateBuildStatus(
    buildId: string,
    status: BuildStatus,
    updates: {
      buildLog?: string[];
      errorMessage?: string;
      zipPath?: string;
      qualityChecksPassed?: boolean;
    } = {}
  ): Promise<void> {
    await prisma.buildArtifact.update({
      where: { id: buildId },
      data: {
        status,
        buildLog: updates.buildLog?.join('\n'),
        errorMessage: updates.errorMessage,
        zipPath: updates.zipPath,
        qualityChecksPassed: updates.qualityChecksPassed,
        completedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined,
      },
    });
  }

  /**
   * Get latest build for project
   */
  async getLatestBuild(projectId: string): Promise<BuildJob | null> {
    const buildArtifact = await prisma.buildArtifact.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!buildArtifact) {
      return null;
    }

    return {
      id: buildArtifact.id,
      projectId: buildArtifact.projectId,
      templateType: buildArtifact.templateType,
      status: buildArtifact.status,
      parameters: buildArtifact.parameters as any as BuildParameters,
      buildLog: buildArtifact.buildLog ? buildArtifact.buildLog.split('\n') : [],
      errorMessage: buildArtifact.errorMessage || undefined,
      zipPath: buildArtifact.zipPath || undefined,
      qualityChecksPassed: buildArtifact.qualityChecksPassed,
      createdAt: buildArtifact.createdAt,
      completedAt: buildArtifact.completedAt || undefined,
    };
  }
}

export const buildService = new BuildService();
