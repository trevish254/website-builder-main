-- Enable RLS on Inventory Tables (Safe to run if already enabled)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InventoryLog" ENABLE ROW LEVEL SECURITY;

-- Product Policies
DROP POLICY IF EXISTS "Agency owners and subaccount users can view products" ON "Product";
CREATE POLICY "Agency owners and subaccount users can view products" ON "Product" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Agency owners and subaccount users can create products" ON "Product";
CREATE POLICY "Agency owners and subaccount users can create products" ON "Product" FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Agency owners and subaccount admin can update products" ON "Product";
CREATE POLICY "Agency owners and subaccount admin can update products" ON "Product" FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Agency owners and subaccount admin can delete products" ON "Product";
CREATE POLICY "Agency owners and subaccount admin can delete products" ON "Product" FOR DELETE USING (true);

-- ProductVariant Policies
DROP POLICY IF EXISTS "View Variants" ON "ProductVariant";
CREATE POLICY "View Variants" ON "ProductVariant" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Create Variants" ON "ProductVariant";
CREATE POLICY "Create Variants" ON "ProductVariant" FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Update Variants" ON "ProductVariant";
CREATE POLICY "Update Variants" ON "ProductVariant" FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Delete Variants" ON "ProductVariant";
CREATE POLICY "Delete Variants" ON "ProductVariant" FOR DELETE USING (true);

-- InventoryLog Policies
DROP POLICY IF EXISTS "View Logs" ON "InventoryLog";
CREATE POLICY "View Logs" ON "InventoryLog" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Create Logs" ON "InventoryLog";
CREATE POLICY "Create Logs" ON "InventoryLog" FOR INSERT WITH CHECK (true);
