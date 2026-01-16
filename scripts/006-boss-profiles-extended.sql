-- =============================================
-- EXTEND BOSS PROFILES WITH ADDITIONAL FIELDS
-- =============================================

-- Add new fields to boss_profiles for HQ matching
ALTER TABLE public.boss_profiles
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);

-- Create index for skills search
CREATE INDEX IF NOT EXISTS idx_boss_profiles_skills ON public.boss_profiles USING GIN (skills);

-- Create index for availability filter
CREATE INDEX IF NOT EXISTS idx_boss_profiles_available ON public.boss_profiles(is_available) WHERE is_available = TRUE;

-- =============================================
-- RLS POLICIES FOR HQ TO VIEW BOSS PROFILES
-- =============================================

-- Allow anyone to view verified boss profiles (public listing)
DROP POLICY IF EXISTS "Anyone can view verified boss profiles" ON public.boss_profiles;
CREATE POLICY "Anyone can view verified boss profiles"
    ON public.boss_profiles FOR SELECT
    USING (verification_status = 'verified');

-- =============================================
-- FUNCTION TO MATCH BOSSES BY SKILLS
-- =============================================

CREATE OR REPLACE FUNCTION public.get_matched_bosses(
    required_skills TEXT[],
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    company_name TEXT,
    business_type TEXT,
    headline TEXT,
    bio TEXT,
    skills TEXT[],
    hourly_rate DECIMAL(10,2),
    currency VARCHAR(10),
    rating DECIMAL(3,2),
    reviews_count INTEGER,
    projects_completed INTEGER,
    is_available BOOLEAN,
    location VARCHAR(100),
    profile_full_name TEXT,
    profile_avatar_url TEXT,
    profile_handle TEXT,
    match_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bp.id,
        bp.user_id,
        bp.company_name,
        bp.business_type,
        bp.headline,
        bp.bio,
        bp.skills,
        bp.hourly_rate,
        bp.currency,
        bp.rating,
        bp.reviews_count,
        bp.projects_completed,
        bp.is_available,
        bp.location,
        p.full_name AS profile_full_name,
        p.avatar_url AS profile_avatar_url,
        p.handle AS profile_handle,
        -- Calculate match score: count of matching skills
        COALESCE(
            (SELECT COUNT(*)::INTEGER
             FROM unnest(bp.skills) AS bs
             WHERE bs = ANY(required_skills)),
            0
        ) AS match_score
    FROM public.boss_profiles bp
    LEFT JOIN public.profiles p ON p.id = bp.user_id
    WHERE bp.verification_status = 'verified'
      AND bp.is_available = TRUE
    ORDER BY match_score DESC, bp.rating DESC NULLS LAST
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_matched_bosses(TEXT[], INTEGER) TO authenticated;
