-- =============================================
-- Allow bosses to create and access project chats
-- Use SECURITY DEFINER functions to avoid RLS recursion
-- =============================================

-- Create helper function to check if user can access project chat
-- SECURITY DEFINER bypasses RLS when checking
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

-- Create helper function to check if user can access chat
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
-- HQ Project Chats Policies
-- =============================================

DROP POLICY IF EXISTS "Project participants can access chat" ON public.hq_project_chats;
DROP POLICY IF EXISTS "Project participants can view chat" ON public.hq_project_chats;
DROP POLICY IF EXISTS "Project participants can create chat" ON public.hq_project_chats;
DROP POLICY IF EXISTS "Project participants can update chat" ON public.hq_project_chats;

-- Policy for SELECT
CREATE POLICY "Project participants can view chat" ON public.hq_project_chats
    FOR SELECT USING (
        public.can_access_hq_project(project_id, auth.uid())
    );

-- Policy for INSERT
CREATE POLICY "Project participants can create chat" ON public.hq_project_chats
    FOR INSERT WITH CHECK (
        public.can_access_hq_project(project_id, auth.uid())
    );

-- Policy for UPDATE
CREATE POLICY "Project participants can update chat" ON public.hq_project_chats
    FOR UPDATE USING (
        public.can_access_hq_project(project_id, auth.uid())
    );

-- =============================================
-- HQ Chat Messages Policies
-- =============================================

DROP POLICY IF EXISTS "Project participants can access messages" ON public.hq_chat_messages;
DROP POLICY IF EXISTS "Project participants can view messages" ON public.hq_chat_messages;
DROP POLICY IF EXISTS "Project participants can send messages" ON public.hq_chat_messages;
DROP POLICY IF EXISTS "Project participants can update messages" ON public.hq_chat_messages;

-- Policy for SELECT messages
CREATE POLICY "Project participants can view messages" ON public.hq_chat_messages
    FOR SELECT USING (
        public.can_access_hq_chat(chat_id, auth.uid())
    );

-- Policy for INSERT messages
CREATE POLICY "Project participants can send messages" ON public.hq_chat_messages
    FOR INSERT WITH CHECK (
        public.can_access_hq_chat(chat_id, auth.uid())
        AND sender_id = auth.uid()
    );

-- Policy for UPDATE messages (mark as read, etc.)
CREATE POLICY "Project participants can update messages" ON public.hq_chat_messages
    FOR UPDATE USING (
        public.can_access_hq_chat(chat_id, auth.uid())
    );
