import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { calculateViabilityScore } from '@/modules/evaluation/scoringEngine';
import {
  generateBusinessModelCanvas,
  generatePRD,
  generateTechnicalArchitecture,
  generateUserStories,
  generateRiskAssessment,
  generateGoToMarket,
  determineTemplate,
} from '@/modules/evaluation/artifactGenerators';
import { WizardInputs } from '@/modules/evaluation/types';

// POST /api/projects/[id]/evaluate - Run evaluation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership and state
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        WizardAnswer: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (project.state !== 'STRUCTURED') {
      return NextResponse.json(
        { error: 'Project must be in STRUCTURED state to evaluate' },
        { status: 400 }
      );
    }

    // Convert wizard answers to inputs object
    const inputs: Partial<WizardInputs> = {};
    (project as any).WizardAnswer.forEach((answer: any) => {
      inputs[answer.key as keyof WizardInputs] = answer.value || undefined;
    });

    // Run evaluation
    const { score, allFindings, allRisks } = calculateViabilityScore(inputs as WizardInputs);

    // Save viability score
    const viabilityScore = await prisma.viabilityScore.create({
      data: {
        id: crypto.randomUUID(),
        projectId: id,
        marketScore: score.marketScore,
        productScore: score.productScore,
        financialScore: score.financialScore,
        executionScore: score.executionScore,
        totalScore: score.totalScore,
        breakdownReasons: score.breakdownReasons,
        criticalFlags: score.criticalFlags,
      },
    });

    // Clear old findings and risks
    await prisma.evaluationFinding.deleteMany({ where: { projectId: id } });
    await prisma.riskMatrix.deleteMany({ where: { projectId: id } });

    // Save findings
    if (allFindings.length > 0) {
      await prisma.evaluationFinding.createMany({
        data: allFindings.map((f) => ({
          id: crypto.randomUUID(),
          projectId: id,
          severity: f.severity,
          code: f.code,
          message: f.message,
          relatedFields: f.relatedFields,
          penaltyPoints: f.penaltyPoints,
          blocksBuild: f.blocksBuild,
        })),
      });
    }

    // Save risks
    if (allRisks.length > 0) {
      await prisma.riskMatrix.createMany({
        data: allRisks.map((r) => ({
          id: crypto.randomUUID(),
          projectId: id,
          category: r.category,
          title: r.title,
          description: r.description,
          impact: r.impact,
          probability: r.probability,
          riskScore: r.impact * r.probability,
          isCritical: r.impact * r.probability >= 16,
          mitigation: r.mitigation,
          updatedAt: new Date(),
        })),
      });
    }

    // Generate artifacts
    const artifacts = [
      {
        type: 'BUSINESS_MODEL_CANVAS',
        title: 'Business Model Canvas',
        content: generateBusinessModelCanvas(inputs as WizardInputs),
      },
      {
        type: 'PRODUCT_REQUIREMENTS',
        title: 'Product Requirements Document',
        content: generatePRD(inputs as WizardInputs),
      },
      {
        type: 'TECHNICAL_ARCHITECTURE',
        title: 'Technical Architecture',
        content: generateTechnicalArchitecture(inputs as WizardInputs),
      },
      {
        type: 'USER_STORIES',
        title: 'User Stories',
        content: generateUserStories(inputs as WizardInputs),
      },
      {
        type: 'RISK_ASSESSMENT',
        title: 'Risk Assessment Report',
        content: generateRiskAssessment(allRisks),
      },
      {
        type: 'GO_TO_MARKET',
        title: 'Go-to-Market Strategy',
        content: generateGoToMarket(inputs as WizardInputs),
      },
    ];

    // Clear old artifacts
    await prisma.generatedArtifact.deleteMany({ where: { projectId: id } });

    // Save artifacts
    await prisma.generatedArtifact.createMany({
      data: artifacts.map((a) => ({
        id: crypto.randomUUID(),
        projectId: id,
        type: a.type as any,
        title: a.title,
        content: a.content,
        updatedAt: new Date(),
      })),
    });

    // Determine template
    const templateMapping = determineTemplate(inputs as WizardInputs);
    await prisma.templateMapping.upsert({
      where: { projectId: id },
      update: {
        recommendedTemplate: templateMapping.template as any,
        confidence: templateMapping.confidence,
        reasoning: templateMapping.reasoning,
        updatedAt: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        projectId: id,
        recommendedTemplate: templateMapping.template as any,
        confidence: templateMapping.confidence,
        reasoning: templateMapping.reasoning,
        updatedAt: new Date(),
      },
    });

    // Determine new state
    const hasCriticalFindings = allFindings.some((f) => f.severity === 'CRITICAL');
    const hasCriticalRisks = allRisks.some((r) => r.impact * r.probability >= 16);
    const scoreInsufficient = score.totalScore < 60;

    let newState: 'VALIDATED' | 'BUILD_READY' | 'BLOCKED';
    if (hasCriticalFindings || hasCriticalRisks || scoreInsufficient) {
      newState = 'BLOCKED';
    } else {
      newState = 'BUILD_READY';
    }

    // Update project state
    await prisma.project.update({
      where: { id },
      data: { state: newState },
    });

    // Fetch created data
    const findings = await prisma.evaluationFinding.findMany({
      where: { projectId: id },
    });

    const risks = await prisma.riskMatrix.findMany({
      where: { projectId: id },
    });

    const createdArtifacts = await prisma.generatedArtifact.findMany({
      where: { projectId: id },
    });

    const template = await prisma.templateMapping.findUnique({
      where: { projectId: id },
    });

    return NextResponse.json({
      viabilityScore,
      findings,
      risks,
      artifacts: createdArtifacts,
      templateMapping: template,
      newState,
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
