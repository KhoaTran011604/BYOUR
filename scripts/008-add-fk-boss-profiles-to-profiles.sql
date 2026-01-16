-- Thêm FK từ boss_profiles.user_id đến profiles.id
ALTER TABLE public.boss_profiles
DROP CONSTRAINT IF EXISTS boss_profiles_user_id_fkey;

ALTER TABLE public.boss_profiles
ADD CONSTRAINT boss_profiles_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Đảm bảo profiles policy đã có
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);
