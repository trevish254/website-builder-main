-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Create ClientDocComment table
CREATE TABLE IF NOT EXISTS "ClientDocComment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documentId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "anchorRange" JSONB, -- Stores start/end of highlighted text if any
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "parentId" UUID, -- For threaded replies
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDocComment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientDocComment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ClientDoc"("id") ON DELETE CASCADE,
    CONSTRAINT "ClientDocComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "ClientDocComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ClientDocComment"("id") ON DELETE SET NULL
);

-- Create ClientDocVersion table
CREATE TABLE IF NOT EXISTS "ClientDocVersion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documentId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT, -- Optional name for the version
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDocVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientDocVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ClientDoc"("id") ON DELETE CASCADE,
    CONSTRAINT "ClientDocVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create ClientDocPermission table (Overrides)
CREATE TABLE IF NOT EXISTS "ClientDocPermission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documentId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL, -- 'viewer', 'commenter', 'editor', 'manager'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDocPermission_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientDocPermission_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ClientDoc"("id") ON DELETE CASCADE,
    CONSTRAINT "ClientDocPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE("documentId", "userId")
);

-- Enable RLS for all new tables
ALTER TABLE "ClientDocComment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClientDocVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClientDocPermission" ENABLE ROW LEVEL SECURITY;

-- Policies for ClientDocComment
CREATE POLICY "Users can view comments on accessible documents"
ON "ClientDocComment" FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "ClientDoc"
        WHERE "ClientDoc"."id" = "ClientDocComment"."documentId"
        -- Link to Agency/SubAccount access check
    )
);

CREATE POLICY "Users can insert comments on accessible documents"
ON "ClientDocComment" FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "ClientDoc"
        WHERE "ClientDoc"."id" = "ClientDocComment"."documentId"
    )
);

-- Enable Realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE "ClientDoc";
ALTER PUBLICATION supabase_realtime ADD TABLE "ClientDocComment";
ALTER PUBLICATION supabase_realtime ADD TABLE "ClientDocVersion";
