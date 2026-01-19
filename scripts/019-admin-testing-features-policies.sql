-- ==================== ADMIN POLICIES FOR TESTING FEATURES ====================
-- Run this script in Supabase SQL Editor
-- This enables admin CRUD operations for shaper_testing_features table

-- First, drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Approved shapers can view testing features" ON shaper_testing_features;

-- Policy 1: Allow all authenticated users to read testing features
-- Active features are visible to approved shapers, all features visible to admins
CREATE POLICY "Read testing features" ON shaper_testing_features
  FOR SELECT
  USING (
    -- Admin can see all features (checked in application layer)
    -- Or approved shapers can see active features
    is_active = TRUE OR EXISTS (
      SELECT 1 FROM shaper_profiles
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

-- Policy 2: Allow insert for admin (application layer checks admin status)
-- Using SECURITY DEFINER function instead of direct policy for better control
CREATE OR REPLACE FUNCTION admin_create_testing_feature(
  p_name TEXT,
  p_description TEXT,
  p_version TEXT,
  p_status TEXT DEFAULT 'alpha',
  p_due_date DATE DEFAULT NULL,
  p_test_url TEXT DEFAULT NULL,
  p_docs_url TEXT DEFAULT NULL,
  p_demo_component TEXT DEFAULT 'generic',
  p_demo_instructions TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO shaper_testing_features (
    name, description, version, status, due_date,
    test_url, docs_url, demo_component, demo_instructions, is_active
  )
  VALUES (
    p_name, p_description, p_version, p_status, p_due_date,
    p_test_url, p_docs_url, p_demo_component, p_demo_instructions, TRUE
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy 3: Admin update function
CREATE OR REPLACE FUNCTION admin_update_testing_feature(
  p_id UUID,
  p_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_version TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_due_date DATE DEFAULT NULL,
  p_test_url TEXT DEFAULT NULL,
  p_docs_url TEXT DEFAULT NULL,
  p_demo_component TEXT DEFAULT NULL,
  p_demo_instructions TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE shaper_testing_features
  SET
    name = COALESCE(p_name, name),
    description = COALESCE(p_description, description),
    version = COALESCE(p_version, version),
    status = COALESCE(p_status, status),
    due_date = COALESCE(p_due_date, due_date),
    test_url = COALESCE(p_test_url, test_url),
    docs_url = COALESCE(p_docs_url, docs_url),
    demo_component = COALESCE(p_demo_component, demo_component),
    demo_instructions = COALESCE(p_demo_instructions, demo_instructions),
    is_active = COALESCE(p_is_active, is_active),
    updated_at = NOW()
  WHERE id = p_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy 4: Admin delete function
CREATE OR REPLACE FUNCTION admin_delete_testing_feature(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM shaper_testing_features WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy 5: Admin toggle active function
CREATE OR REPLACE FUNCTION admin_toggle_testing_feature(p_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  new_is_active BOOLEAN;
BEGIN
  UPDATE shaper_testing_features
  SET
    is_active = NOT is_active,
    updated_at = NOW()
  WHERE id = p_id
  RETURNING is_active INTO new_is_active;

  RETURN new_is_active;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
-- Note: Admin check is done in application layer before calling these
GRANT EXECUTE ON FUNCTION admin_create_testing_feature(TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_testing_feature(UUID, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_testing_feature(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_toggle_testing_feature(UUID) TO authenticated;

-- Add direct INSERT/UPDATE/DELETE policies for service role or when using supabase-js
-- These allow the application to directly modify the table when authenticated
CREATE POLICY "Admin insert testing features" ON shaper_testing_features
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update testing features" ON shaper_testing_features
  FOR UPDATE
  USING (true);

CREATE POLICY "Admin delete testing features" ON shaper_testing_features
  FOR DELETE
  USING (true);

-- Note: These policies are permissive but the actual admin check is done
-- in the application layer (lib/config/admin.ts checks the email)
-- For production, consider:
-- 1. Using service role key for admin operations
-- 2. Creating an admins table with proper RLS
-- 3. Adding admin check directly in policies

-- ==================== ADMIN POLICIES FOR TEST CHECKLISTS ====================

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Approved shapers can view test checklists" ON shaper_test_checklists;

-- Policy: Allow all authenticated users to read test checklists
CREATE POLICY "Read test checklists" ON shaper_test_checklists
  FOR SELECT
  USING (true);

-- Policy: Allow insert for admin
CREATE POLICY "Admin insert test checklists" ON shaper_test_checklists
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow update for admin
CREATE POLICY "Admin update test checklists" ON shaper_test_checklists
  FOR UPDATE
  USING (true);

-- Policy: Allow delete for admin
CREATE POLICY "Admin delete test checklists" ON shaper_test_checklists
  FOR DELETE
  USING (true);
