-- Inventory Management System Tables

-- Product Table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subAccountId" TEXT NOT NULL,
    "paystackProductId" TEXT, -- To sync with Paystack
    "type" TEXT NOT NULL DEFAULT 'PRODUCT', -- 'PRODUCT' or 'SERVICE'
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Variants for products (e.g., Size, Color)
CREATE TABLE IF NOT EXISTS "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL, -- e.g., "Size"
    "value" TEXT NOT NULL, -- e.g., "Large"
    "priceOverride" DECIMAL(12,2), -- Optional price for this variant
    "stock" INTEGER NOT NULL DEFAULT 0, -- Current stock level
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- Inventory Logs for tracking stock changes
CREATE TABLE IF NOT EXISTS "InventoryLog" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "changeAmount" INTEGER NOT NULL, -- positive for restock, negative for sale/loss
    "reason" TEXT, -- e.g., "Sale", "Restock", "Refund"
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Product_subAccountId_idx" ON "Product"("subAccountId");
CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX IF NOT EXISTS "InventoryLog_variantId_idx" ON "InventoryLog"("variantId");

-- Add foreign key constraints
ALTER TABLE "Product" 
ADD CONSTRAINT "Product_subAccountId_fkey" 
FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductVariant" 
ADD CONSTRAINT "ProductVariant_productId_fkey" 
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InventoryLog" 
ADD CONSTRAINT "InventoryLog_variantId_fkey" 
FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Link Transactions to Products and Variants
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "productId" TEXT;
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "variantId" TEXT;
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "quantity" INTEGER DEFAULT 1;

ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_productId_fkey" 
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Transaction" 
ADD CONSTRAINT "Transaction_variantId_fkey" 
FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
