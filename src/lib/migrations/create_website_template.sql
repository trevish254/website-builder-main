-- Migration: Create WebsiteTemplate Table
-- This migration creates the WebsiteTemplate table for storing reusable website templates

-- Create WebsiteTemplate Table
CREATE TABLE IF NOT EXISTS "WebsiteTemplate" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail" TEXT,
  "category" TEXT DEFAULT 'General',
  "content" JSONB, -- Full project JSON or Page JSON
  "isPublic" BOOLEAN DEFAULT false,
  "createdBy" TEXT, -- User ID who created the template
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE "WebsiteTemplate" ENABLE ROW LEVEL SECURITY;

-- Allow reading Public Templates
CREATE POLICY "Read Public Templates" ON "WebsiteTemplate"
  FOR SELECT
  USING ("isPublic" = true);

-- Allow users to create templates
CREATE POLICY "Create Templates" ON "WebsiteTemplate"
  FOR INSERT
  WITH CHECK (auth.uid()::text IS NOT NULL);

-- Allow users to manage their own templates
CREATE POLICY "Manage Own Templates" ON "WebsiteTemplate"
  FOR ALL
  USING ("createdBy" = auth.uid()::text);
