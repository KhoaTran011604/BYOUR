-- ==================== SHAPER MODE TABLES ====================
-- Run this script in Supabase SQL Editor

-- 1. Shaper Profiles table (tracks shaper application status)
CREATE TABLE shaper_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason_for_joining TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  badge_level TEXT DEFAULT 'bronze' CHECK (badge_level IN ('bronze', 'silver', 'gold', 'platinum')),
  contribution_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Shaper Feedbacks table
CREATE TABLE shaper_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'improvement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'planned', 'in_progress', 'completed', 'closed')),
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Feedback Votes table (tracks who voted on what)
CREATE TABLE shaper_feedback_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES shaper_feedbacks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feedback_id, user_id)
);

-- 4. Testing Features table (features available for testing)
CREATE TABLE shaper_testing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'alpha' CHECK (status IN ('alpha', 'beta', 'testing', 'ready')),
  due_date DATE,
  testers_count INTEGER DEFAULT 0,
  bugs_count INTEGER DEFAULT 0,
  test_url TEXT,
  docs_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Test History table (tracks user testing activity)
CREATE TABLE shaper_test_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES shaper_testing_features(id) ON DELETE CASCADE,
  tested_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER DEFAULT 0,
  bugs_found INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Experimental Features table
CREATE TABLE shaper_experimental_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Sparkles',
  status TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('available', 'coming_soon', 'locked')),
  release_date DATE,
  access_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. User Feature Toggles (tracks which features users have enabled)
CREATE TABLE shaper_user_feature_toggles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES shaper_experimental_features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT FALSE,
  enabled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_id)
);

-- 8. Upcoming Releases table
CREATE TABLE shaper_upcoming_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  release_date DATE NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_released BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_shaper_profiles_user_id ON shaper_profiles(user_id);
CREATE INDEX idx_shaper_profiles_status ON shaper_profiles(status);
CREATE INDEX idx_shaper_feedbacks_user_id ON shaper_feedbacks(user_id);
CREATE INDEX idx_shaper_feedbacks_status ON shaper_feedbacks(status);
CREATE INDEX idx_shaper_feedbacks_type ON shaper_feedbacks(type);
CREATE INDEX idx_shaper_test_history_user_id ON shaper_test_history(user_id);
CREATE INDEX idx_shaper_test_history_feature_id ON shaper_test_history(feature_id);

-- Enable RLS
ALTER TABLE shaper_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_feedback_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_testing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_test_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_experimental_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_user_feature_toggles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_upcoming_releases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shaper_profiles
CREATE POLICY "Users can view their own shaper profile" ON shaper_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shaper profile" ON shaper_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shaper profile" ON shaper_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for shaper_feedbacks
CREATE POLICY "Approved shapers can view all feedbacks" ON shaper_feedbacks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );
CREATE POLICY "Approved shapers can insert feedbacks" ON shaper_feedbacks
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );
CREATE POLICY "Users can update their own feedbacks" ON shaper_feedbacks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own feedbacks" ON shaper_feedbacks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for feedback votes
CREATE POLICY "Approved shapers can view votes" ON shaper_feedback_votes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );
CREATE POLICY "Approved shapers can vote" ON shaper_feedback_votes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );
CREATE POLICY "Users can remove their own votes" ON shaper_feedback_votes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for testing features (read-only for approved shapers)
CREATE POLICY "Approved shapers can view testing features" ON shaper_testing_features
  FOR SELECT USING (
    is_active = TRUE AND
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );

-- RLS Policies for test history
CREATE POLICY "Users can view their own test history" ON shaper_test_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Approved shapers can insert test history" ON shaper_test_history
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );
CREATE POLICY "Users can update their own test history" ON shaper_test_history
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for experimental features (read-only for approved shapers)
CREATE POLICY "Approved shapers can view experimental features" ON shaper_experimental_features
  FOR SELECT USING (
    is_active = TRUE AND
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );

-- RLS Policies for feature toggles
CREATE POLICY "Users can view their own feature toggles" ON shaper_user_feature_toggles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own feature toggles" ON shaper_user_feature_toggles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feature toggles" ON shaper_user_feature_toggles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for upcoming releases (read-only for approved shapers)
CREATE POLICY "Approved shapers can view upcoming releases" ON shaper_upcoming_releases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );

-- Triggers for updated_at
CREATE TRIGGER update_shaper_profiles_updated_at BEFORE UPDATE ON shaper_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shaper_feedbacks_updated_at BEFORE UPDATE ON shaper_feedbacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shaper_testing_features_updated_at BEFORE UPDATE ON shaper_testing_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shaper_experimental_features_updated_at BEFORE UPDATE ON shaper_experimental_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shaper_upcoming_releases_updated_at BEFORE UPDATE ON shaper_upcoming_releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== SEED DATA ====================

