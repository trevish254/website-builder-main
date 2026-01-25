-- Migration to fix missing meeting fields and enable fetching
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to Meetings table if they don't exist
-- We use TEXT for conversationId to match the Conversation table
ALTER TABLE "Meetings" ADD COLUMN IF NOT EXISTS "conversationId" TEXT REFERENCES "Conversation"(id) ON DELETE CASCADE;
-- We use UUID for recipientId to match auth.users(id)
ALTER TABLE "Meetings" ADD COLUMN IF NOT EXISTS "recipientId" UUID REFERENCES auth.users(id);

-- 2. Create indexes for faster fetching
CREATE INDEX IF NOT EXISTS idx_meetings_conversation ON "Meetings"("conversationId");
CREATE INDEX IF NOT EXISTS idx_meetings_recipient ON "Meetings"("recipientId");
CREATE INDEX IF NOT EXISTS idx_meetings_sender ON "Meetings"("senderId");

-- 3. Update RLS policies to allow participants to view meetings
-- We use ::text casting to ensure compatibility between UUID and TEXT types

DROP POLICY IF EXISTS "Users can view meetings they are part of" ON "Meetings";
CREATE POLICY "Users can view meetings they are part of" ON "Meetings"
  FOR SELECT USING (
    auth.uid()::text = "senderId"::text OR 
    auth.uid()::text = "recipientId"::text OR
    EXISTS (
      SELECT 1 FROM "ConversationParticipant"
      WHERE "ConversationParticipant"."conversationId" = "Meetings"."conversationId"
      AND "ConversationParticipant"."userId"::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can insert meetings" ON "Meetings";
CREATE POLICY "Users can insert meetings" ON "Meetings"
  FOR INSERT WITH CHECK (auth.uid()::text = "senderId"::text);

DROP POLICY IF EXISTS "Users can update their meetings" ON "Meetings";
CREATE POLICY "Users can update their meetings" ON "Meetings"
  FOR UPDATE USING (auth.uid()::text = "senderId"::text);

DROP POLICY IF EXISTS "Users can delete their meetings" ON "Meetings";
CREATE POLICY "Users can delete their meetings" ON "Meetings"
  FOR DELETE USING (auth.uid()::text = "senderId"::text);
