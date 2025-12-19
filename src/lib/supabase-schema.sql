-- Create Enum Types (Check if they exist first to avoid errors if re-running)
DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'TRANSFER', 'C2B', 'B2C', 'B2B', 'STK_PUSH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MpesaEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Wallet Table
CREATE TABLE IF NOT EXISTS "Wallet" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "agencyId" TEXT REFERENCES "Agency"("id") ON DELETE CASCADE,
  "subAccountId" TEXT REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "balance" DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  "currency" TEXT DEFAULT 'KES' NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "Wallet_agencyId_key" UNIQUE ("agencyId"),
  CONSTRAINT "Wallet_subAccountId_key" UNIQUE ("subAccountId"),
  CONSTRAINT "Wallet_owner_check" CHECK (
    ("agencyId" IS NOT NULL AND "subAccountId" IS NULL) OR
    ("agencyId" IS NULL AND "subAccountId" IS NOT NULL)
  )
);

-- Create Transaction Table
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "walletId" UUID REFERENCES "Wallet"("id") ON DELETE CASCADE NOT NULL,
  "amount" DECIMAL(15, 2) NOT NULL,
  "type" "TransactionType" NOT NULL,
  "status" "TransactionStatus" DEFAULT 'PENDING' NOT NULL,
  "reference" TEXT, -- MPESA Receipt or Internal Ref
  "phoneNumber" TEXT,
  "description" TEXT,
  "metadata" JSONB DEFAULT '{}'::JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create MpesaSettings Table
CREATE TABLE IF NOT EXISTS "MpesaSettings" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "agencyId" TEXT REFERENCES "Agency"("id") ON DELETE CASCADE,
  "subAccountId" TEXT REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "shortCode" TEXT NOT NULL,
  "consumerKey" TEXT NOT NULL,
  "consumerSecret" TEXT NOT NULL,
  "passkey" TEXT,
  "environment" "MpesaEnvironment" DEFAULT 'SANDBOX' NOT NULL,
  "callbackUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "MpesaSettings_agencyId_key" UNIQUE ("agencyId"),
  CONSTRAINT "MpesaSettings_subAccountId_key" UNIQUE ("subAccountId"),
  CONSTRAINT "MpesaSettings_owner_check" CHECK (
    ("agencyId" IS NOT NULL AND "subAccountId" IS NULL) OR
    ("agencyId" IS NULL AND "subAccountId" IS NOT NULL)
  )
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS "Transaction_walletId_idx" ON "Transaction"("walletId");
CREATE INDEX IF NOT EXISTS "Transaction_reference_idx" ON "Transaction"("reference");
CREATE INDEX IF NOT EXISTS "Transaction_status_idx" ON "Transaction"("status");

-- RLS Policies
ALTER TABLE "Wallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MpesaSettings" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own agency/subaccount wallet
-- Fix: Cast auth.uid() to text because User.id is text
CREATE POLICY "View own wallet" ON "Wallet"
  FOR SELECT USING (
    auth.uid()::text IN (
      SELECT "id" FROM "User" WHERE "agencyId" = "Wallet"."agencyId"
    )
  );

-- ============================================
-- Dashboard Management System Tables
-- ============================================

-- Create Dashboard Table
CREATE TABLE IF NOT EXISTS "Dashboard" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE NOT NULL,
  "agencyId" TEXT REFERENCES "Agency"("id") ON DELETE CASCADE,
  "subAccountId" TEXT REFERENCES "SubAccount"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isDefault" BOOLEAN DEFAULT false NOT NULL,
  "isPrivate" BOOLEAN DEFAULT true NOT NULL,
  "isFavorite" BOOLEAN DEFAULT false NOT NULL,
  "lastAccessedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- Ensure dashboard belongs to either agency or subaccount, not both
  CONSTRAINT "Dashboard_scope_check" CHECK (
    ("agencyId" IS NOT NULL AND "subAccountId" IS NULL) OR
    ("agencyId" IS NULL AND "subAccountId" IS NOT NULL) OR
    ("agencyId" IS NULL AND "subAccountId" IS NULL)
  )
);

-- Create DashboardCard Table
CREATE TABLE IF NOT EXISTS "DashboardCard" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "dashboardId" UUID REFERENCES "Dashboard"("id") ON DELETE CASCADE NOT NULL,
  "cardType" TEXT NOT NULL, -- 'graph', 'list', 'count', 'tasks', 'finance', 'performance', 'time', 'funnel', etc.
  "positionX" INTEGER DEFAULT 0 NOT NULL,
  "positionY" INTEGER DEFAULT 0 NOT NULL,
  "width" INTEGER DEFAULT 4 NOT NULL,
  "height" INTEGER DEFAULT 4 NOT NULL,
  "config" JSONB DEFAULT '{}'::JSONB, -- Card-specific configuration
  "order" INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create DashboardShare Table
CREATE TABLE IF NOT EXISTS "DashboardShare" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "dashboardId" UUID REFERENCES "Dashboard"("id") ON DELETE CASCADE NOT NULL,
  "sharedWithUserId" TEXT REFERENCES "User"("id") ON DELETE CASCADE NOT NULL,
  "permission" TEXT DEFAULT 'view' NOT NULL, -- 'view' or 'edit'
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "DashboardShare_permission_check" CHECK ("permission" IN ('view', 'edit')),
  -- Prevent duplicate shares
  CONSTRAINT "DashboardShare_unique" UNIQUE ("dashboardId", "sharedWithUserId")
);

-- Create DashboardTemplate Table
CREATE TABLE IF NOT EXISTS "DashboardTemplate" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL, -- 'analytics', 'tasks', 'finance', 'performance', 'general'
  "layout" JSONB DEFAULT '[]'::JSONB, -- Array of card configurations
  "isPublic" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Indexes for Dashboard Tables
