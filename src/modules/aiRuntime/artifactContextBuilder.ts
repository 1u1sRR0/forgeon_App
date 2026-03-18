import prisma from '@/lib/prisma';
import type { ArtifactContext } from './aiTypes';
import { AIRuntimeError } from './aiTypes';

/**
 * Aggregates artifact-level data for a specific generated artifact within a project.
 * Includes the artifact content, related evaluation findings, and build status.
 * Throws AIRuntimeError if the artifact is not found.
 */
export async function buildArtifactContext(
  projectId: string,
  artifactType: string
): Promise<ArtifactContext> {
  // 1. Query GeneratedArtifact by projectId and type (@@unique constraint)
  const artifact = await prisma.generatedArtifact.findUnique({
    where: {
      projectId_type: {
        projectId,
        type: artifactType as any,
      },
    },
  });

  // 2. Throw AIRuntimeError if not found
  if (!artifact) {
    throw new AIRuntimeError(
      `Artifact of type "${artifactType}" not found for project "${projectId}"`,
      'router'
    );
  }

  // 3. Query related EvaluationFindings and latest BuildArtifact in parallel
  const [findings, buildArtifact] = await Promise.all([
    prisma.evaluationFinding.findMany({
      where: { projectId },
      select: { severity: true, code: true, message: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.buildArtifact.findFirst({
      where: { projectId },
      select: { status: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // 4. Return ArtifactContext
  return {
    artifactId: artifact.id,
    projectId: artifact.projectId,
    type: artifact.type,
    title: artifact.title,
    content: artifact.content,
    relatedFindings: findings.map((f) => ({
      severity: f.severity,
      code: f.code,
      message: f.message,
    })),
    buildStatus: buildArtifact?.status ?? null,
  };
}
