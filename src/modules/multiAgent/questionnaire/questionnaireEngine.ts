// Questionnaire Engine — Session creation, business type updates, section persistence, progress tracking

import crypto from 'crypto';
import prisma from '@/lib/prisma';
import type { BusinessType, QuestionnaireAnswers } from '../types/index';
import { computeProgress } from './questionnaireSchema';
import type { SectionStatus } from './questionnaireSchema';

// ─── Section key mapping ───

const SECTION_FIELD_MAP: Record<string, string> = {
  A: 'sectionA',
  B: 'sectionB',
  C: 'sectionC',
  D: 'sectionD',
  E: 'sectionE',
  F: 'sectionF',
};

// ─── createSession ───

/**
 * Creates a new GenerationSession in QUESTIONNAIRE state with businessType GUIDED,
 * along with linked QuestionnaireResponse and GenerationSettings records.
 */
export async function createSession(userId: string): Promise<{ id: string }> {
  const sessionId = crypto.randomUUID();
  const now = new Date();

  await prisma.generationSession.create({
    data: {
      id: sessionId,
      userId,
      businessType: 'GUIDED',
      state: 'QUESTIONNAIRE',
      iteration: 1,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.questionnaireResponse.create({
    data: {
      id: crypto.randomUUID(),
      sessionId,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.generationSettings.create({
    data: {
      id: crypto.randomUUID(),
      sessionId,
      buildMode: 'standard',
      intensity: 'balanced',
      moduleToggles: {
        adminPanel: true,
        paymentIntegration: true,
        dashboardAnalytics: true,
        aiFeatures: false,
        emailNotifications: false,
      },
      createdAt: now,
      updatedAt: now,
    },
  });

  return { id: sessionId };
}

// ─── updateBusinessType ───

/**
 * Updates the businessType field on the GenerationSession.
 */
export async function updateBusinessType(
  sessionId: string,
  businessType: BusinessType,
): Promise<void> {
  await prisma.generationSession.update({
    where: { id: sessionId },
    data: {
      businessType,
      updatedAt: new Date(),
    },
  });
}

// ─── saveQuestionnaireSection ───

/**
 * Upserts the QuestionnaireResponse for the session, updating the specific
 * sectionX field with the provided JSON answers.
 */
export async function saveQuestionnaireSection(
  sessionId: string,
  section: 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
  answers: Record<string, unknown>,
): Promise<void> {
  const fieldName = SECTION_FIELD_MAP[section];
  const now = new Date();

  await prisma.questionnaireResponse.upsert({
    where: { sessionId },
    update: {
      [fieldName]: answers,
      updatedAt: now,
    },
    create: {
      id: crypto.randomUUID(),
      sessionId,
      [fieldName]: answers,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.generationSession.update({
    where: { id: sessionId },
    data: { updatedAt: now },
  });
}

// ─── getQuestionnaireProgress ───

/**
 * Loads the session and questionnaire response, computes progress using
 * computeProgress from questionnaireSchema.ts, and returns the progress data.
 */
export async function getQuestionnaireProgress(sessionId: string): Promise<{
  sections: Record<string, SectionStatus>;
  completionPercentage: number;
  canGenerate: boolean;
}> {
  const session = await prisma.generationSession.findUniqueOrThrow({
    where: { id: sessionId },
  });

  const questionnaire = await prisma.questionnaireResponse.findUnique({
    where: { sessionId },
  });

  const answers: QuestionnaireAnswers = {
    sectionA: (questionnaire?.sectionA as QuestionnaireAnswers['sectionA']) ?? undefined,
    sectionB: (questionnaire?.sectionB as QuestionnaireAnswers['sectionB']) ?? undefined,
    sectionC: (questionnaire?.sectionC as QuestionnaireAnswers['sectionC']) ?? undefined,
    sectionD: (questionnaire?.sectionD as QuestionnaireAnswers['sectionD']) ?? undefined,
    sectionE: (questionnaire?.sectionE as QuestionnaireAnswers['sectionE']) ?? undefined,
    sectionF: (questionnaire?.sectionF as QuestionnaireAnswers['sectionF']) ?? undefined,
  };

  const businessType = session.businessType as BusinessType;

  return computeProgress(answers, businessType);
}
