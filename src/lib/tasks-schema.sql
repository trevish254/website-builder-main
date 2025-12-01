-- Create TaskBoard Table
CREATE TABLE IF NOT EXISTS "TaskBoard" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "agencyId" TEXT REFERENCES "Agency"("id") ON DELETE CASCADE,
  "subAccountId" TEXT REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create TaskLane Table
CREATE TABLE IF NOT EXISTS "TaskLane" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "boardId" UUID REFERENCES "TaskBoard"("id") ON DELETE CASCADE NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  "color" TEXT DEFAULT '#000000',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Task Table
CREATE TABLE IF NOT EXISTS "Task" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "laneId" UUID REFERENCES "TaskLane"("id") ON DELETE CASCADE NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  "assignedUserId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "dueDate" TIMESTAMP WITH TIME ZONE,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS "TaskBoard_subAccountId_idx" ON "TaskBoard"("subAccountId");
CREATE INDEX IF NOT EXISTS "TaskLane_boardId_idx" ON "TaskLane"("boardId");
CREATE INDEX IF NOT EXISTS "Task_laneId_idx" ON "Task"("laneId");
CREATE INDEX IF NOT EXISTS "Task_assignedUserId_idx" ON "Task"("assignedUserId");

-- Enable Row Level Security (RLS)
ALTER TABLE "TaskBoard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskLane" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic examples, adjust as needed)
-- Allow access to boards based on subaccount access (simplified)
CREATE POLICY "View boards" ON "TaskBoard"
    FOR SELECT USING (true); -- Replace with actual subaccount permission check

CREATE POLICY "Manage boards" ON "TaskBoard"
    FOR ALL USING (true); -- Replace with actual permission check

CREATE POLICY "View lanes" ON "TaskLane"
    FOR SELECT USING (true);

CREATE POLICY "Manage lanes" ON "TaskLane"
    FOR ALL USING (true);

CREATE POLICY "View tasks" ON "Task"
    FOR SELECT USING (true);

CREATE POLICY "Manage tasks" ON "Task"
    FOR ALL USING (true);
