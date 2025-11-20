-- Create SubAccountEmployee Table for Subaccount Management
-- Copy and paste this entire script into your Supabase SQL Editor

-- First, create the EmployeeRole enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EmployeeRole') THEN
        CREATE TYPE "EmployeeRole" AS ENUM ('CEO', 'CTO', 'CDO', 'MANAGER', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'SUPPORT', 'OTHER');
    END IF;
END $$;

-- Drop the table if it exists (to avoid conflicts)
DROP TABLE IF EXISTS "SubAccountEmployee" CASCADE;

-- Create the SubAccountEmployee table
CREATE TABLE "SubAccountEmployee" (
    "id" TEXT NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "permissions" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SubAccountEmployee_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SubAccountEmployee_userId_subAccountId_unique" UNIQUE ("userId", "subAccountId")
);

-- Create indexes for better performance
CREATE INDEX "SubAccountEmployee_subAccountId_idx" ON "SubAccountEmployee"("subAccountId");
CREATE INDEX "SubAccountEmployee_userId_idx" ON "SubAccountEmployee"("userId");
CREATE INDEX "SubAccountEmployee_role_idx" ON "SubAccountEmployee"("role");
CREATE INDEX "SubAccountEmployee_isActive_idx" ON "SubAccountEmployee"("isActive");
CREATE INDEX "SubAccountEmployee_assignedAt_idx" ON "SubAccountEmployee"("assignedAt");

-- Add foreign key constraints
ALTER TABLE "SubAccountEmployee" ADD CONSTRAINT "SubAccountEmployee_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountEmployee" ADD CONSTRAINT "SubAccountEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security
ALTER TABLE "SubAccountEmployee" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view employee assignments for their subaccounts" ON "SubAccountEmployee"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountEmployee"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can assign employees to their subaccounts" ON "SubAccountEmployee"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountEmployee"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update employee assignments in their subaccounts" ON "SubAccountEmployee"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountEmployee"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can remove employee assignments from their subaccounts" ON "SubAccountEmployee"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountEmployee"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

-- Add comments for documentation
COMMENT ON TABLE "SubAccountEmployee" IS 'Links existing team members to subaccounts with roles';
COMMENT ON COLUMN "SubAccountEmployee"."userId" IS 'Reference to existing User/team member';
COMMENT ON COLUMN "SubAccountEmployee"."role" IS 'Role/position for this subaccount';
COMMENT ON COLUMN "SubAccountEmployee"."assignedAt" IS 'When the employee was assigned to this subaccount';
COMMENT ON COLUMN "SubAccountEmployee"."isActive" IS 'Whether the assignment is currently active';
COMMENT ON COLUMN "SubAccountEmployee"."permissions" IS 'Array of specific permissions for this subaccount';
COMMENT ON COLUMN "SubAccountEmployee"."notes" IS 'Additional notes about the assignment';

-- Success message
SELECT 'SubAccountEmployee table created successfully!' as message;
