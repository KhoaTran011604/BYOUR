-- ==================== ADMIN POLICIES FOR SHAPER PROFILES ====================
-- Run this script in Supabase SQL Editor

-- Create admin function to update shaper status (bypasses RLS)
CREATE OR REPLACE FUNCTION admin_update_shaper_status(
  p_shaper_id UUID,
  p_status TEXT,
  p_approved_at TIMESTAMPTZ DEFAULT NULL,
  p_rejected_at TIMESTAMPTZ DEFAULT NULL,
  p_rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE shaper_profiles
  SET
    status = p_status,
    approved_at = p_approved_at,
    rejected_at = p_rejected_at,
    rejection_reason = p_rejection_reason,
    updated_at = NOW()
  WHERE id = p_shaper_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
-- Note: The actual admin check is done in the application layer
GRANT EXECUTE ON FUNCTION admin_update_shaper_status(UUID, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT) TO authenticated;

-- Add policy for admin to read all shaper profiles
-- This policy allows reading all shaper profiles (needed for admin list)
-- The application layer checks if user is admin before showing the page
CREATE POLICY "Allow read all shaper profiles for admin users" ON shaper_profiles
  FOR SELECT
  USING (true);

-- Note: The above policy allows all authenticated users to read shaper_profiles
-- If you want stricter control, you can:
-- 1. Create an 'admins' table and check membership
-- 2. Or use a service role key in your admin API routes
-- 3. Or add an is_admin column to profiles table

-- Example with admins table (optional, uncomment if needed):
-- CREATE TABLE IF NOT EXISTS admins (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
--
-- CREATE POLICY "Only admins can read all shaper profiles" ON shaper_profiles
--   FOR SELECT
--   USING (
--     EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
--     OR auth.uid() = user_id
--   );
