-- Create ENUMs if they don't exist (using DO block to handle existence check)
DO $$ BEGIN
    CREATE TYPE "ClientDocType" AS ENUM ('AGREEMENT', 'WELCOME', 'INVOICE', 'CLIENT_PORTAL', 'STRATEGY_CALL', 'FULFILLMENT', 'CONTENT_USAGE_GUIDE', 'MONTHLY_REPORT', 'COMPETITOR_ANALYSIS', 'THANK_YOU', 'FEEDBACK_REQUEST', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ClientDocStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'PAID', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create ClientDoc table
CREATE TABLE IF NOT EXISTS "ClientDoc" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(), -- ID is UUID
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB, -- Stores Editor.js data
    "type" "ClientDocType" NOT NULL DEFAULT 'CUSTOM',
    "status" "ClientDocStatus" NOT NULL DEFAULT 'DRAFT',
    "agencyId" TEXT NOT NULL, -- CHANGED FROM UUID TO TEXT TO MATCH AGENCY TABLE
    "subAccountId" TEXT, -- CHANGED FROM UUID TO TEXT TO MATCH SUBACCOUNT TABLE
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDoc_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientDoc_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClientDoc_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "ClientDoc_agencyId_idx" ON "ClientDoc"("agencyId");
CREATE INDEX IF NOT EXISTS "ClientDoc_subAccountId_idx" ON "ClientDoc"("subAccountId");

-- Row Level Security (RLS)
ALTER TABLE "ClientDoc" ENABLE ROW LEVEL SECURITY;

-- Policies (Updated to correctness check User table for agency membership)
-- We check if the authenticated user (auth.uid()) exists in the User table 
-- AND has the same agencyId as the document.

-- Explicitly casting auth.uid() to text for ALL policies

CREATE POLICY "Agency members can view their client docs"
ON "ClientDoc"
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "User"
        WHERE "User"."id" = auth.uid()::text
        AND "User"."agencyId" = "ClientDoc"."agencyId"
    )
);

CREATE POLICY "Agency members can insert client docs"
ON "ClientDoc"
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "User"
        WHERE "User"."id" = auth.uid()::text
        AND "User"."agencyId" = "ClientDoc"."agencyId"
    )
);

CREATE POLICY "Agency members can update their client docs"
ON "ClientDoc"
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM "User"
        WHERE "User"."id" = auth.uid()::text
        AND "User"."agencyId" = "ClientDoc"."agencyId"
    )
);

CREATE POLICY "Agency members can delete their client docs"
ON "ClientDoc"
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM "User"
        WHERE "User"."id" = auth.uid()::text
        AND "User"."agencyId" = "ClientDoc"."agencyId"
    )
);
