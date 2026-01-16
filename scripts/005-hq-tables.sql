-- =============================================
-- HQ MODE TABLES
-- =============================================

-- HQ Profiles (Company verification)
CREATE TABLE IF NOT EXISTS public.hq_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cro_vat_number VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_address TEXT,
    company_website VARCHAR(500),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verifying', 'verified', 'failed')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(cro_vat_number)
);

-- HQ Business Profiles (Public business profile)
CREATE TABLE IF NOT EXISTS public.hq_business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hq_id UUID NOT NULL REFERENCES public.hq_profiles(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(hq_id)
);

-- HQ Projects
CREATE TABLE IF NOT EXISTS public.hq_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hq_id UUID NOT NULL REFERENCES public.hq_profiles(id) ON DELETE CASCADE,
    business_profile_id UUID REFERENCES public.hq_business_profiles(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    deliverables TEXT[] DEFAULT '{}',
    budget_min DECIMAL(12,2) NOT NULL DEFAULT 0,
    budget_max DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    timeline_start DATE,
    timeline_end DATE,
    deadline DATE,
    tags TEXT[] DEFAULT '{}',
    skills_required TEXT[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'in_progress', 'review', 'completed', 'cancelled')),
    assigned_boss_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HQ Invites
CREATE TABLE IF NOT EXISTS public.hq_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hq_id UUID NOT NULL REFERENCES public.hq_profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.hq_projects(id) ON DELETE CASCADE,
    boss_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT,
    proposed_budget DECIMAL(12,2),
    proposed_deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, boss_id)
);

-- HQ Payments
CREATE TABLE IF NOT EXISTS public.hq_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hq_id UUID NOT NULL REFERENCES public.hq_profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.hq_projects(id) ON DELETE CASCADE,
    boss_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
    stripe_payment_intent_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HQ Project Chats
CREATE TABLE IF NOT EXISTS public.hq_project_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.hq_projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id)
);

-- HQ Chat Messages
CREATE TABLE IF NOT EXISTS public.hq_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.hq_project_chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('hq', 'boss')),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HQ Milestones
CREATE TABLE IF NOT EXISTS public.hq_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.hq_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_hq_profiles_user_id ON public.hq_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_hq_profiles_verification_status ON public.hq_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_hq_business_profiles_hq_id ON public.hq_business_profiles(hq_id);
CREATE INDEX IF NOT EXISTS idx_hq_projects_hq_id ON public.hq_projects(hq_id);
CREATE INDEX IF NOT EXISTS idx_hq_projects_status ON public.hq_projects(status);
CREATE INDEX IF NOT EXISTS idx_hq_projects_assigned_boss ON public.hq_projects(assigned_boss_id);
CREATE INDEX IF NOT EXISTS idx_hq_invites_hq_id ON public.hq_invites(hq_id);
CREATE INDEX IF NOT EXISTS idx_hq_invites_project_id ON public.hq_invites(project_id);
CREATE INDEX IF NOT EXISTS idx_hq_invites_boss_id ON public.hq_invites(boss_id);
CREATE INDEX IF NOT EXISTS idx_hq_invites_status ON public.hq_invites(status);
CREATE INDEX IF NOT EXISTS idx_hq_payments_project_id ON public.hq_payments(project_id);
CREATE INDEX IF NOT EXISTS idx_hq_chat_messages_chat_id ON public.hq_chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_hq_milestones_project_id ON public.hq_milestones(project_id);

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_hq_profiles_updated_at ON public.hq_profiles;
CREATE TRIGGER update_hq_profiles_updated_at
    BEFORE UPDATE ON public.hq_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hq_business_profiles_updated_at ON public.hq_business_profiles;
CREATE TRIGGER update_hq_business_profiles_updated_at
    BEFORE UPDATE ON public.hq_business_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hq_projects_updated_at ON public.hq_projects;
