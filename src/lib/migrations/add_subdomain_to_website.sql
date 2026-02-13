-- Migration: Add subdomain column to Website table
-- This column is used for the generated {siteName}.{idPart}.localhost:3000 structure

ALTER TABLE "Website" ADD COLUMN IF NOT EXISTS "subdomain" TEXT UNIQUE;

-- Optional: If you want to index it for faster lookups (getWebsiteByDomain)
CREATE INDEX IF NOT EXISTS "Website_subdomain_idx" ON "Website"("subdomain");
