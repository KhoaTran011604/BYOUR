-- Boss Mode Tables Migration
-- This migration creates all tables needed for Boss mode functionality

-- =====================================================
-- BOSS PROFILES TABLE
-- Stores verification and business information for Boss users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.boss_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_number TEXT NOT NULL,
    company_name TEXT,
    business_type TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verifying', 'verified', 'failed')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(registration_number)
);

-- =====================================================
-- BOSS INVITES TABLE
-- Stores project invitations sent to Boss users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.boss_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boss_id UUID NOT NULL REFERENCES public.boss_profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_avatar TEXT,
    project_title TEXT NOT NULL,
    project_description TEXT,
    budget_min DECIMAL(12, 2),
    budget_max DECIMAL(12, 2),
    currency TEXT NOT NULL DEFAULT 'EUR',
    deadline TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- BOSS PROJECTS TABLE
-- Stores active/completed projects for Boss users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.boss_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boss_id UUID NOT NULL REFERENCES public.boss_profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invite_id UUID REFERENCES public.boss_invites(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'in_progress', 'review', 'completed', 'cancelled')),
    budget DECIMAL(12, 2),
    currency TEXT NOT NULL DEFAULT 'EUR',
    deadline TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PROJECT MESSAGES TABLE
-- Stores chat messages within projects
-- =====================================================
CREATE TABLE IF NOT EXISTS public.project_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.boss_projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PROJECT ATTACHMENTS TABLE
-- Stores file attachments for project messages
-- =====================================================
CREATE TABLE IF NOT EXISTS public.project_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.project_messages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PROJECT MILESTONES TABLE
-- Stores milestones/tasks for tracking project progress
-- =====================================================
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.boss_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- BOSS PAYMENTS TABLE
-- Stores payment information for completed projects
-- =====================================================
CREATE TABLE IF NOT EXISTS public.boss_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.boss_projects(id) ON DELETE CASCADE,
    boss_id UUID NOT NULL REFERENCES public.boss_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payment_method TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_boss_profiles_user_id ON public.boss_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_profiles_verification_status ON public.boss_profiles(verification_status);

CREATE INDEX IF NOT EXISTS idx_boss_invites_boss_id ON public.boss_invites(boss_id);
CREATE INDEX IF NOT EXISTS idx_boss_invites_status ON public.boss_invites(status);
CREATE INDEX IF NOT EXISTS idx_boss_invites_created_at ON public.boss_invites(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_boss_projects_boss_id ON public.boss_projects(boss_id);
CREATE INDEX IF NOT EXISTS idx_boss_projects_status ON public.boss_projects(status);
CREATE INDEX IF NOT EXISTS idx_boss_projects_created_at ON public.boss_projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created_at ON public.project_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);

CREATE INDEX IF NOT EXISTS idx_boss_payments_boss_id ON public.boss_payments(boss_id);
CREATE INDEX IF NOT EXISTS idx_boss_payments_project_id ON public.boss_payments(project_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.boss_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_payments ENABLE ROW LEVEL SECURITY;

-- Boss Profiles Policies
CREATE POLICY "Users can view their own boss profile"
    ON public.boss_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boss profile"
    ON public.boss_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boss profile"
    ON public.boss_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Boss Invites Policies
CREATE POLICY "Boss users can view their invites"
    ON public.boss_invites FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_profiles
            WHERE id = boss_invites.boss_id AND user_id = auth.uid()
        )
        OR client_id = auth.uid()
    );

CREATE POLICY "Clients can create invites"
    ON public.boss_invites FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Boss users can update invite status"
    ON public.boss_invites FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_profiles
            WHERE id = boss_invites.boss_id AND user_id = auth.uid()
        )
    );

-- Boss Projects Policies
CREATE POLICY "Users can view their projects"
    ON public.boss_projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_profiles
            WHERE id = boss_projects.boss_id AND user_id = auth.uid()
        )
        OR client_id = auth.uid()
    );

CREATE POLICY "Users can insert projects"
    ON public.boss_projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.boss_profiles
            WHERE id = boss_projects.boss_id AND user_id = auth.uid()
        )
        OR client_id = auth.uid()
    );

CREATE POLICY "Users can update their projects"
    ON public.boss_projects FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_profiles
            WHERE id = boss_projects.boss_id AND user_id = auth.uid()
        )
        OR client_id = auth.uid()
    );

-- Project Messages Policies
CREATE POLICY "Project participants can view messages"
    ON public.project_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_projects bp
            JOIN public.boss_profiles bpr ON bp.boss_id = bpr.id
            WHERE bp.id = project_messages.project_id
            AND (bpr.user_id = auth.uid() OR bp.client_id = auth.uid())
        )
    );

CREATE POLICY "Project participants can send messages"
    ON public.project_messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.boss_projects bp
            JOIN public.boss_profiles bpr ON bp.boss_id = bpr.id
            WHERE bp.id = project_messages.project_id
            AND (bpr.user_id = auth.uid() OR bp.client_id = auth.uid())
        )
    );

-- Project Attachments Policies
CREATE POLICY "Users can view attachments of their messages"
    ON public.project_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_messages pm
            JOIN public.boss_projects bp ON pm.project_id = bp.id
            JOIN public.boss_profiles bpr ON bp.boss_id = bpr.id
            WHERE pm.id = project_attachments.message_id
            AND (bpr.user_id = auth.uid() OR bp.client_id = auth.uid())
        )
    );

CREATE POLICY "Users can add attachments to their messages"
    ON public.project_attachments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_messages pm
            WHERE pm.id = project_attachments.message_id
            AND pm.sender_id = auth.uid()
        )
    );

-- Project Milestones Policies
CREATE POLICY "Project participants can view milestones"
    ON public.project_milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_projects bp
            JOIN public.boss_profiles bpr ON bp.boss_id = bpr.id
            WHERE bp.id = project_milestones.project_id
            AND (bpr.user_id = auth.uid() OR bp.client_id = auth.uid())
        )
    );

CREATE POLICY "Boss users can manage milestones"
    ON public.project_milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_projects bp
            JOIN public.boss_profiles bpr ON bp.boss_id = bpr.id
            WHERE bp.id = project_milestones.project_id
            AND bpr.user_id = auth.uid()
        )
    );

-- Boss Payments Policies
CREATE POLICY "Users can view their payments"
    ON public.boss_payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boss_profiles
            WHERE id = boss_payments.boss_id AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.boss_projects bp
            WHERE bp.id = boss_payments.project_id AND bp.client_id = auth.uid()
        )
    );

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_boss_profiles_updated_at
    BEFORE UPDATE ON public.boss_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_boss_invites_updated_at
    BEFORE UPDATE ON public.boss_invites
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_boss_projects_updated_at
    BEFORE UPDATE ON public.boss_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_project_milestones_updated_at
    BEFORE UPDATE ON public.project_milestones
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
