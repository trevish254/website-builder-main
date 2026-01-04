-- Add customAttributes column to Product table
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "customAttributes" JSONB DEFAULT '[]'::jsonb;
