-- Complete SQL Schema for Group Chat Management
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Conversations table (Groups and DMs)
CREATE TABLE IF NOT EXISTS "Conversation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "type" TEXT CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  "title" TEXT, -- Group name (null for DMs)
  "description" TEXT, -- Group description
  "iconUrl" TEXT, -- Group icon URL
  "createdBy" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create ConversationParticipants table (Many-to-Many)
CREATE TABLE IF NOT EXISTS "ConversationParticipant" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "conversationId" TEXT REFERENCES "Conversation"(id) ON DELETE CASCADE,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "role" TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "lastReadAt" TIMESTAMP WITH TIME ZONE,
  UNIQUE("conversationId", "userId")
);

-- 4. Update Meetings table to reference conversations
ALTER TABLE "Meetings" 
ADD COLUMN IF NOT EXISTS "conversationId" TEXT REFERENCES "Conversation"(id) ON DELETE CASCADE;

-- 5. Enable Row Level Security
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConversationParticipant" ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Conversation
-- Users can view conversations they're part of
CREATE POLICY "Users can view their conversations" ON "Conversation"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "ConversationParticipant"
      WHERE "ConversationParticipant"."conversationId" = "Conversation"."id"
      AND "ConversationParticipant"."userId" = auth.uid()
    )
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations" ON "Conversation"
  FOR INSERT WITH CHECK (auth.uid() = "createdBy");

-- Only group admins can update conversations
CREATE POLICY "Admins can update conversations" ON "Conversation"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM "ConversationParticipant"
      WHERE "ConversationParticipant"."conversationId" = "Conversation"."id"
      AND "ConversationParticipant"."userId" = auth.uid()
      AND "ConversationParticipant"."role" = 'admin'
    )
  );

-- Only group admins can delete conversations
CREATE POLICY "Admins can delete conversations" ON "Conversation"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM "ConversationParticipant"
      WHERE "ConversationParticipant"."conversationId" = "Conversation"."id"
      AND "ConversationParticipant"."userId" = auth.uid()
      AND "ConversationParticipant"."role" = 'admin'
    )
  );

-- 7. RLS Policies for ConversationParticipant
-- Users can view participants of conversations they're in
CREATE POLICY "Users can view conversation participants" ON "ConversationParticipant"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "ConversationParticipant" cp
      WHERE cp."conversationId" = "ConversationParticipant"."conversationId"
      AND cp."userId" = auth.uid()
    )
  );

-- Admins can add participants
CREATE POLICY "Admins can add participants" ON "ConversationParticipant"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ConversationParticipant"
      WHERE "ConversationParticipant"."conversationId" = "conversationId"
      AND "ConversationParticipant"."userId" = auth.uid()
      AND "ConversationParticipant"."role" = 'admin'
    )
  );

-- Users can remove themselves, admins can remove anyone
CREATE POLICY "Users can leave, admins can remove" ON "ConversationParticipant"
  FOR DELETE USING (
    "userId" = auth.uid() OR
    EXISTS (
      SELECT 1 FROM "ConversationParticipant" cp
      WHERE cp."conversationId" = "ConversationParticipant"."conversationId"
      AND cp."userId" = auth.uid()
      AND cp."role" = 'admin'
    )
  );

-- 8. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_conversation_type ON "Conversation"("type");
CREATE INDEX IF NOT EXISTS idx_conversation_created_by ON "Conversation"("createdBy");
CREATE INDEX IF NOT EXISTS idx_participant_conversation ON "ConversationParticipant"("conversationId");
CREATE INDEX IF NOT EXISTS idx_participant_user ON "ConversationParticipant"("userId");
CREATE INDEX IF NOT EXISTS idx_meetings_conversation ON "Meetings"("conversationId");

-- 9. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE "Conversation";
ALTER PUBLICATION supabase_realtime ADD TABLE "ConversationParticipant";

-- 10. Create function to auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_updated_at BEFORE UPDATE ON "Conversation"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
