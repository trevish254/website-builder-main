-- Add missing createdBy column to WebsiteTemplate table
ALTER TABLE "WebsiteTemplate" 
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

-- Update the RLS policy to use the new column (drop and recreate)
DROP POLICY IF EXISTS "Manage Own Templates" ON "WebsiteTemplate";

CREATE POLICY "Manage Own Templates" ON "WebsiteTemplate"
  FOR ALL
  USING ("createdBy" = auth.uid()::text);
