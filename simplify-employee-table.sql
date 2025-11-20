-- Simplify the SubAccountEmployee table by making role optional with a default
-- This removes potential RLS conflicts with enum values

-- First, let's check if the table exists and update it
DO $$ 
BEGIN
    -- Check if the table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'SubAccountEmployee') THEN
        -- Make role column have a default value and allow NULL
        ALTER TABLE "SubAccountEmployee" 
        ALTER COLUMN "role" SET DEFAULT 'MEMBER',
        ALTER COLUMN "role" DROP NOT NULL;
        
        -- Update any existing NULL roles to 'MEMBER'
        UPDATE "SubAccountEmployee" 
        SET "role" = 'MEMBER' 
        WHERE "role" IS NULL;
        
        RAISE NOTICE 'SubAccountEmployee table updated successfully';
    ELSE
        RAISE NOTICE 'SubAccountEmployee table does not exist';
    END IF;
END $$;

-- Alternative: If you want to completely remove the role column
-- Uncomment the following lines if you want to remove the role field entirely:

-- ALTER TABLE "SubAccountEmployee" DROP COLUMN IF EXISTS "role";

-- This creates a very simple table structure:
-- id, subAccountId, userId, assignedAt, isActive, createdAt, updatedAt
