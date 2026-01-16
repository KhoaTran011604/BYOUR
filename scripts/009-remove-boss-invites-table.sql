-- =============================================
-- MIGRATION: Remove boss_invites table
-- =============================================
-- This migration removes the boss_invites table since invites are now
-- managed through hq_invites table. Boss users query hq_invites directly.
-- =============================================

-- Step 1: Drop RLS policies on boss_invites
DROP POLICY IF EXISTS "Boss users can view their invites" ON public.boss_invites;
DROP POLICY IF EXISTS "Clients can create invites" ON public.boss_invites;
DROP POLICY IF EXISTS "Boss users can update invite status" ON public.boss_invites;

-- Step 2: Drop the trigger for updated_at
DROP TRIGGER IF EXISTS set_boss_invites_updated_at ON public.boss_invites;

-- Step 3: Drop indexes on boss_invites
DROP INDEX IF EXISTS idx_boss_invites_boss_id;
DROP INDEX IF EXISTS idx_boss_invites_status;
DROP INDEX IF EXISTS idx_boss_invites_created_at;

-- Step 4: Remove invite_id column from boss_projects (since it referenced boss_invites)
-- First drop any foreign key constraint
ALTER TABLE public.boss_projects DROP CONSTRAINT IF EXISTS boss_projects_invite_id_fkey;
-- Then drop the column
ALTER TABLE public.boss_projects DROP COLUMN IF EXISTS invite_id;

-- Step 5: Drop the boss_invites table
DROP TABLE IF EXISTS public.boss_invites;

-- =============================================
-- VERIFICATION
-- =============================================
-- After running this migration, verify:
-- 1. boss_invites table no longer exists
-- 2. boss_projects no longer has invite_id column
-- 3. Boss mode queries hq_invites for invites
