-- Create Website Table
CREATE TABLE IF NOT EXISTS "Website" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "subAccountId" TEXT NOT NULL REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "published" BOOLEAN DEFAULT false,
  "domain" TEXT UNIQUE,
  "favicon" TEXT,
  "settings" JSONB DEFAULT '{}', -- Global settings (colors, fonts)
  "customHead" TEXT, -- Global custom head code
  "customBody" TEXT, -- Global custom body code
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create WebsitePage Table
CREATE TABLE IF NOT EXISTS "WebsitePage" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "websiteId" UUID NOT NULL REFERENCES "Website"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "pathName" TEXT DEFAULT 'index',
  "content" JSONB, -- Stores GrapeJS Project Data (components, styles, assets)
  "previewImage" TEXT,
  "order" INTEGER DEFAULT 0,
  "customHead" TEXT, -- Page-specific head code
  "customBody" TEXT, -- Page-specific body code
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE("websiteId", "pathName")
);

-- Create WebsiteTemplate Table
-- Stores reusable templates (public or private)
CREATE TABLE IF NOT EXISTS "WebsiteTemplate" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail" TEXT,
  "category" TEXT DEFAULT 'General',
  "content" JSONB, -- Full project JSON or Page JSON
  "isPublic" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Note: Assets are assumed to be stored in the existing 'Media' table.

-- Enable RLS
ALTER TABLE "Website" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebsitePage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebsiteTemplate" ENABLE ROW LEVEL SECURITY;

-- Policies (Example: SubAccount access)
-- Note: Adjust these if your Permission table schema differs.

-- Allow Users with access to the SubAccount to view/edit Websites
CREATE POLICY "Access Websites for SubAccount" ON "Website"
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

-- Allow access to Pages if user can access Website
CREATE POLICY "Access Website Pages" ON "WebsitePage"
  FOR ALL
  USING (
    "websiteId" IN (
        SELECT "id" FROM "Website"
    )
  );

-- Allow reading Public Templates
CREATE POLICY "Read Public Templates" ON "WebsiteTemplate"
  FOR SELECT
  USING ("isPublic" = true);
