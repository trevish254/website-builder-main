-- ==============================================================================
-- FIX RLS INFINITE RECURSION
-- Run this script in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Create Helper Function to Break Recursion
-- This function runs with elevated privileges (SECURITY DEFINER) to check ownership
-- without triggering the RLS policies on the Dashboard table again.
CREATE OR REPLACE FUNCTION get_dashboard_userid(dashboard_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT "userId" FROM "Dashboard" WHERE id = dashboard_id;
$$;

-- 2. Update DashboardShare Policies to use the function
DROP POLICY IF EXISTS "Users can view shares for own dashboards" ON "DashboardShare";
CREATE POLICY "Users can view shares for own dashboards" ON "DashboardShare"
FOR SELECT USING (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

DROP POLICY IF EXISTS "Users can create shares for own dashboards" ON "DashboardShare";
CREATE POLICY "Users can create shares for own dashboards" ON "DashboardShare"
FOR INSERT WITH CHECK (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

DROP POLICY IF EXISTS "Users can delete shares from own dashboards" ON "DashboardShare";
CREATE POLICY "Users can delete shares from own dashboards" ON "DashboardShare"
FOR DELETE USING (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

-- 3. Update DashboardCard Policies to use the function
-- (These also caused recursion by looking up Dashboard ownership)
DROP POLICY IF EXISTS "Users can view own dashboard cards" ON "DashboardCard";
CREATE POLICY "Users can view own dashboard cards" ON "DashboardCard"
FOR SELECT USING (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

DROP POLICY IF EXISTS "Users can create cards in own dashboards" ON "DashboardCard";
CREATE POLICY "Users can create cards in own dashboards" ON "DashboardCard"
FOR INSERT WITH CHECK (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

DROP POLICY IF EXISTS "Users can update cards in own dashboards" ON "DashboardCard";
CREATE POLICY "Users can update cards in own dashboards" ON "DashboardCard"
FOR UPDATE USING (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

DROP POLICY IF EXISTS "Users can delete cards from own dashboards" ON "DashboardCard";
CREATE POLICY "Users can delete cards from own dashboards" ON "DashboardCard"
FOR DELETE USING (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);

-- 4. Clean up other potential recursive policies
-- DashboardCard INSERT policy for checking ownership
DROP POLICY IF EXISTS "Users can create cards in own dashboards" ON "DashboardCard";
CREATE POLICY "Users can create cards in own dashboards" ON "DashboardCard"
FOR INSERT WITH CHECK (
  auth.uid()::text = get_dashboard_userid("dashboardId")
);
