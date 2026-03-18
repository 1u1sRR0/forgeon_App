-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('QUESTIONNAIRE', 'PROMPT_REVIEW', 'GENERATING', 'BLUEPRINTS_READY', 'PREVIEW_READY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AgentRunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PromptVersionType" AS ENUM ('ORIGINAL', 'OPTIMIZED', 'CUSTOM', 'REGENERATED');

-- CreateTable
CREATE TABLE "GenerationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "businessType" TEXT NOT NULL DEFAULT 'GUIDED',
    "state" "SessionState" NOT NULL DEFAULT 'QUESTIONNAIRE',
    "iteration" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionnaireResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sectionA" JSONB,
    "sectionB" JSONB,
    "sectionC" JSONB,
    "sectionD" JSONB,
    "sectionE" JSONB,
    "sectionF" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVersion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "type" "PromptVersionType" NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "status" "AgentRunStatus" NOT NULL DEFAULT 'PENDING',
    "iteration" INTEGER NOT NULL,
    "inputSummary" TEXT,
    "outputSummary" TEXT,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentArtifact" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "agentRunId" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessBlueprint" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessBlueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBlueprint" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductBlueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalBlueprint" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechnicalBlueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildBlueprint" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuildBlueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationSettings" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "activePromptVersionId" TEXT,
    "buildMode" TEXT NOT NULL DEFAULT 'standard',
    "intensity" TEXT NOT NULL DEFAULT 'balanced',
    "moduleToggles" JSONB NOT NULL DEFAULT '{"adminPanel":true,"paymentIntegration":true,"dashboardAnalytics":true,"aiFeatures":false,"emailNotifications":false}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GenerationSession_userId_idx" ON "GenerationSession"("userId");

-- CreateIndex
CREATE INDEX "GenerationSession_state_idx" ON "GenerationSession"("state");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireResponse_sessionId_key" ON "QuestionnaireResponse"("sessionId");

-- CreateIndex
CREATE INDEX "QuestionnaireResponse_sessionId_idx" ON "QuestionnaireResponse"("sessionId");

-- CreateIndex
CREATE INDEX "PromptVersion_sessionId_idx" ON "PromptVersion"("sessionId");

-- CreateIndex
CREATE INDEX "PromptVersion_sessionId_isActive_idx" ON "PromptVersion"("sessionId", "isActive");

-- CreateIndex
CREATE INDEX "AgentRun_sessionId_idx" ON "AgentRun"("sessionId");

-- CreateIndex
CREATE INDEX "AgentRun_sessionId_iteration_idx" ON "AgentRun"("sessionId", "iteration");

-- CreateIndex
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AgentArtifact_agentRunId_key" ON "AgentArtifact"("agentRunId");

-- CreateIndex
CREATE INDEX "AgentArtifact_sessionId_idx" ON "AgentArtifact"("sessionId");

-- CreateIndex
CREATE INDEX "AgentArtifact_sessionId_iteration_idx" ON "AgentArtifact"("sessionId", "iteration");

-- CreateIndex
CREATE INDEX "AgentArtifact_agentType_idx" ON "AgentArtifact"("agentType");

-- CreateIndex
CREATE INDEX "BusinessBlueprint_sessionId_idx" ON "BusinessBlueprint"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessBlueprint_sessionId_iteration_key" ON "BusinessBlueprint"("sessionId", "iteration");

-- CreateIndex
CREATE INDEX "ProductBlueprint_sessionId_idx" ON "ProductBlueprint"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBlueprint_sessionId_iteration_key" ON "ProductBlueprint"("sessionId", "iteration");

-- CreateIndex
CREATE INDEX "TechnicalBlueprint_sessionId_idx" ON "TechnicalBlueprint"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalBlueprint_sessionId_iteration_key" ON "TechnicalBlueprint"("sessionId", "iteration");

-- CreateIndex
CREATE INDEX "BuildBlueprint_sessionId_idx" ON "BuildBlueprint"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildBlueprint_sessionId_iteration_key" ON "BuildBlueprint"("sessionId", "iteration");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationSettings_sessionId_key" ON "GenerationSettings"("sessionId");

-- CreateIndex
CREATE INDEX "GenerationSettings_sessionId_idx" ON "GenerationSettings"("sessionId");

-- AddForeignKey
ALTER TABLE "GenerationSession" ADD CONSTRAINT "GenerationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentArtifact" ADD CONSTRAINT "AgentArtifact_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentArtifact" ADD CONSTRAINT "AgentArtifact_agentRunId_fkey" FOREIGN KEY ("agentRunId") REFERENCES "AgentRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBlueprint" ADD CONSTRAINT "BusinessBlueprint_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBlueprint" ADD CONSTRAINT "ProductBlueprint_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalBlueprint" ADD CONSTRAINT "TechnicalBlueprint_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildBlueprint" ADD CONSTRAINT "BuildBlueprint_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationSettings" ADD CONSTRAINT "GenerationSettings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
