ALTER TABLE "SubAccount" ADD COLUMN IF NOT EXISTS "subAccountType" text DEFAULT 'AGENCY';
ALTER TABLE "SubAccount" ADD COLUMN IF NOT EXISTS "companyName" text;
