-- =============================================
-- COMPLETE RLS SETUP FOR BOSS ACCESSING HQ FEATURES
-- This script consolidates all RLS policies needed for
-- boss users to interact with HQ projects, chats, etc.
-- =============================================

-- =============================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- These bypass RLS to check permissions without recursion
-- =============================================

-- Function: Check if boss was invited by this HQ
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

-- Function: Check if user can access HQ project (is HQ owner or assigned boss)
CREATE OR REPLACE FUNCTION public.can_access_hq_project(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.hq_projects p
        JOIN public.hq_profiles h ON p.hq_id = h.id
        WHERE p.id = project_uuid
        AND (h.user_id = user_uuid OR p.assigned_boss_id = user_uuid)
    );
$$;

-- Function: Check if user can access HQ chat
CREATE OR REPLACE FUNCTION public.can_access_hq_chat(chat_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.hq_project_chats c
        JOIN public.hq_projects p ON c.project_id = p.id
        JOIN public.hq_profiles h ON p.hq_id = h.id
        WHERE c.id = chat_uuid
        AND (h.user_id = user_uuid OR p.assigned_boss_id = user_uuid)
    );
$$;

-- =============================================
-- HQ_PROFILES POLICIES
-- Allow boss to view HQ profiles that invited them
-- =============================================

DROP POLICY IF EXISTS "Bosses can view hq profiles that invited them" ON public.hq_profiles;

CREATE POLICY "Bosses can view hq profiles that invited them" ON public.hq_profiles
    FOR SELECT USING (
        public.boss_was_invited_by_hq(id, auth.uid())
    );

-- =============================================
-- HQ_PROJECTS POLICIES
-- Boss can view projects they are invited to or assigned
-- =============================================

-- Keep existing policies, just ensure boss access is covered
-- The existing policy "Bosses can view projects they are invited to or assigned" should work
-- But let's add a SECURITY DEFINER version if needed

DROP POLICY IF EXISTS "Bosses can view assigned projects" ON public.hq_projects;

CREATE POLICY "Bosses can view assigned projects" ON public.hq_projects
    FOR SELECT USING (
        public.can_access_hq_project(id, auth.uid())
    );

-- =============================================
-- HQ_PROJECT_CHATS POLICIES
-- =============================================

DROP POLICY IF EXISTS "Project participants can access chat" ON public.hq_project_chats;
DROP POLICY IF EXISTS "Project participants can view chat" ON public.hq_project_chats;
DROP POLICY IF EXISTS "Project participants can create chat" ON public.hq_project_chats;
DROP POLICY IF EXISTS "Project participants can update chat" ON public.hq_project_chats;

CREATE POLICY "Project participants can view chat" ON public.hq_project_chats
    FOR SELECT USING (
        public.can_access_hq_project(project_id, auth.uid())
    );

CREATE POLICY "Project participants can create chat" ON public.hq_project_chats
    FOR INSERT WITH CHECK (
        public.can_access_hq_project(project_id, auth.uid())
    );

CREATE POLICY "Project participants can update chat" ON public.hq_project_chats
    FOR UPDATE USING (
        public.can_access_hq_project(project_id, auth.uid())
    );

-- =============================================
-- HQ_CHAT_MESSAGES POLICIES
-- =============================================

DROP POLICY IF EXISTS "Project participants can access messages" ON public.hq_chat_messages;
DROP POLICY IF EXISTS "Project participants can view messages" ON public.hq_chat_messages;
DROP POLICY IF EXISTS "Project participants can send messages" ON public.hq_chat_messages;
DROP POLICY IF EXISTS "Project participants can update messages" ON public.hq_chat_messages;

CREATE POLICY "Project participants can view messages" ON public.hq_chat_messages
    FOR SELECT USING (
        public.can_access_hq_chat(chat_id, auth.uid())
    );

CREATE POLICY "Project participants can send messages" ON public.hq_chat_messages
    FOR INSERT WITH CHECK (
        public.can_access_hq_chat(chat_id, auth.uid())
        AND sender_id = auth.uid()
    );

CREATE POLICY "Project participants can update messages" ON public.hq_chat_messages
    FOR UPDATE USING (
        public.can_access_hq_chat(chat_id, auth.uid())
    );

-- =============================================
-- HQ_MILESTONES POLICIES
-- Boss can view milestones for projects they are assigned to
-- =============================================

DROP POLICY IF EXISTS "Bosses can view project milestones" ON public.hq_milestones;

CREATE POLICY "Bosses can view project milestones" ON public.hq_milestones
    FOR SELECT USING (
        public.can_access_hq_project(project_id, auth.uid())
    );

-- =============================================
-- HQ_PAYMENTS POLICIES
-- Boss can view payments to them (already exists, but ensure it works)
-- =============================================

-- Existing policy: "Bosses can view payments to them" should work
-- It uses boss_id = auth.uid() which is simple and doesn't need SECURITY DEFINER

-- =============================================
-- VERIFICATION QUERY (run this to check policies)
-- =============================================
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('hq_profiles', 'hq_projects', 'hq_project_chats', 'hq_chat_messages', 'hq_milestones')
-- ORDER BY tablename, policyname;
