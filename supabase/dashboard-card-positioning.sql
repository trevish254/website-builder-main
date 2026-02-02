-- =====================================================
-- Dashboard Card Position Management Schema
-- =====================================================
-- This migration ensures clean, accurate card positioning
-- with no overlaps or jumping behavior
-- =====================================================

-- First, ensure the DashboardCard table exists with proper structure
CREATE TABLE IF NOT EXISTS "DashboardCard" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "dashboardId" UUID NOT NULL REFERENCES "Dashboard"(id) ON DELETE CASCADE,
    "cardType" TEXT NOT NULL,
    "positionX" INTEGER NOT NULL DEFAULT 0,
    "positionY" INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 4,
    config JSONB DEFAULT '{}'::jsonb,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for fast dashboard card lookups
CREATE INDEX IF NOT EXISTS idx_dashboard_card_dashboard_id 
ON "DashboardCard"("dashboardId");

-- Composite index for position-based queries (collision detection)
CREATE INDEX IF NOT EXISTS idx_dashboard_card_position 
ON "DashboardCard"("dashboardId", "positionX", "positionY");

-- Index for ordering cards
CREATE INDEX IF NOT EXISTS idx_dashboard_card_order 
ON "DashboardCard"("dashboardId", "order");

-- Index for card type filtering
CREATE INDEX IF NOT EXISTS idx_dashboard_card_type 
ON "DashboardCard"("cardType");

-- =====================================================
-- CONSTRAINTS FOR DATA INTEGRITY
-- =====================================================

-- Ensure position values are non-negative
ALTER TABLE "DashboardCard" 
DROP CONSTRAINT IF EXISTS check_position_x_non_negative;

ALTER TABLE "DashboardCard" 
ADD CONSTRAINT check_position_x_non_negative 
CHECK ("positionX" >= 0);

ALTER TABLE "DashboardCard" 
DROP CONSTRAINT IF EXISTS check_position_y_non_negative;

ALTER TABLE "DashboardCard" 
ADD CONSTRAINT check_position_y_non_negative 
CHECK ("positionY" >= 0);

-- Ensure width and height are positive
ALTER TABLE "DashboardCard" 
DROP CONSTRAINT IF EXISTS check_width_positive;

ALTER TABLE "DashboardCard" 
ADD CONSTRAINT check_width_positive 
CHECK (width > 0 AND width <= 12);

ALTER TABLE "DashboardCard" 
DROP CONSTRAINT IF EXISTS check_height_positive;

ALTER TABLE "DashboardCard" 
ADD CONSTRAINT check_height_positive 
CHECK (height > 0 AND height <= 20);

-- Ensure order is non-negative
ALTER TABLE "DashboardCard" 
DROP CONSTRAINT IF EXISTS check_order_non_negative;

ALTER TABLE "DashboardCard" 
ADD CONSTRAINT check_order_non_negative 
CHECK ("order" >= 0);

-- =====================================================
-- TRIGGER FOR AUTO-UPDATING updatedAt
-- =====================================================

-- Function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_dashboard_card_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_dashboard_card_updated_at ON "DashboardCard";

-- Create trigger
CREATE TRIGGER trigger_update_dashboard_card_updated_at
    BEFORE UPDATE ON "DashboardCard"
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_card_updated_at();

-- =====================================================
-- FUNCTION: Detect Card Overlaps
-- =====================================================
-- This function checks if a card overlaps with any existing cards
-- Returns TRUE if there's an overlap, FALSE otherwise

