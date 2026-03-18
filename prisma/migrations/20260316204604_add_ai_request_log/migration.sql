-- CreateTable
CREATE TABLE "AIRequestLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "taskType" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "routingReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIRequestLog_userId_idx" ON "AIRequestLog"("userId");

-- CreateIndex
CREATE INDEX "AIRequestLog_projectId_idx" ON "AIRequestLog"("projectId");

-- CreateIndex
CREATE INDEX "AIRequestLog_taskType_idx" ON "AIRequestLog"("taskType");

-- CreateIndex
CREATE INDEX "AIRequestLog_provider_idx" ON "AIRequestLog"("provider");

-- CreateIndex
CREATE INDEX "AIRequestLog_createdAt_idx" ON "AIRequestLog"("createdAt");

-- CreateIndex
CREATE INDEX "AIRequestLog_success_idx" ON "AIRequestLog"("success");
