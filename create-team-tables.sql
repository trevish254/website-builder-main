-- Add Teams and Team Members for Collaboration
CREATE TABLE IF NOT EXISTS "Team" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "agencyId" TEXT NOT NULL,
    "color" TEXT DEFAULT '#3b82f6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Team_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "TeamUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "teamId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamUser_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TeamUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
    CONSTRAINT "TeamUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE("teamId", "userId")
);

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE "Team";
ALTER PUBLICATION supabase_realtime ADD TABLE "TeamUser";

-- Add RLS Policies
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamUser" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency members can view teams" ON "Team"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid() 
            AND "User"."agencyId" = "Team"."agencyId"
        )
    );

CREATE POLICY "Agency owners can manage teams" ON "Team"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid() 
            AND "User"."agencyId" = "Team"."agencyId"
            AND ("User"."role" = 'AGENCY_OWNER' OR "User"."role" = 'AGENCY_ADMIN')
        )
    );

CREATE POLICY "Agency members can view team users" ON "TeamUser"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Team"
            JOIN "User" ON "User"."agencyId" = "Team"."agencyId"
            WHERE "Team"."id" = "TeamUser"."teamId"
            AND "User"."id" = auth.uid()
        )
    );
