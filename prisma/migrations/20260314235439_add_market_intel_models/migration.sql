-- CreateEnum
CREATE TYPE "MarketIntelType" AS ENUM ('TREND', 'SECTOR_INSIGHT', 'STARTUP_DATA', 'DEMAND_INDICATOR');

-- CreateTable
CREATE TABLE "MarketIntelItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MarketIntelType" NOT NULL,
    "summary" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "signals" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "region" TEXT,
    "timeframe" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketIntelItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResearchItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "marketIntelId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectResearchItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketIntelItem_userId_idx" ON "MarketIntelItem"("userId");

-- CreateIndex
CREATE INDEX "MarketIntelItem_type_idx" ON "MarketIntelItem"("type");

-- CreateIndex
CREATE INDEX "MarketIntelItem_sector_idx" ON "MarketIntelItem"("sector");

-- CreateIndex
CREATE INDEX "MarketIntelItem_confidence_idx" ON "MarketIntelItem"("confidence");

-- CreateIndex
CREATE INDEX "ProjectResearchItem_projectId_idx" ON "ProjectResearchItem"("projectId");

-- CreateIndex
CREATE INDEX "ProjectResearchItem_marketIntelId_idx" ON "ProjectResearchItem"("marketIntelId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectResearchItem_projectId_marketIntelId_key" ON "ProjectResearchItem"("projectId", "marketIntelId");

-- AddForeignKey
ALTER TABLE "ProjectResearchItem" ADD CONSTRAINT "ProjectResearchItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResearchItem" ADD CONSTRAINT "ProjectResearchItem_marketIntelId_fkey" FOREIGN KEY ("marketIntelId") REFERENCES "MarketIntelItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
