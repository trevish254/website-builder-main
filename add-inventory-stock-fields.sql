-- Add new columns for detailed stock management
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "stockQuantity" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "minOrder" INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS "maxOrder" INTEGER,
ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER DEFAULT 5;

-- Optional: Add index if we plan to filter by low stock often
-- CREATE INDEX IF NOT EXISTS "Product_stockQuantity_idx" ON "Product"("stockQuantity");
