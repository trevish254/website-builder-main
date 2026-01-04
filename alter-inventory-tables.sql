-- Add new columns for detailed product filtering
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "brand" TEXT,
ADD COLUMN IF NOT EXISTS "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "category" TEXT;

-- Create index for filtering performance
CREATE INDEX IF NOT EXISTS "Product_brand_idx" ON "Product"("brand");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