-- Seed Testing Features
INSERT INTO shaper_testing_features (name, description, version, status, due_date, testers_count, bugs_count, test_url, docs_url) VALUES
('New Template: Portfolio Pro', 'New portfolio template with beautiful layouts and smooth animations.', 'v2.5.0-beta', 'testing', '2024-02-20', 12, 3, '/builder/new?template=portfolio-pro-beta', '/docs/templates/portfolio-pro'),
('Drag & Drop Reordering', 'Drag and drop feature to reorder blocks in the website builder.', 'v2.5.0-beta', 'testing', '2024-02-18', 8, 1, '/builder/test-dnd', '/docs/builder/drag-drop'),
('AI Content Generator', 'Use AI to auto-generate content for website blocks.', 'v2.6.0-alpha', 'alpha', '2024-03-01', 5, 7, '/builder/test-ai', '/docs/ai/content-generator'),
('Multi-language Support', 'Multi-language support for websites with translation management.', 'v2.5.0-beta', 'ready', '2024-02-15', 15, 0, '/builder/test-i18n', '/docs/i18n/setup');

-- Seed Experimental Features
INSERT INTO shaper_experimental_features (name, description, icon_name, status, release_date, access_count) VALUES
('AI Content Assistant', 'Use AI to suggest and auto-generate content for your website.', 'Brain', 'available', '2024-02-15', 156),
('Advanced Analytics', 'Detailed analytics dashboard with heatmaps and user journey tracking.', 'Zap', 'available', '2024-02-20', 89),
('Custom Themes', 'Create and share custom themes with the community.', 'Palette', 'available', '2024-03-01', 234),
('Multi-site Management', 'Manage multiple websites from a single dashboard.', 'Globe', 'coming_soon', '2024-03-15', 0),
('Team Collaboration', 'Invite team members and collaborate real-time on website.', 'Users', 'coming_soon', '2024-04-01', 0),
('Enterprise SSO', 'Single Sign-On integration for enterprises.', 'Shield', 'locked', '2024-05-01', 0);

-- Seed Upcoming Releases
INSERT INTO shaper_upcoming_releases (version, release_date, features) VALUES
('v2.5.0', '2024-01-25', ARRAY['New Portfolio Template', 'Drag & Drop Builder', 'Multi-language Support']),
('v2.6.0', '2024-02-15', ARRAY['AI Content Assistant', 'Performance Improvements', 'New Animations']),
('v3.0.0', '2024-03-01', ARRAY['Complete UI Redesign', 'Custom Themes', 'Plugin System']);

-- ==================== HELPER FUNCTIONS ====================

-- Function to get shaper stats for a user
CREATE OR REPLACE FUNCTION get_shaper_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_feedbacks', (SELECT COUNT(*) FROM shaper_feedbacks WHERE user_id = p_user_id),
    'total_bugs_reported', (SELECT COALESCE(SUM(bugs_found), 0) FROM shaper_test_history WHERE user_id = p_user_id),
    'total_features_tested', (SELECT COUNT(DISTINCT feature_id) FROM shaper_test_history WHERE user_id = p_user_id),
    'total_testing_hours', (SELECT COALESCE(ROUND(SUM(duration_minutes)::numeric / 60, 2), 0) FROM shaper_test_history WHERE user_id = p_user_id),
    'feedbacks_completed', (SELECT COUNT(*) FROM shaper_feedbacks WHERE user_id = p_user_id AND status = 'completed'),
    'feedbacks_in_progress', (SELECT COUNT(*) FROM shaper_feedbacks WHERE user_id = p_user_id AND status = 'in_progress'),
    'total_votes_received', (SELECT COALESCE(SUM(votes), 0) FROM shaper_feedbacks WHERE user_id = p_user_id),
    'ranking', (
      SELECT rank FROM (
        SELECT user_id, RANK() OVER (ORDER BY contribution_points DESC) as rank
        FROM shaper_profiles WHERE status = 'approved'
      ) ranked WHERE user_id = p_user_id
    ),
    'total_shapers', (SELECT COUNT(*) FROM shaper_profiles WHERE status = 'approved')
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to vote/unvote on feedback
CREATE OR REPLACE FUNCTION toggle_feedback_vote(p_feedback_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  vote_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM shaper_feedback_votes
    WHERE feedback_id = p_feedback_id AND user_id = p_user_id
  ) INTO vote_exists;

  IF vote_exists THEN
    DELETE FROM shaper_feedback_votes WHERE feedback_id = p_feedback_id AND user_id = p_user_id;
    UPDATE shaper_feedbacks SET votes = votes - 1 WHERE id = p_feedback_id;
    RETURN FALSE; -- unvoted
  ELSE
    INSERT INTO shaper_feedback_votes (feedback_id, user_id) VALUES (p_feedback_id, p_user_id);
    UPDATE shaper_feedbacks SET votes = votes + 1 WHERE id = p_feedback_id;
    RETURN TRUE; -- voted
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_shaper_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_feedback_vote(UUID, UUID) TO authenticated;
