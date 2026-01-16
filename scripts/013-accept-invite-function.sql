-- =============================================
-- FUNCTION TO ACCEPT HQ INVITE
-- This function handles all the operations needed when a boss accepts an invite:
-- 1. Verify the user is the invited boss
-- 2. Update invite status to 'accepted'
-- 3. Update project to assign boss and set status to 'in_progress'
-- 4. Create project chat if not exists
-- Uses SECURITY DEFINER to bypass RLS
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
    v_result JSON;
BEGIN
    -- Get current user
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get invite and verify ownership
    SELECT * INTO v_invite
    FROM public.hq_invites
    WHERE id = invite_uuid;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invite not found');
    END IF;

    IF v_invite.boss_id != v_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Not authorized to accept this invite');
    END IF;

    IF v_invite.status != 'pending' THEN
        RETURN json_build_object('success', false, 'error', 'Invite is not pending');
    END IF;

    -- Update invite status
    UPDATE public.hq_invites
    SET status = 'accepted',
        responded_at = NOW(),
        updated_at = NOW()
    WHERE id = invite_uuid;

    -- Update project to assign boss
    UPDATE public.hq_projects
    SET assigned_boss_id = v_user_id,
        status = 'in_progress',
        updated_at = NOW()
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

    RETURN json_build_object(
        'success', true,
        'project_id', v_invite.project_id,
        'chat_id', v_chat_id
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.accept_hq_invite(UUID) TO authenticated;

-- =============================================
-- FUNCTION TO DECLINE HQ INVITE
-- =============================================

CREATE OR REPLACE FUNCTION public.decline_hq_invite(invite_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_invite RECORD;
BEGIN
    -- Get current user
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Get invite and verify ownership
    SELECT * INTO v_invite
    FROM public.hq_invites
    WHERE id = invite_uuid;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invite not found');
    END IF;

    IF v_invite.boss_id != v_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Not authorized to decline this invite');
    END IF;

    IF v_invite.status != 'pending' THEN
        RETURN json_build_object('success', false, 'error', 'Invite is not pending');
    END IF;

    -- Update invite status
    UPDATE public.hq_invites
    SET status = 'declined',
        responded_at = NOW(),
        updated_at = NOW()
    WHERE id = invite_uuid;

    RETURN json_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.decline_hq_invite(UUID) TO authenticated;
