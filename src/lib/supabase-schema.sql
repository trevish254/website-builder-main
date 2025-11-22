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
