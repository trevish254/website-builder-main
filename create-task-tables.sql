-- Create TaskBoard table
CREATE TABLE IF NOT EXISTS "TaskBoard" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "agencyId" TEXT REFERENCES "Agency"("id") ON DELETE CASCADE,
  "subAccountId" TEXT REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create TaskLane table
CREATE TABLE IF NOT EXISTS "TaskLane" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "boardId" TEXT NOT NULL REFERENCES "TaskBoard"("id") ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  "color" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Task table
CREATE TABLE IF NOT EXISTS "Task" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT, -- Can store JSON string or HTML
  "laneId" TEXT NOT NULL REFERENCES "TaskLane"("id") ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  "assignedUserId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "dueDate" TIMESTAMP(3),
  "tags" TEXT[], -- Array of strings for tags
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "idx_taskboard_agency" ON "TaskBoard"("agencyId");
CREATE INDEX IF NOT EXISTS "idx_taskboard_subaccount" ON "TaskBoard"("subAccountId");
CREATE INDEX IF NOT EXISTS "idx_tasklane_board" ON "TaskLane"("boardId");
CREATE INDEX IF NOT EXISTS "idx_task_lane" ON "Task"("laneId");
CREATE INDEX IF NOT EXISTS "idx_task_assigned_user" ON "Task"("assignedUserId");
