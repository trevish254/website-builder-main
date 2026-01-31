-- Create AgencyTeam table
CREATE TABLE IF NOT EXISTS "AgencyTeam" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "agencyId" TEXT NOT NULL REFERENCES "Agency"("id") ON DELETE CASCADE,
  "subAccountId" TEXT REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "icon" TEXT,
  "color" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create AgencyTeamMember table
CREATE TABLE IF NOT EXISTS "AgencyTeamMember" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "teamId" TEXT NOT NULL REFERENCES "AgencyTeam"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "isLeader" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE("teamId", "userId")
);

-- Add teamId to Task table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Task' AND column_name = 'teamId') THEN
        ALTER TABLE "Task" ADD COLUMN "teamId" TEXT REFERENCES "AgencyTeam"("id") ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE "AgencyTeam" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AgencyTeamMember" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view teams in their agency" ON "AgencyTeam"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."agencyId" = "AgencyTeam"."agencyId"
      AND "User"."id" = auth.uid()
    )
  );

CREATE POLICY "Admin/Owners can manage teams" ON "AgencyTeam"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User"
      WHERE "User"."agencyId" = "AgencyTeam"."agencyId"
      AND "User"."id" = auth.uid()
      AND ("User"."role" = 'AGENCY_OWNER' OR "User"."role" = 'AGENCY_ADMIN')
    )
  );

CREATE POLICY "Users can view team members" ON "AgencyTeamMember"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "AgencyTeam"
      JOIN "User" ON "User"."agencyId" = "AgencyTeam"."agencyId"
      WHERE "AgencyTeam"."id" = "AgencyTeamMember"."teamId"
      AND "User"."id" = auth.uid()
    )
  );

CREATE POLICY "Admin/Owners can manage team members" ON "AgencyTeamMember"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "AgencyTeam"
      JOIN "User" ON "User"."agencyId" = "AgencyTeam"."agencyId"
      WHERE "AgencyTeam"."id" = "AgencyTeamMember"."teamId"
      AND "User"."id" = auth.uid()
      AND ("User"."role" = 'AGENCY_OWNER' OR "User"."role" = 'AGENCY_ADMIN')
    )
  );

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_agency_team_agency ON "AgencyTeam"("agencyId");
CREATE INDEX IF NOT EXISTS idx_agency_team_member_team ON "AgencyTeamMember"("teamId");
CREATE INDEX IF NOT EXISTS idx_agency_team_member_user ON "AgencyTeamMember"("userId");
CREATE INDEX IF NOT EXISTS idx_task_team ON "Task"("teamId");