CREATE INDEX IF NOT EXISTS "Dashboard_userId_idx" ON "Dashboard"("userId");
CREATE INDEX IF NOT EXISTS "Dashboard_agencyId_idx" ON "Dashboard"("agencyId");
CREATE INDEX IF NOT EXISTS "Dashboard_subAccountId_idx" ON "Dashboard"("subAccountId");
CREATE INDEX IF NOT EXISTS "Dashboard_isDefault_idx" ON "Dashboard"("isDefault");
CREATE INDEX IF NOT EXISTS "Dashboard_isFavorite_idx" ON "Dashboard"("isFavorite");
CREATE INDEX IF NOT EXISTS "Dashboard_lastAccessedAt_idx" ON "Dashboard"("lastAccessedAt");

CREATE INDEX IF NOT EXISTS "DashboardCard_dashboardId_idx" ON "DashboardCard"("dashboardId");
CREATE INDEX IF NOT EXISTS "DashboardCard_cardType_idx" ON "DashboardCard"("cardType");
CREATE INDEX IF NOT EXISTS "DashboardCard_order_idx" ON "DashboardCard"("order");

CREATE INDEX IF NOT EXISTS "DashboardShare_dashboardId_idx" ON "DashboardShare"("dashboardId");
CREATE INDEX IF NOT EXISTS "DashboardShare_sharedWithUserId_idx" ON "DashboardShare"("sharedWithUserId");

CREATE INDEX IF NOT EXISTS "DashboardTemplate_category_idx" ON "DashboardTemplate"("category");
CREATE INDEX IF NOT EXISTS "DashboardTemplate_isPublic_idx" ON "DashboardTemplate"("isPublic");

-- Enable RLS for Dashboard Tables
ALTER TABLE "Dashboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardShare" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardTemplate" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Dashboard
-- Users can view their own dashboards
CREATE POLICY "Users can view own dashboards" ON "Dashboard"
  FOR SELECT USING (
    auth.uid()::text = "userId"
  );

-- Users can view dashboards shared with them
CREATE POLICY "Users can view shared dashboards" ON "Dashboard"
  FOR SELECT USING (
    auth.uid()::text IN (
      SELECT "sharedWithUserId" FROM "DashboardShare" WHERE "dashboardId" = "Dashboard"."id"
    )
  );

-- Users can insert their own dashboards
CREATE POLICY "Users can create own dashboards" ON "Dashboard"
  FOR INSERT WITH CHECK (
    auth.uid()::text = "userId"
  );

-- Users can update their own dashboards
CREATE POLICY "Users can update own dashboards" ON "Dashboard"
  FOR UPDATE USING (
    auth.uid()::text = "userId"
  );

-- Users can update dashboards shared with edit permission
CREATE POLICY "Users can update shared dashboards with edit permission" ON "Dashboard"
  FOR UPDATE USING (
    auth.uid()::text IN (
      SELECT "sharedWithUserId" FROM "DashboardShare" 
      WHERE "dashboardId" = "Dashboard"."id" AND "permission" = 'edit'
    )
  );

-- Users can delete their own dashboards
CREATE POLICY "Users can delete own dashboards" ON "Dashboard"
  FOR DELETE USING (
    auth.uid()::text = "userId"
  );

-- RLS Policies for DashboardCard
-- Users can view cards from their own dashboards
CREATE POLICY "Users can view own dashboard cards" ON "DashboardCard"
  FOR SELECT USING (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- Users can view cards from shared dashboards
CREATE POLICY "Users can view shared dashboard cards" ON "DashboardCard"
  FOR SELECT USING (
    "dashboardId" IN (
      SELECT "dashboardId" FROM "DashboardShare" WHERE "sharedWithUserId" = auth.uid()::text
    )
  );

-- Users can insert cards to their own dashboards
CREATE POLICY "Users can create cards in own dashboards" ON "DashboardCard"
  FOR INSERT WITH CHECK (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- Users can update cards in their own dashboards
CREATE POLICY "Users can update cards in own dashboards" ON "DashboardCard"
  FOR UPDATE USING (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- Users can update cards in shared dashboards with edit permission
CREATE POLICY "Users can update cards in shared dashboards with edit permission" ON "DashboardCard"
  FOR UPDATE USING (
    "dashboardId" IN (
      SELECT "dashboardId" FROM "DashboardShare" 
      WHERE "sharedWithUserId" = auth.uid()::text AND "permission" = 'edit'
    )
  );

-- Users can delete cards from their own dashboards
CREATE POLICY "Users can delete cards from own dashboards" ON "DashboardCard"
  FOR DELETE USING (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- RLS Policies for DashboardShare
-- Users can view shares for their own dashboards
CREATE POLICY "Users can view shares for own dashboards" ON "DashboardShare"
  FOR SELECT USING (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- Users can view their own share records
CREATE POLICY "Users can view own share records" ON "DashboardShare"
  FOR SELECT USING (
    auth.uid()::text = "sharedWithUserId"
  );

-- Users can create shares for their own dashboards
CREATE POLICY "Users can create shares for own dashboards" ON "DashboardShare"
  FOR INSERT WITH CHECK (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- Users can delete shares from their own dashboards
CREATE POLICY "Users can delete shares from own dashboards" ON "DashboardShare"
  FOR DELETE USING (
    "dashboardId" IN (
      SELECT "id" FROM "Dashboard" WHERE "userId" = auth.uid()::text
    )
  );

-- RLS Policies for DashboardTemplate
-- Everyone can view public templates
CREATE POLICY "Anyone can view public templates" ON "DashboardTemplate"
  FOR SELECT USING (
    "isPublic" = true
  );