CREATE OR REPLACE FUNCTION check_card_overlap(
    p_dashboard_id UUID,
    p_card_id UUID,
    p_x INTEGER,
    p_y INTEGER,
    p_width INTEGER,
    p_height INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO overlap_count
    FROM "DashboardCard"
    WHERE "dashboardId" = p_dashboard_id
      AND id != COALESCE(p_card_id, '00000000-0000-0000-0000-000000000000'::UUID)
      AND (
          -- Check for rectangle overlap
          p_x < ("positionX" + width) AND
          (p_x + p_width) > "positionX" AND
          p_y < ("positionY" + height) AND
          (p_y + p_height) > "positionY"
      );
    
    RETURN overlap_count > 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Find Next Available Position
-- =====================================================
-- This function finds the next available position for a card
-- Returns a JSON object with x and y coordinates

CREATE OR REPLACE FUNCTION find_next_available_position(
    p_dashboard_id UUID,
    p_width INTEGER DEFAULT 4,
    p_height INTEGER DEFAULT 4,
    p_max_cols INTEGER DEFAULT 12
)
RETURNS JSON AS $$
DECLARE
    test_x INTEGER := 0;
    test_y INTEGER := 0;
    has_overlap BOOLEAN;
    max_y INTEGER;
BEGIN
    -- Get the maximum Y position to start searching from
    SELECT COALESCE(MAX("positionY" + height), 0)
    INTO max_y
    FROM "DashboardCard"
    WHERE "dashboardId" = p_dashboard_id;
    
    -- Start searching from y = 0
    test_y := 0;
    
    -- Loop until we find a free spot
    LOOP
        test_x := 0;
        
        -- Try each column in the current row
        WHILE test_x + p_width <= p_max_cols LOOP
            -- Check if this position has any overlap
            SELECT check_card_overlap(
                p_dashboard_id,
                NULL,
                test_x,
                test_y,
                p_width,
                p_height
            ) INTO has_overlap;
            
            -- If no overlap, we found our spot!
            IF NOT has_overlap THEN
                RETURN json_build_object('x', test_x, 'y', test_y);
            END IF;
            
            test_x := test_x + 1;
        END LOOP;
        
        -- Move to next row
        test_y := test_y + 1;
        
        -- Safety check to prevent infinite loops
        IF test_y > max_y + 100 THEN
            -- Return position at the bottom
            RETURN json_build_object('x', 0, 'y', max_y + 1);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Compact Dashboard Layout
-- =====================================================
-- This function removes gaps in the dashboard layout
-- by moving cards upward when possible

CREATE OR REPLACE FUNCTION compact_dashboard_layout(
    p_dashboard_id UUID
)
RETURNS VOID AS $$
DECLARE
    card_record RECORD;
    new_y INTEGER;
    can_move BOOLEAN;
BEGIN
    -- Process cards from top to bottom, left to right
    FOR card_record IN
        SELECT id, "positionX", "positionY", width, height
        FROM "DashboardCard"
        WHERE "dashboardId" = p_dashboard_id
        ORDER BY "positionY", "positionX"
    LOOP
        -- Try to move the card upward
        new_y := card_record."positionY";
        
        -- Keep trying to move up until we hit an obstacle
        WHILE new_y > 0 LOOP
            -- Check if we can move to new_y - 1
            SELECT NOT check_card_overlap(
                p_dashboard_id,
                card_record.id,
                card_record."positionX",
                new_y - 1,
                card_record.width,
                card_record.height
            ) INTO can_move;
            
            IF can_move THEN
                new_y := new_y - 1;
            ELSE
                EXIT;
            END IF;
        END LOOP;
        
        -- Update the card position if it changed
        IF new_y != card_record."positionY" THEN
            UPDATE "DashboardCard"
            SET "positionY" = new_y
            WHERE id = card_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on DashboardCard table
ALTER TABLE "DashboardCard" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view cards from their dashboards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can insert cards to their dashboards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can update cards in their dashboards" ON "DashboardCard";
DROP POLICY IF EXISTS "Users can delete cards from their dashboards" ON "DashboardCard";

-- Policy: Users can view cards from dashboards they own or have access to
CREATE POLICY "Users can view cards from their dashboards"
ON "DashboardCard"
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "Dashboard" d
        WHERE d.id = "DashboardCard"."dashboardId"
        AND (
            d."userId"::text = (auth.uid())::text
            OR EXISTS (
                SELECT 1 FROM "DashboardShare" ds
                WHERE ds."dashboardId" = d.id
                AND ds."sharedWithUserId"::text = (auth.uid())::text
            )
        )
    )
);

-- Policy: Users can insert cards to dashboards they own
CREATE POLICY "Users can insert cards to their dashboards"
ON "DashboardCard"
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "Dashboard" d
        WHERE d.id = "DashboardCard"."dashboardId"
        AND d."userId"::text = (auth.uid())::text
    )
);

-- Policy: Users can update cards in dashboards they own
CREATE POLICY "Users can update cards in their dashboards"
ON "DashboardCard"
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM "Dashboard" d
        WHERE d.id = "DashboardCard"."dashboardId"
        AND d."userId"::text = (auth.uid())::text
    )
);

-- Policy: Users can delete cards from dashboards they own
CREATE POLICY "Users can delete cards from their dashboards"
ON "DashboardCard"
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM "Dashboard" d
        WHERE d.id = "DashboardCard"."dashboardId"
        AND d."userId"::text = (auth.uid())::text
    )
);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON "DashboardCard" TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE "DashboardCard" IS 'Stores dashboard card configurations with precise positioning';
COMMENT ON COLUMN "DashboardCard"."positionX" IS 'Horizontal position in grid units (0-based, max 11 for 12-column grid)';
COMMENT ON COLUMN "DashboardCard"."positionY" IS 'Vertical position in grid units (0-based, unlimited)';
COMMENT ON COLUMN "DashboardCard".width IS 'Card width in grid units (1-12)';
COMMENT ON COLUMN "DashboardCard".height IS 'Card height in grid units (1-20)';
COMMENT ON COLUMN "DashboardCard"."order" IS 'Display order for cards at same position (lower = front)';
COMMENT ON COLUMN "DashboardCard".config IS 'Card-specific configuration as JSON';

COMMENT ON FUNCTION check_card_overlap IS 'Detects if a card position overlaps with existing cards';
COMMENT ON FUNCTION find_next_available_position IS 'Finds the next available position for a new card';
COMMENT ON FUNCTION compact_dashboard_layout IS 'Removes vertical gaps in dashboard layout';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Query to check for overlapping cards (should return 0 rows after cleanup)
-- SELECT 
--     a.id as card1_id,
--     b.id as card2_id,
--     a."dashboardId",
--     a."positionX" as a_x,
--     a."positionY" as a_y,
--     b."positionX" as b_x,
--     b."positionY" as b_y
-- FROM "DashboardCard" a
-- JOIN "DashboardCard" b ON a."dashboardId" = b."dashboardId" AND a.id < b.id
-- WHERE 
--     a."positionX" < (b."positionX" + b.width) AND
--     (a."positionX" + a.width) > b."positionX" AND
--     a."positionY" < (b."positionY" + b.height) AND
--     (a."positionY" + a.height) > b."positionY";

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
