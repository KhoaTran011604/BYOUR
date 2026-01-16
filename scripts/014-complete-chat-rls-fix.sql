-- =============================================
-- COMPLETE FIX FOR BOSS/HQ CHAT RLS
-- Run this script to fix all chat-related RLS issues
-- =============================================

-- =============================================
-- 1. HELPER FUNCTIONS (SECURITY DEFINER)
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
-- 2. HQ_PROFILES POLICIES
-- =============================================

DROP POLICY IF EXISTS "Bosses can view hq profiles that invited them" ON public.hq_profiles;

CREATE POLICY "Bosses can view hq profiles that invited them" ON public.hq_profiles
    FOR SELECT USING (
        auth.uid() = user_id OR public.boss_was_invited_by_hq(id, auth.uid())
    );

-- =============================================
-- 3. HQ_PROJECT_CHATS POLICIES
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
-- 4. HQ_CHAT_MESSAGES POLICIES
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
-- 5. ACCEPT/DECLINE INVITE FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.accept_hq_invite(invite_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_invite RECORD;
    v_chat_id UUID;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    SELECT * INTO v_invite
    FROM public.hq_invites
    WHERE id = invite_uuid;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invite not found');
    END IF;

    IF v_invite.boss_id != v_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Not authorized');
    END IF;

    IF v_invite.status != 'pending' THEN
        RETURN json_build_object('success', false, 'error', 'Invite is not pending');
    END IF;

    -- Update invite status
    UPDATE public.hq_invites
    SET status = 'accepted', responded_at = NOW(), updated_at = NOW()
    WHERE id = invite_uuid;

    -- Update project to assign boss
    UPDATE public.hq_projects
    SET assigned_boss_id = v_user_id, status = 'in_progress', updated_at = NOW()
    WHERE id = v_invite.project_id;

    -- Create project chat if not exists
    SELECT id INTO v_chat_id
    FROM public.hq_project_chats
    WHERE project_id = v_invite.project_id;

    IF NOT FOUND THEN
        INSERT INTO public.hq_project_chats (project_id)
        VALUES (v_invite.project_id)
        RETURNING id INTO v_chat_id;
    END IF;

    RETURN json_build_object('success', true, 'project_id', v_invite.project_id, 'chat_id', v_chat_id);

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

CREATE OR REPLACE FUNCTION public.decline_hq_invite(invite_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_invite RECORD;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    SELECT * INTO v_invite
    FROM public.hq_invites
    WHERE id = invite_uuid;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invite not found');
    END IF;

    IF v_invite.boss_id != v_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Not authorized');
    END IF;

    IF v_invite.status != 'pending' THEN
        RETURN json_build_object('success', false, 'error', 'Invite is not pending');
    END IF;

    UPDATE public.hq_invites
    SET status = 'declined', responded_at = NOW(), updated_at = NOW()
    WHERE id = invite_uuid;

    RETURN json_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.accept_hq_invite(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decline_hq_invite(UUID) TO authenticated;

-- =============================================
-- DONE! Run this verification query to check:
-- =============================================
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies
-- WHERE tablename IN ('hq_profiles', 'hq_project_chats', 'hq_chat_messages')
-- ORDER BY tablename, policyname;
