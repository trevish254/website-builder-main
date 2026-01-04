-- Final Schema Update for Enhanced Product Details
-- This script ensures the Supabase database matches the ProductFormSchema and new UI features

ALTER TABLE "Product" 
-- Inventory Management Fields
ADD COLUMN IF NOT EXISTS "stockQuantity" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "minOrder" INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS "maxOrder" INTEGER,
ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER DEFAULT 5,

-- Categorization & Variants
ADD COLUMN IF NOT EXISTS "brand" TEXT,
ADD COLUMN IF NOT EXISTS "category" TEXT,
ADD COLUMN IF NOT EXISTS "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],

-- Custom Attributes
ADD COLUMN IF NOT EXISTS "customAttributes" JSONB DEFAULT '[]'::jsonb,

-- Shipping Configuration
ADD COLUMN IF NOT EXISTS "shippingDelivery" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "shippingInternational" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "shippingArrival" TEXT,

-- Payment & Tax Info
ADD COLUMN IF NOT EXISTS "paymentTaxInfo" TEXT,
ADD COLUMN IF NOT EXISTS "paymentTerms" TEXT;

-- Create Indexes for improved searching and filtering
CREATE INDEX IF NOT EXISTS "Product_brand_idx" ON "Product"("brand");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
CREATE INDEX IF NOT EXISTS "Product_active_idx" ON "Product"("active");
