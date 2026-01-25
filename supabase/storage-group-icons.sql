-- Create Storage Bucket for Group Icons
-- Run this in your Supabase SQL Editor or Dashboard

-- 1. Create the bucket (if using SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('group-icons', 'group-icons', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS policies for the bucket
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload group icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'group-icons');

-- Allow public read access
CREATE POLICY "Public can view group icons"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'group-icons');

-- Allow group admins to update/delete their group icons
CREATE POLICY "Group admins can update group icons"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'group-icons');

CREATE POLICY "Group admins can delete group icons"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'group-icons');

-- Note: You can also create this bucket via the Supabase Dashboard:
-- 1. Go to Storage in your Supabase project
-- 2. Click "New Bucket"
-- 3. Name it "group-icons"
-- 4. Make it Public
-- 5. The RLS policies above will handle permissions
