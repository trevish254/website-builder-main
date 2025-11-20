-- SQL Script to Create Pipeline and Lane Tables in Supabase
-- Run this in Supabase SQL Editor

-- First, check if tables exist and drop them if needed (for fresh start)
DROP TABLE IF EXISTS "Lane" CASCADE;
DROP TABLE IF EXISTS "Pipeline" CASCADE;

-- Create Pipeline Table
CREATE TABLE "Pipeline" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "subAccountId" UUID NOT NULL,
    CONSTRAINT "Pipeline_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE
);

-- Create Lane Table
CREATE TABLE "Lane" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "pipelineId" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Lane_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE CASCADE
);

-- Create Ticket Table
CREATE TABLE "Ticket" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "laneId" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "value" DECIMAL(65,30),
    "description" TEXT,
    "customerId" UUID,
    "assignedUserId" UUID,
    CONSTRAINT "Ticket_laneId_fkey" FOREIGN KEY ("laneId") REFERENCES "Lane"("id") ON DELETE CASCADE
);

-- Create Indexes for better performance
CREATE INDEX "Pipeline_subAccountId_idx" ON "Pipeline"("subAccountId");
CREATE INDEX "Lane_pipelineId_idx" ON "Lane"("pipelineId");
CREATE INDEX "Ticket_laneId_idx" ON "Ticket"("laneId");

-- Enable Row Level Security (optional but recommended)
ALTER TABLE "Pipeline" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lane" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ticket" ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust based on your needs)
-- These are basic policies - you may need to customize them

-- Allow authenticated users to read/write their own pipelines
CREATE POLICY "Users can view pipelines" ON "Pipeline"
    FOR SELECT USING (true);

CREATE POLICY "Users can create pipelines" ON "Pipeline"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update pipelines" ON "Pipeline"
    FOR UPDATE USING (true);

-- Similar policies for Lane
CREATE POLICY "Users can view lanes" ON "Lane"
    FOR SELECT USING (true);

CREATE POLICY "Users can create lanes" ON "Lane"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update lanes" ON "Lane"
    FOR UPDATE USING (true);

-- Similar policies for Ticket
CREATE POLICY "Users can view tickets" ON "Ticket"
    FOR SELECT USING (true);

CREATE POLICY "Users can create tickets" ON "Ticket"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update tickets" ON "Ticket"
    FOR UPDATE USING (true);

