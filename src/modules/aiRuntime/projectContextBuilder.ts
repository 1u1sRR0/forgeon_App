import prisma from '@/lib/prisma';
import type { ProjectContext } from './aiTypes';

/**
 * Aggregates all project-related data into a single ProjectContext object.
 * Uses Prisma queries with selective includes to minimize database load.
 * Returns empty arrays/zero counts for missing data — never undefined.
 */
export async function buildProjectContext(
  projectId: string
): Promise<ProjectContext> {
  // 1. Main project query with selective includes
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: {
      WizardAnswer: true,
      ViabilityScore: { orderBy: { computedAt: 'desc' }, take: 3 },
      EvaluationFinding: { take: 20 },
      BuildArtifact: { orderBy: { createdAt: 'desc' }, take: 1 },
      Course: { include: { CourseLevel: { include: { Lesson: true } } } },
      GeneratedArtifact: true,
    },
  });

  // 2. Fetch linked entities via junction tables
  const [opportunityLinks, marketGapLinks, researchItems] = await Promise.all([
    prisma.opportunityProjectLink.findMany({
      where: { projectId },
      include: {
        Opportunity: {
          select: { id: true, title: true, viabilityScore: true },
        },
      },
    }),
    prisma.marketGapProjectLink.findMany({
      where: { projectId },
      include: {
        MarketGap: { select: { id: true, title: true, sector: true } },
      },
    }),
    prisma.projectResearchItem.findMany({
      where: { projectId },
      include: {
        MarketIntelItem: {
          select: { id: true, title: true, type: true, sector: true },
        },
      },
    }),
  ]);

  // 3. Fetch prompt versions from generation sessions linked to project
  const sessions = await prisma.generationSession.findMany({
    where: { projectId },
    include: { PromptVersion: { where: { isActive: true } } },
  });

  // 4. Conversation summary: count + last message
  const [conversations, totalMessages] = await Promise.all([
    prisma.conversation.findMany({
      where: { projectId },
      include: { Message: { orderBy: { createdAt: 'desc' }, take: 1 } },
    }),
    prisma.message.count({
      where: { Conversation: { projectId } },
    }),
  ]);

  // 5. Compute learn section from course structure
  const totalLessons =
    project.Course?.CourseLevel.reduce(
      (sum, level) => sum + level.Lesson.length,
      0
    ) ?? 0;

  // 6. Assemble ProjectContext with empty collections for missing data
  return {
    projectId,
    name: project.name,
    state: project.state,
    wizardAnswers: Object.fromEntries(
      project.WizardAnswer.map((a) => [a.key, a.value])
    ),
    evaluation: {
      viabilityScores: project.ViabilityScore.map((v) => ({
        totalScore: v.totalScore,
        marketScore: v.marketScore,
        productScore: v.productScore,
        financialScore: v.financialScore,
        executionScore: v.executionScore,
      })),
      findings: project.EvaluationFinding.map((f) => ({
        severity: f.severity,
        code: f.code,
        message: f.message,
      })),
    },
    promptVersions: sessions.flatMap((s) =>
      s.PromptVersion.map((p) => ({
        version: p.version,
        type: p.type,
        content: p.content,
        isActive: p.isActive,
      }))
    ),
    build: {
      status: project.BuildArtifact[0]?.status ?? null,
      templateType: project.BuildArtifact[0]?.templateType ?? null,
    },
    learn: {
      courseExists: !!project.Course,
      completedLessons: 0, // No userId context available; default to 0
      totalLessons,
    },
    opportunities: opportunityLinks.map((l) => ({
      id: l.Opportunity.id,
      title: l.Opportunity.title,
      viabilityScore: l.Opportunity.viabilityScore,
    })),
    marketGaps: marketGapLinks.map((l) => ({
      id: l.MarketGap.id,
      title: l.MarketGap.title,
      sector: l.MarketGap.sector,
    })),
    marketIntelligence: researchItems.map((r) => ({
      id: r.MarketIntelItem.id,
      title: r.MarketIntelItem.title,
      type: r.MarketIntelItem.type,
      sector: r.MarketIntelItem.sector,
    })),
    conversationSummary: {
      totalMessages,
      lastMessageAt: conversations[0]?.Message[0]?.createdAt ?? null,
    },
  };
}
