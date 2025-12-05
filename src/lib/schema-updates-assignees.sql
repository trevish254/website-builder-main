-- Create TaskAssignee table for many-to-many relationship
CREATE TABLE IF NOT EXISTS "TaskAssignee" (
  "taskId" TEXT NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY ("taskId", "userId")
);

-- Add RLS policies for TaskAssignee
ALTER TABLE "TaskAssignee" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'Agency owners and admins can manage task assignees'
        AND polrelid = '"TaskAssignee"'::regclass
    ) THEN
        CREATE POLICY "Agency owners and admins can manage task assignees" ON "TaskAssignee"
          FOR ALL
          USING (
            EXISTS (
              SELECT 1 FROM "Task" t
              JOIN "TaskLane" l ON l.id = t."laneId"
              JOIN "TaskBoard" b ON b.id = l."boardId"
              WHERE t.id = "TaskAssignee"."taskId"
              AND (
                b."agencyId" IN (
                  SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()::text AND "role" IN ('AGENCY_OWNER', 'AGENCY_ADMIN')
                )
                OR
                b."subAccountId" IN (
                  SELECT "subAccountId" FROM "Permissions" WHERE "email" = auth.email() AND "access" = true
                )
              )
            )
          );
    END IF;
END
$$;
