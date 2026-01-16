-- =============================================
-- Allow bosses to view HQ profiles that have invited them
-- Fix: Use SECURITY DEFINER function to avoid infinite recursion
-- =============================================

-- Drop the old policy if it exists (it causes infinite recursion)
DROP POLICY IF EXISTS "Bosses can view hq profiles that invited them" ON public.hq_profiles;

-- Create a security definer function to check if boss was invited by this HQ
-- SECURITY DEFINER runs with the privileges of the function owner (bypasses RLS)
CREATE OR REPLACE FUNCTION public.boss_was_invited_by_hq(hq_profile_id UUID, boss_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.hq_invites
        WHERE hq_invites.hq_id = hq_profile_id
        AND hq_invites.boss_id = boss_user_id
    );
$$;

-- Create policy using the function (no recursion because function bypasses RLS)
CREATE POLICY "Bosses can view hq profiles that invited them" ON public.hq_profiles
    FOR SELECT USING (
        public.boss_was_invited_by_hq(id, auth.uid())
    );
