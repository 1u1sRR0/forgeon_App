-- CreateEnum
CREATE TYPE "ProjectState" AS ENUM ('IDEA', 'STRUCTURED', 'VALIDATED', 'BUILD_READY', 'MVP_GENERATED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "FindingSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('MARKET', 'PRODUCT', 'FINANCIAL', 'TECHNICAL', 'LEGAL', 'EXECUTION');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('BUSINESS_MODEL_CANVAS', 'PRODUCT_REQUIREMENTS', 'TECHNICAL_ARCHITECTURE', 'USER_STORIES', 'RISK_ASSESSMENT', 'GO_TO_MARKET');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('SAAS_BASIC', 'MARKETPLACE_MINI', 'ECOMMERCE_MINI', 'LANDING_BLOG');

-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "state" "ProjectState" NOT NULL DEFAULT 'IDEA',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardAnswer" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WizardAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectVersion" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "description" TEXT,
    "projectState" "ProjectState" NOT NULL,
    "wizardAnswersSnapshot" JSONB,
    "viabilityScoreSnapshot" JSONB,
    "findingsSnapshot" JSONB,
    "risksSnapshot" JSONB,
    "artifactsSnapshot" JSONB,
    "buildArtifactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViabilityScore" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "marketScore" DOUBLE PRECISION NOT NULL,
    "productScore" DOUBLE PRECISION NOT NULL,
    "financialScore" DOUBLE PRECISION NOT NULL,
    "executionScore" DOUBLE PRECISION NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "breakdownReasons" JSONB NOT NULL,
    "criticalFlags" JSONB NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViabilityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationFinding" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "severity" "FindingSeverity" NOT NULL,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "relatedFields" JSONB,
    "penaltyPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blocksBuild" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskMatrix" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "category" "RiskCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" INTEGER NOT NULL,
    "probability" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "mitigation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedArtifact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ArtifactType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateMapping" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "recommendedTemplate" "TemplateType" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildArtifact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "templateType" "TemplateType" NOT NULL,
    "status" "BuildStatus" NOT NULL DEFAULT 'PENDING',
    "zipPath" TEXT,
    "buildLog" TEXT,
    "errorMessage" TEXT,
    "parameters" JSONB NOT NULL,
    "qualityChecksPassed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BuildArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLevel" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "levelNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "relatedTerms" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "buyerPersona" TEXT,
    "painLevel" INTEGER,
    "solutionOverview" TEXT NOT NULL,
    "mvpScope" TEXT,
    "coreFeatures" JSONB NOT NULL,
    "demandScore" INTEGER NOT NULL,
    "demandSignals" JSONB NOT NULL,
    "competitionScore" INTEGER NOT NULL,
    "competitionSnapshot" TEXT,
    "differentiationAngles" JSONB,
    "pricingSuggestions" TEXT,
    "pricingRationale" TEXT,
    "monetizationType" TEXT,
    "timingSignals" JSONB,
    "gtmChannels" JSONB,
    "risks" JSONB,
    "mitigations" JSONB,
    "executionDifficulty" INTEGER,
    "executionReasons" JSONB,
    "timeToMVP" TEXT,
    "requiredSkills" JSONB,
    "recommendedStack" JSONB,
    "acceptanceCriteria" JSONB,
    "nextSteps" JSONB,
    "viabilityScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityProjectLink" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "wizardSeed" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpportunityProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketGap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "underservedSegment" TEXT NOT NULL,
    "competitionLevel" TEXT NOT NULL,
    "gapDescription" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "wedgeStrategy" TEXT NOT NULL,
    "estimatedMarketSize" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketGapVariant" (
    "id" TEXT NOT NULL,
    "marketGapId" TEXT NOT NULL,
    "approach" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetSubSegment" TEXT NOT NULL,
    "differentiator" TEXT NOT NULL,
    "fullDossier" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketGapVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketGapProjectLink" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "marketGapId" TEXT NOT NULL,
    "marketGapVariantId" TEXT NOT NULL,
    "wizardSeed" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketGapProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Conversation',
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnTask" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_state_idx" ON "Project"("state");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "WizardAnswer_projectId_idx" ON "WizardAnswer"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "WizardAnswer_projectId_step_key_key" ON "WizardAnswer"("projectId", "step", "key");

-- CreateIndex
CREATE INDEX "ProjectVersion_projectId_idx" ON "ProjectVersion"("projectId");

-- CreateIndex
CREATE INDEX "ProjectVersion_createdAt_idx" ON "ProjectVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectVersion_projectId_versionNumber_key" ON "ProjectVersion"("projectId", "versionNumber");

-- CreateIndex
CREATE INDEX "ViabilityScore_projectId_idx" ON "ViabilityScore"("projectId");

-- CreateIndex
CREATE INDEX "ViabilityScore_computedAt_idx" ON "ViabilityScore"("computedAt");

-- CreateIndex
CREATE INDEX "EvaluationFinding_projectId_idx" ON "EvaluationFinding"("projectId");

-- CreateIndex
CREATE INDEX "EvaluationFinding_severity_idx" ON "EvaluationFinding"("severity");

-- CreateIndex
CREATE INDEX "EvaluationFinding_blocksBuild_idx" ON "EvaluationFinding"("blocksBuild");

-- CreateIndex
CREATE INDEX "RiskMatrix_projectId_idx" ON "RiskMatrix"("projectId");

-- CreateIndex
CREATE INDEX "RiskMatrix_isCritical_idx" ON "RiskMatrix"("isCritical");

-- CreateIndex
CREATE INDEX "RiskMatrix_riskScore_idx" ON "RiskMatrix"("riskScore");

-- CreateIndex
CREATE INDEX "GeneratedArtifact_projectId_idx" ON "GeneratedArtifact"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedArtifact_projectId_type_key" ON "GeneratedArtifact"("projectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateMapping_projectId_key" ON "TemplateMapping"("projectId");

-- CreateIndex
CREATE INDEX "TemplateMapping_projectId_idx" ON "TemplateMapping"("projectId");

-- CreateIndex
CREATE INDEX "BuildArtifact_projectId_idx" ON "BuildArtifact"("projectId");

-- CreateIndex
CREATE INDEX "BuildArtifact_status_idx" ON "BuildArtifact"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Course_projectId_key" ON "Course"("projectId");

-- CreateIndex
CREATE INDEX "Course_projectId_idx" ON "Course"("projectId");

-- CreateIndex
CREATE INDEX "CourseLevel_courseId_idx" ON "CourseLevel"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseLevel_courseId_levelNumber_key" ON "CourseLevel"("courseId", "levelNumber");

-- CreateIndex
CREATE INDEX "Lesson_levelId_idx" ON "Lesson"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_levelId_lessonNumber_key" ON "Lesson"("levelId", "lessonNumber");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "Quiz_levelId_idx" ON "Quiz"("levelId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "QuizAttempt"("quizId");

-- CreateIndex
CREATE INDEX "QuizAttempt_completedAt_idx" ON "QuizAttempt"("completedAt");

-- CreateIndex
CREATE INDEX "GlossaryTerm_courseId_idx" ON "GlossaryTerm"("courseId");

-- CreateIndex
CREATE INDEX "GlossaryTerm_category_idx" ON "GlossaryTerm"("category");

-- CreateIndex
CREATE INDEX "Opportunity_userId_idx" ON "Opportunity"("userId");

-- CreateIndex
CREATE INDEX "Opportunity_sector_idx" ON "Opportunity"("sector");

-- CreateIndex
CREATE INDEX "Opportunity_viabilityScore_idx" ON "Opportunity"("viabilityScore");

-- CreateIndex
CREATE INDEX "Opportunity_createdAt_idx" ON "Opportunity"("createdAt");

-- CreateIndex
CREATE INDEX "OpportunityProjectLink_projectId_idx" ON "OpportunityProjectLink"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityProjectLink_opportunityId_projectId_key" ON "OpportunityProjectLink"("opportunityId", "projectId");

-- CreateIndex
CREATE INDEX "MarketGap_userId_idx" ON "MarketGap"("userId");

-- CreateIndex
CREATE INDEX "MarketGap_sector_idx" ON "MarketGap"("sector");

-- CreateIndex
CREATE INDEX "MarketGap_competitionLevel_idx" ON "MarketGap"("competitionLevel");

-- CreateIndex
CREATE INDEX "MarketGap_createdAt_idx" ON "MarketGap"("createdAt");

-- CreateIndex
CREATE INDEX "MarketGapVariant_marketGapId_idx" ON "MarketGapVariant"("marketGapId");

-- CreateIndex
CREATE INDEX "MarketGapProjectLink_projectId_idx" ON "MarketGapProjectLink"("projectId");

-- CreateIndex
CREATE INDEX "MarketGapProjectLink_marketGapId_idx" ON "MarketGapProjectLink"("marketGapId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketGapProjectLink_projectId_marketGapVariantId_key" ON "MarketGapProjectLink"("projectId", "marketGapVariantId");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Conversation_projectId_idx" ON "Conversation"("projectId");

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "LearnTask_projectId_idx" ON "LearnTask"("projectId");

-- CreateIndex
CREATE INDEX "LearnTask_completed_idx" ON "LearnTask"("completed");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardAnswer" ADD CONSTRAINT "WizardAnswer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersion" ADD CONSTRAINT "ProjectVersion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViabilityScore" ADD CONSTRAINT "ViabilityScore_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationFinding" ADD CONSTRAINT "EvaluationFinding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskMatrix" ADD CONSTRAINT "RiskMatrix_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedArtifact" ADD CONSTRAINT "GeneratedArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMapping" ADD CONSTRAINT "TemplateMapping_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildArtifact" ADD CONSTRAINT "BuildArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLevel" ADD CONSTRAINT "CourseLevel_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "CourseLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "CourseLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityProjectLink" ADD CONSTRAINT "OpportunityProjectLink_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketGapVariant" ADD CONSTRAINT "MarketGapVariant_marketGapId_fkey" FOREIGN KEY ("marketGapId") REFERENCES "MarketGap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketGapProjectLink" ADD CONSTRAINT "MarketGapProjectLink_marketGapId_fkey" FOREIGN KEY ("marketGapId") REFERENCES "MarketGap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketGapProjectLink" ADD CONSTRAINT "MarketGapProjectLink_marketGapVariantId_fkey" FOREIGN KEY ("marketGapVariantId") REFERENCES "MarketGapVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
