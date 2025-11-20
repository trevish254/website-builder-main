-- Enhanced Subaccount Management System Database Schema
-- Run this SQL script in your Supabase database to create all necessary tables

-- CreateEnum for report status
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'IN_REVIEW');

-- CreateEnum for employee roles (keeping existing ones)
CREATE TYPE "EmployeeRole" AS ENUM ('CEO', 'CTO', 'CDO', 'MANAGER', 'DEVELOPER', 'DESIGNER', 'SALES', 'MARKETING', 'SUPPORT', 'OTHER');

-- CreateEnum for file types
CREATE TYPE "FileType" AS ENUM ('DOCUMENT', 'IMAGE', 'VIDEO', 'AUDIO', 'SPREADSHEET', 'PRESENTATION', 'PDF', 'OTHER');

-- SubAccount Notes table
CREATE TABLE "SubAccountNote" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SubAccountNote_pkey" PRIMARY KEY ("id")
);

-- SubAccount Files table (using UploadThing URLs)
CREATE TABLE "SubAccountFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,

    CONSTRAINT "SubAccountFile_pkey" PRIMARY KEY ("id")
);

-- SubAccount Employee Assignments (linking existing team members to subaccounts)
CREATE TABLE "SubAccountEmployee" (
    "id" TEXT NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubAccountEmployee_pkey" PRIMARY KEY ("id")
);

-- SubAccount Reports table
CREATE TABLE "SubAccountReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "SubAccountReport_pkey" PRIMARY KEY ("id")
);

-- Create indexes for better performance
CREATE INDEX "SubAccountNote_subAccountId_idx" ON "SubAccountNote"("subAccountId");
CREATE INDEX "SubAccountNote_userId_idx" ON "SubAccountNote"("userId");
CREATE INDEX "SubAccountNote_createdAt_idx" ON "SubAccountNote"("createdAt");

CREATE INDEX "SubAccountFile_subAccountId_idx" ON "SubAccountFile"("subAccountId");
CREATE INDEX "SubAccountFile_uploadedBy_idx" ON "SubAccountFile"("uploadedBy");
CREATE INDEX "SubAccountFile_type_idx" ON "SubAccountFile"("type");
CREATE INDEX "SubAccountFile_createdAt_idx" ON "SubAccountFile"("createdAt");

CREATE INDEX "SubAccountEmployee_subAccountId_idx" ON "SubAccountEmployee"("subAccountId");
CREATE INDEX "SubAccountEmployee_userId_idx" ON "SubAccountEmployee"("userId");
CREATE INDEX "SubAccountEmployee_role_idx" ON "SubAccountEmployee"("role");
CREATE INDEX "SubAccountEmployee_isActive_idx" ON "SubAccountEmployee"("isActive");

CREATE INDEX "SubAccountReport_subAccountId_idx" ON "SubAccountReport"("subAccountId");
CREATE INDEX "SubAccountReport_assignedTo_idx" ON "SubAccountReport"("assignedTo");
CREATE INDEX "SubAccountReport_createdBy_idx" ON "SubAccountReport"("createdBy");
CREATE INDEX "SubAccountReport_status_idx" ON "SubAccountReport"("status");
CREATE INDEX "SubAccountReport_dueDate_idx" ON "SubAccountReport"("dueDate");

-- Add foreign key constraints
ALTER TABLE "SubAccountNote" ADD CONSTRAINT "SubAccountNote_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountNote" ADD CONSTRAINT "SubAccountNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubAccountFile" ADD CONSTRAINT "SubAccountFile_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountFile" ADD CONSTRAINT "SubAccountFile_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubAccountEmployee" ADD CONSTRAINT "SubAccountEmployee_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountEmployee" ADD CONSTRAINT "SubAccountEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubAccountReport" ADD CONSTRAINT "SubAccountReport_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountReport" ADD CONSTRAINT "SubAccountReport_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "SubAccountEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SubAccountReport" ADD CONSTRAINT "SubAccountReport_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE "SubAccountNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubAccountFile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubAccountEmployee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubAccountReport" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for SubAccountNote
CREATE POLICY "Users can view notes for their subaccounts" ON "SubAccountNote"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountNote"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create notes for their subaccounts" ON "SubAccountNote"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountNote"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update their own notes" ON "SubAccountNote"
    FOR UPDATE USING (
        "userId" = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountNote"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete their own notes" ON "SubAccountNote"
    FOR DELETE USING (
        "userId" = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountNote"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

-- Create RLS policies for SubAccountFile
CREATE POLICY "Users can view files for their subaccounts" ON "SubAccountFile"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountFile"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can upload files to their subaccounts" ON "SubAccountFile"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountFile"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete files they uploaded" ON "SubAccountFile"
    FOR DELETE USING (
        "uploadedBy" = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountFile"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

-- Create RLS policies for SubAccountEmployee
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

-- Create RLS policies for SubAccountReport
CREATE POLICY "Users can view reports for their subaccounts" ON "SubAccountReport"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountReport"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create reports for their subaccounts" ON "SubAccountReport"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountReport"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update reports they created" ON "SubAccountReport"
    FOR UPDATE USING (
        "createdBy" = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountReport"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete reports they created" ON "SubAccountReport"
    FOR DELETE USING (
        "createdBy" = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "SubAccount" 
            WHERE "SubAccount"."id" = "SubAccountReport"."subAccountId" 
            AND "SubAccount"."agencyId" IN (
                SELECT "agencyId" FROM "User" WHERE "id" = auth.uid()
            )
        )
    );

-- Add comments for documentation
COMMENT ON TABLE "SubAccountNote" IS 'Stores notes and comments for subaccounts';
COMMENT ON TABLE "SubAccountFile" IS 'Stores file attachments for subaccounts using UploadThing URLs';
COMMENT ON TABLE "SubAccountEmployee" IS 'Links existing team members to subaccounts with roles';
COMMENT ON TABLE "SubAccountReport" IS 'Stores reports and documents for subaccounts';

COMMENT ON COLUMN "SubAccountNote"."title" IS 'Title of the note';
COMMENT ON COLUMN "SubAccountNote"."content" IS 'Content/body of the note';
COMMENT ON COLUMN "SubAccountFile"."type" IS 'Type of file (document, image, video, etc.)';
COMMENT ON COLUMN "SubAccountFile"."size" IS 'File size in bytes';
COMMENT ON COLUMN "SubAccountFile"."url" IS 'UploadThing URL for the file';
COMMENT ON COLUMN "SubAccountEmployee"."userId" IS 'Reference to existing User/team member';
COMMENT ON COLUMN "SubAccountEmployee"."role" IS 'Role/position for this subaccount';
COMMENT ON COLUMN "SubAccountEmployee"."assignedAt" IS 'When the employee was assigned to this subaccount';
COMMENT ON COLUMN "SubAccountReport"."status" IS 'Current status of the report';
COMMENT ON COLUMN "SubAccountReport"."assignedTo" IS 'Employee assignment ID for this report';

-- Success message
SELECT 'Subaccount management tables created successfully!' as message;
