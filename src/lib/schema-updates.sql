-- Add coverImage column to Task table
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;

-- Add priority column to Task table (defaulting to 'Medium')
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "priority" TEXT DEFAULT 'Medium';

-- Create TaskComment table for task comments
CREATE TABLE IF NOT EXISTS "TaskComment" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "content" TEXT NOT NULL,
  "taskId" TEXT REFERENCES "Task"("id") ON DELETE CASCADE NOT NULL,
  "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for TaskComment
CREATE INDEX IF NOT EXISTS "TaskComment_taskId_idx" ON "TaskComment"("taskId");

-- Enable RLS for TaskComment
ALTER TABLE "TaskComment" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for TaskComment
-- RLS Policies for TaskComment
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'View comments'
        AND polrelid = '"TaskComment"'::regclass
    ) THEN
        CREATE POLICY "View comments" ON "TaskComment" FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'Manage comments'
        AND polrelid = '"TaskComment"'::regclass
    ) THEN
        CREATE POLICY "Manage comments" ON "TaskComment" FOR ALL USING (true);
    END IF;
END
$$;
