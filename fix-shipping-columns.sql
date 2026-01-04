-- Database Correction Script
-- Changes shippingDelivery and shippingInternational from BOOLEAN to TEXT to support delivery time strings

-- First, drop the existing columns if they were created as Booleans (to avoid type conflicts)
ALTER TABLE "Product" DROP COLUMN IF EXISTS "shippingDelivery";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "shippingInternational";

-- Now add them back as TEXT
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "shippingDelivery" TEXT,
ADD COLUMN IF NOT EXISTS "shippingInternational" TEXT,
ADD COLUMN IF NOT EXISTS "shippingArrival" TEXT,
ADD COLUMN IF NOT EXISTS "paymentTaxInfo" TEXT,
ADD COLUMN IF NOT EXISTS "paymentTerms" TEXT;

-- Re-establish any other missing columns from previous steps just in case
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "stockQuantity" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "minOrder" INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS "maxOrder" INTEGER,
ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS "brand" TEXT,
ADD COLUMN IF NOT EXISTS "category" TEXT,
ADD COLUMN IF NOT EXISTS "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "customAttributes" JSONB DEFAULT '[]'::jsonb;
