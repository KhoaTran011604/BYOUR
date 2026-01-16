-- =============================================
-- FIX RLS: Allow HQ users to view all boss profiles
-- =============================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own boss profile" ON public.boss_profiles;

-- Allow all authenticated users to view boss profiles
CREATE POLICY "Authenticated users can view boss profiles"
    ON public.boss_profiles FOR SELECT
    TO authenticated
    USING (true);

-- Keep policies for insert/update (only owner can modify)
-- These should already exist, but ensure they're there:
DROP POLICY IF EXISTS "Users can insert their own boss profile" ON public.boss_profiles;
CREATE POLICY "Users can insert their own boss profile"
    ON public.boss_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own boss profile" ON public.boss_profiles;
CREATE POLICY "Users can update their own boss profile"
    ON public.boss_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- Also fix profiles table RLS for join queries
-- =============================================

-- Allow viewing profiles for boss_profiles join
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);