CREATE TRIGGER update_hq_projects_updated_at
    BEFORE UPDATE ON public.hq_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hq_invites_updated_at ON public.hq_invites;
CREATE TRIGGER update_hq_invites_updated_at
    BEFORE UPDATE ON public.hq_invites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hq_payments_updated_at ON public.hq_payments;
CREATE TRIGGER update_hq_payments_updated_at
    BEFORE UPDATE ON public.hq_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hq_project_chats_updated_at ON public.hq_project_chats;
CREATE TRIGGER update_hq_project_chats_updated_at
    BEFORE UPDATE ON public.hq_project_chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hq_milestones_updated_at ON public.hq_milestones;
CREATE TRIGGER update_hq_milestones_updated_at
    BEFORE UPDATE ON public.hq_milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.hq_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_project_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_milestones ENABLE ROW LEVEL SECURITY;

-- HQ Profiles policies
CREATE POLICY "Users can view own hq profile" ON public.hq_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hq profile" ON public.hq_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hq profile" ON public.hq_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- HQ Business Profiles policies
CREATE POLICY "Anyone can view business profiles" ON public.hq_business_profiles
    FOR SELECT USING (true);

CREATE POLICY "HQ owners can manage business profiles" ON public.hq_business_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hq_profiles
            WHERE id = hq_business_profiles.hq_id AND user_id = auth.uid()
        )
    );

-- HQ Projects policies
CREATE POLICY "HQ owners can manage own projects" ON public.hq_projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hq_profiles
            WHERE id = hq_projects.hq_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Bosses can view projects they are invited to or assigned" ON public.hq_projects
    FOR SELECT USING (
        assigned_boss_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.hq_invites
            WHERE project_id = hq_projects.id AND boss_id = auth.uid()
        )
    );

-- HQ Invites policies
CREATE POLICY "HQ owners can manage invites" ON public.hq_invites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hq_profiles
            WHERE id = hq_invites.hq_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Bosses can view and respond to invites" ON public.hq_invites
    FOR SELECT USING (boss_id = auth.uid());

CREATE POLICY "Bosses can update invite status" ON public.hq_invites
    FOR UPDATE USING (boss_id = auth.uid())
    WITH CHECK (boss_id = auth.uid());

-- HQ Payments policies
CREATE POLICY "HQ owners can view own payments" ON public.hq_payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.hq_profiles
            WHERE id = hq_payments.hq_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "HQ owners can create payments" ON public.hq_payments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.hq_profiles
            WHERE id = hq_payments.hq_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Bosses can view payments to them" ON public.hq_payments
    FOR SELECT USING (boss_id = auth.uid());

-- HQ Chat policies
CREATE POLICY "Project participants can access chat" ON public.hq_project_chats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hq_projects p
            JOIN public.hq_profiles h ON p.hq_id = h.id
            WHERE p.id = hq_project_chats.project_id
            AND (h.user_id = auth.uid() OR p.assigned_boss_id = auth.uid())
        )
    );

CREATE POLICY "Project participants can access messages" ON public.hq_chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hq_project_chats c
            JOIN public.hq_projects p ON c.project_id = p.id
            JOIN public.hq_profiles h ON p.hq_id = h.id
            WHERE c.id = hq_chat_messages.chat_id
            AND (h.user_id = auth.uid() OR p.assigned_boss_id = auth.uid())
        )
    );

-- HQ Milestones policies
CREATE POLICY "Project participants can view milestones" ON public.hq_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.hq_projects p
            JOIN public.hq_profiles h ON p.hq_id = h.id
            WHERE p.id = hq_milestones.project_id
            AND (h.user_id = auth.uid() OR p.assigned_boss_id = auth.uid())
        )
    );

CREATE POLICY "HQ owners can manage milestones" ON public.hq_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hq_projects p
            JOIN public.hq_profiles h ON p.hq_id = h.id
            WHERE p.id = hq_milestones.project_id AND h.user_id = auth.uid()
        )
    );
