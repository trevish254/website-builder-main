-- ==============================================================================
-- FIX DASHBOARD RLS POLICIES
-- Run this script in your Supabase SQL Editor to resolve RLS violations.
-- ==============================================================================

-- 1. Grant Permissions to Authenticated Users
GRANT ALL ON "Dashboard" TO authenticated;
GRANT ALL ON "DashboardCard" TO authenticated;
GRANT ALL ON "DashboardShare" TO authenticated;
GRANT ALL ON "DashboardTemplate" TO authenticated;

GRANT SELECT ON "DashboardTemplate" TO anon;

-- 2. Enable RLS (Idempotent)
ALTER TABLE "Dashboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardShare" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardTemplate" ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL Existing Policies
DROP POLICY IF EXISTS "Users can view own dashboards" ON "Dashboard";
DROP POLICY IF EXISTS "Users can view shared dashboards" ON "Dashboard";
DROP POLICY IF EXISTS "Users can create own dashboards" ON "Dashboard";
DROP POLICY IF EXISTS "Users can update own dashboards" ON "Dashboard";
DROP POLICY IF EXISTS "Users can update shared dashboards with edit permission" ON "Dashboard";
DROP POLICY IF EXISTS "Users can delete own dashboards" ON "Dashboard";

DROP POLICY IF EXISTS "Users can view own dashboard cards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can view shared dashboard cards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can create cards in own dashboards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can update cards in own dashboards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can update cards in shared dashboards with edit permission" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can delete cards from own dashboards" ON "DashboardCard";

DROP POLICY IF EXISTS "Users can view shares for own dashboards" ON "DashboardShare";
DROP POLICY IF EXISTS "Users can view own share records" ON "DashboardShare";
DROP POLICY IF EXISTS "Users can create shares for own dashboards" ON "DashboardShare";
DROP POLICY IF EXISTS "Users can delete shares from own dashboards" ON "DashboardShare";

DROP POLICY IF EXISTS "Anyone can view public templates" ON "DashboardTemplate";

-- 4. Re-create Policies

-- TABLE: Dashboard
-- SELECT
CREATE POLICY "Users can view own dashboards" ON "Dashboard"
FOR SELECT USING (
  auth.uid()::text = "userId"
);

CREATE POLICY "Users can view shared dashboards" ON "Dashboard"
FOR SELECT USING (
  auth.uid()::text IN (
    SELECT "sharedWithUserId" FROM "DashboardShare" WHERE "dashboardId" = "Dashboard"."id"
  )
);

-- INSERT
CREATE POLICY "Users can create own dashboards" ON "Dashboard"
FOR INSERT WITH CHECK (
  auth.uid()::text = "userId"
);

-- UPDATE
CREATE POLICY "Users can update own dashboards" ON "Dashboard"
FOR UPDATE USING (
  auth.uid()::text = "userId"
);

CREATE POLICY "Users can update shared dashboards with edit permission" ON "Dashboard"
FOR UPDATE USING (
  auth.uid()::text IN (
    SELECT "sharedWithUserId" FROM "DashboardShare" 
    WHERE "dashboardId" = "Dashboard"."id" AND "permission" = 'edit'
  )
);

-- DELETE
CREATE POLICY "Users can delete own dashboards" ON "Dashboard"
FOR DELETE USING (
  auth.uid()::text = "userId"
);

-- TABLE: DashboardCard
-- SELECT
CREATE POLICY "Users can view own dashboard cards" ON "DashboardCard"
FOR SELECT USING (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can view shared dashboard cards" ON "DashboardCard"
FOR SELECT USING (
  "dashboardId" IN (
    SELECT "dashboardId" FROM "DashboardShare" WHERE "sharedWithUserId" = auth.uid()::text
  )
);

-- INSERT
CREATE POLICY "Users can create cards in own dashboards" ON "DashboardCard"
FOR INSERT WITH CHECK (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

-- UPDATE
CREATE POLICY "Users can update cards in own dashboards" ON "DashboardCard"
FOR UPDATE USING (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can update cards in shared dashboards with edit permission" ON "DashboardCard"
FOR UPDATE USING (
  "dashboardId" IN (
    SELECT "dashboardId" FROM "DashboardShare" 
    WHERE "sharedWithUserId" = auth.uid()::text AND "permission" = 'edit'
  )
);

-- DELETE
CREATE POLICY "Users can delete cards from own dashboards" ON "DashboardCard"
FOR DELETE USING (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

-- TABLE: DashboardShare
-- SELECT
CREATE POLICY "Users can view shares for own dashboards" ON "DashboardShare"
FOR SELECT USING (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

CREATE POLICY "Users can view own share records" ON "DashboardShare"
FOR SELECT USING (
  auth.uid()::text = "sharedWithUserId"
);

-- INSERT
CREATE POLICY "Users can create shares for own dashboards" ON "DashboardShare"
FOR INSERT WITH CHECK (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

-- DELETE
CREATE POLICY "Users can delete shares from own dashboards" ON "DashboardShare"
FOR DELETE USING (
  "dashboardId" IN (
    SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
  )
);

-- TABLE: DashboardTemplate
-- SELECT
CREATE POLICY "Anyone can view public templates" ON "DashboardTemplate"
FOR SELECT USING (
  "isPublic" = true
);
