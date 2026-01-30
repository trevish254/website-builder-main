-- Create Email Campaign Table
CREATE TABLE IF NOT EXISTS "EmailCampaign" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "subAccountId" TEXT NOT NULL REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "subject" TEXT,
  "description" TEXT,
  "content" JSONB, -- Stores Editor Project Data
  "htmlContent" TEXT, -- Exported HTML for sending
  "previewImage" TEXT,
  "status" TEXT DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, SENT
  "scheduledAt" TIMESTAMP WITH TIME ZONE,
  "sentAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Email Template Table
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail" TEXT,
  "category" TEXT DEFAULT 'General',
  "content" JSONB, -- Editor JSON
  "isPublic" BOOLEAN DEFAULT false,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE "EmailCampaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailTemplate" ENABLE ROW LEVEL SECURITY;

-- Policies (Dropped before creation to avoid "already exists" errors)

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Access Email Campaigns for SubAccount" ON "EmailCampaign";
    DROP POLICY IF EXISTS "Read Public Email Templates" ON "EmailTemplate";
    DROP POLICY IF EXISTS "Manage Own Email Templates" ON "EmailTemplate";
END $$;

-- Create Policies
CREATE POLICY "Access Email Campaigns for SubAccount" ON "EmailCampaign"
  FOR ALL
  USING (
    "subAccountId" IN (
        SELECT "subAccountId" 
        FROM "Permissions" 
        WHERE "email" = auth.jwt() ->> 'email' 
        AND "access" = true
    )
    OR
    "subAccountId" IN (
        SELECT "id" 
        FROM "SubAccount" 
        WHERE "agencyId" IN (
            SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()::text AND "role" IN ('AGENCY_OWNER', 'AGENCY_ADMIN')
        )
    )
  );

CREATE POLICY "Read Public Email Templates" ON "EmailTemplate"
  FOR SELECT
  USING ("isPublic" = true);

CREATE POLICY "Manage Own Email Templates" ON "EmailTemplate"
  FOR ALL
  USING ("createdBy" = auth.uid()::text);
