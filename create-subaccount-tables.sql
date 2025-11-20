-- Additional tables for enhanced subaccount management
-- Based on the client management interface requirements

-- CreateEnum for report status
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'IN_REVIEW');

-- CreateEnum for employee roles
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

-- SubAccount Files table
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

-- SubAccount Employees table
CREATE TABLE "SubAccountEmployee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "EmployeeRole" NOT NULL,
    "avatarUrl" TEXT,
    "hireDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,

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

CREATE INDEX "SubAccountFile_subAccountId_idx" ON "SubAccountFile"("subAccountId");
CREATE INDEX "SubAccountFile_uploadedBy_idx" ON "SubAccountFile"("uploadedBy");

CREATE INDEX "SubAccountEmployee_subAccountId_idx" ON "SubAccountEmployee"("subAccountId");
CREATE INDEX "SubAccountEmployee_email_idx" ON "SubAccountEmployee"("email");

CREATE INDEX "SubAccountReport_subAccountId_idx" ON "SubAccountReport"("subAccountId");
CREATE INDEX "SubAccountReport_assignedTo_idx" ON "SubAccountReport"("assignedTo");
CREATE INDEX "SubAccountReport_createdBy_idx" ON "SubAccountReport"("createdBy");

-- Add foreign key constraints
ALTER TABLE "SubAccountNote" ADD CONSTRAINT "SubAccountNote_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountNote" ADD CONSTRAINT "SubAccountNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubAccountFile" ADD CONSTRAINT "SubAccountFile_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountFile" ADD CONSTRAINT "SubAccountFile_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubAccountEmployee" ADD CONSTRAINT "SubAccountEmployee_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubAccountReport" ADD CONSTRAINT "SubAccountReport_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubAccountReport" ADD CONSTRAINT "SubAccountReport_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "SubAccountEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SubAccountReport" ADD CONSTRAINT "SubAccountReport_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
