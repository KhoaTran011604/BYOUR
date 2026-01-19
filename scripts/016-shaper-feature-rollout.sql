-- ==================== FEATURE ROLLOUT SYSTEM ====================
-- This script adds feature rollout management for Shaper testing workflow

-- 1. Feature Rollouts table - tracks which features are enabled for which user modes
CREATE TABLE feature_rollouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE, -- e.g., 'realtime_chat_notifications'
  feature_name TEXT NOT NULL,
  description TEXT,

  -- Rollout status for each mode
  enabled_for_shapers BOOLEAN DEFAULT TRUE,
  enabled_for_boss BOOLEAN DEFAULT FALSE,
  enabled_for_hq BOOLEAN DEFAULT FALSE,
  enabled_for_all BOOLEAN DEFAULT FALSE,

  -- Rollout percentage (for gradual rollout)
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),

  -- Metadata
  min_tests_required INTEGER DEFAULT 5,
  min_success_rate INTEGER DEFAULT 80, -- percentage
  current_tests_count INTEGER DEFAULT 0,
  current_success_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'testing' CHECK (status IN ('testing', 'ready_for_review', 'approved', 'rolling_out', 'fully_released', 'paused')),

  -- Timestamps
  testing_started_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  boss_enabled_at TIMESTAMPTZ,
  hq_enabled_at TIMESTAMPTZ,
  fully_released_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Test Checklists - predefined test cases for each feature
CREATE TABLE shaper_test_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID NOT NULL REFERENCES shaper_testing_features(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  test_steps TEXT[], -- Array of step-by-step instructions
  expected_result TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_critical BOOLEAN DEFAULT FALSE, -- Must pass for feature approval
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Test Results - tracks individual test results for each checklist item
CREATE TABLE shaper_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_history_id UUID NOT NULL REFERENCES shaper_test_history(id) ON DELETE CASCADE,
  checklist_id UUID NOT NULL REFERENCES shaper_test_checklists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  passed BOOLEAN NOT NULL,
  actual_result TEXT,
  notes TEXT,
  screenshot_url TEXT,

  tested_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_history_id, checklist_id)
);

-- 4. Feature Feedback - detailed feedback after testing
CREATE TABLE shaper_feature_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_history_id UUID NOT NULL REFERENCES shaper_test_history(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES shaper_testing_features(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Overall assessment
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  recommend_release BOOLEAN, -- Does the tester recommend releasing this feature?

  -- Detailed feedback
  usability_score INTEGER CHECK (usability_score >= 1 AND usability_score <= 5),
  performance_score INTEGER CHECK (performance_score >= 1 AND performance_score <= 5),
  design_score INTEGER CHECK (design_score >= 1 AND design_score <= 5),

  -- Text feedback
  pros TEXT,
  cons TEXT,
  suggestions TEXT,

  -- For Boss/HQ specific feedback
  would_use_as_boss BOOLEAN,
  would_use_as_hq BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(test_history_id, feature_id)
);

-- Create indexes
CREATE INDEX idx_feature_rollouts_status ON feature_rollouts(status);
CREATE INDEX idx_feature_rollouts_feature_key ON feature_rollouts(feature_key);
CREATE INDEX idx_test_checklists_feature_id ON shaper_test_checklists(feature_id);
CREATE INDEX idx_test_results_test_history ON shaper_test_results(test_history_id);
CREATE INDEX idx_feature_feedback_feature ON shaper_feature_feedback(feature_id);

-- Enable RLS
ALTER TABLE feature_rollouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_test_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE shaper_feature_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view feature rollouts" ON feature_rollouts FOR SELECT USING (true);

CREATE POLICY "Approved shapers can view test checklists" ON shaper_test_checklists
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM shaper_profiles WHERE user_id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "Users can view their own test results" ON shaper_test_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own test results" ON shaper_test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feature feedback" ON shaper_feature_feedback
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own feature feedback" ON shaper_feature_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feature feedback" ON shaper_feature_feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_feature_rollouts_updated_at BEFORE UPDATE ON feature_rollouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_feedback_updated_at BEFORE UPDATE ON shaper_feature_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== TEST SCENARIO: Real-time Chat Notifications ====================

-- Add the new testing feature
INSERT INTO shaper_testing_features (
  id, name, description, version, status, due_date, testers_count, bugs_count, test_url, docs_url
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Real-time Chat Notifications',
  'Receive instant push notifications when Boss/HQ sends a new message in project chat. Includes sound alerts, desktop notifications, and in-app badges.',
  'v2.7.0-beta',
  'testing',
  '2024-02-28',
  0,
  0,
  '/test/chat-notifications',
  '/docs/features/chat-notifications'
);

-- Add feature rollout entry
INSERT INTO feature_rollouts (
  feature_key, feature_name, description,
  enabled_for_shapers, enabled_for_boss, enabled_for_hq,
  min_tests_required, min_success_rate, status
) VALUES (
  'realtime_chat_notifications',
  'Real-time Chat Notifications',
  'Push notifications for new messages in project chat',
  TRUE, FALSE, FALSE,
  5, 80, 'testing'
);

-- Add test checklists for the feature
INSERT INTO shaper_test_checklists (feature_id, title, description, test_steps, expected_result, order_index, is_critical) VALUES
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Enable Notifications Permission',
  'Test that the browser notification permission request works correctly',
  ARRAY[
    'Navigate to the test page',
    'Click "Enable Notifications" button',
    'Browser should show permission dialog',
    'Click "Allow" in the browser dialog'
  ],
  'Notification permission is granted and a success message is shown',
  1,
  TRUE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Receive Notification - New Message',
  'Test receiving a notification when a new message arrives',
  ARRAY[
    'Open a project chat page',
    'Have another user (or simulate) send a message',
    'Wait for notification to appear'
  ],
  'Desktop notification appears with sender name and message preview within 3 seconds',
  2,
  TRUE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Sound Alert',
  'Test that sound plays when notification arrives',
  ARRAY[
    'Ensure device volume is on',
    'Enable sound in notification settings',
    'Trigger a new message notification'
  ],
  'A pleasant notification sound plays along with the visual notification',
  3,
  FALSE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'In-App Badge Counter',
  'Test the unread message badge on the chat icon',
  ARRAY[
    'Navigate away from chat to another page',
    'Have messages sent to your chat',
    'Check the chat icon in the navigation'
  ],
  'Red badge shows the correct count of unread messages',
  4,
  TRUE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Click Notification to Open Chat',
  'Test that clicking the notification opens the correct chat',
  ARRAY[
    'Receive a notification',
    'Click on the desktop notification'
  ],
  'Browser opens/focuses and navigates directly to the relevant chat conversation',
  5,
  TRUE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Do Not Disturb Mode',
  'Test that notifications can be muted',
  ARRAY[
    'Go to notification settings',
    'Enable "Do Not Disturb" mode',
    'Trigger a new message'
  ],
  'No notification appears while DND is enabled',
  6,
  FALSE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Notification When Tab is Active',
  'Test behavior when user is already viewing the chat',
  ARRAY[
    'Keep the chat tab open and visible',
    'Receive a new message in the same conversation'
  ],
  'No desktop notification (since user is already viewing), only in-chat message appears',
  7,
  FALSE
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Mobile Responsiveness',
  'Test notifications on mobile browser',
  ARRAY[
    'Open the test page on mobile browser',
    'Enable notifications',
    'Trigger a notification while app is in background'
  ],
  'Mobile browser notification appears correctly',
  8,
  FALSE
);

-- ==================== HELPER FUNCTIONS ====================

-- Function to check if a feature is enabled for a user based on their mode
CREATE OR REPLACE FUNCTION is_feature_enabled(p_feature_key TEXT, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_mode TEXT;
  rollout RECORD;
BEGIN
  -- Get user's current mode
  SELECT current_mode INTO user_mode FROM profiles WHERE id = p_user_id;

  -- Get rollout settings
  SELECT * INTO rollout FROM feature_rollouts WHERE feature_key = p_feature_key;

  IF rollout IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if enabled for all
  IF rollout.enabled_for_all THEN
    RETURN TRUE;
  END IF;

  -- Check based on mode
  CASE user_mode
    WHEN 'shaper' THEN RETURN rollout.enabled_for_shapers;
    WHEN 'boss' THEN RETURN rollout.enabled_for_boss;
    WHEN 'hq' THEN RETURN rollout.enabled_for_hq;
    ELSE RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit test completion and update stats
CREATE OR REPLACE FUNCTION complete_feature_test(
  p_test_history_id UUID,
  p_feature_id UUID,
  p_passed_count INTEGER,
  p_total_count INTEGER,
  p_recommend_release BOOLEAN
)
RETURNS VOID AS $$
DECLARE
  feature_key TEXT;
  success_threshold NUMERIC;
BEGIN
  -- Update test history status
  UPDATE shaper_test_history
  SET status = 'completed'
  WHERE id = p_test_history_id;

  -- Update testing feature stats
  UPDATE shaper_testing_features
  SET testers_count = testers_count + 1
  WHERE id = p_feature_id;

  -- Get feature key from testing features (simplified - in real app would have proper link)
  -- Update feature rollout stats
  UPDATE feature_rollouts
  SET
    current_tests_count = current_tests_count + 1,
    current_success_count = CASE
      WHEN (p_passed_count::NUMERIC / p_total_count * 100) >= 80 AND p_recommend_release
      THEN current_success_count + 1
      ELSE current_success_count
    END
  WHERE feature_name = (SELECT name FROM shaper_testing_features WHERE id = p_feature_id);

  -- Check if feature is ready for review
  UPDATE feature_rollouts
  SET status = 'ready_for_review'
  WHERE
    feature_name = (SELECT name FROM shaper_testing_features WHERE id = p_feature_id)
    AND current_tests_count >= min_tests_required
    AND (current_success_count::NUMERIC / current_tests_count * 100) >= min_success_rate
    AND status = 'testing';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enable feature for Boss/HQ (admin only)
CREATE OR REPLACE FUNCTION enable_feature_for_mode(p_feature_key TEXT, p_mode TEXT)
RETURNS VOID AS $$
BEGIN
  CASE p_mode
    WHEN 'boss' THEN
      UPDATE feature_rollouts
      SET enabled_for_boss = TRUE, boss_enabled_at = NOW(), status = 'rolling_out'
      WHERE feature_key = p_feature_key;
    WHEN 'hq' THEN
      UPDATE feature_rollouts
      SET enabled_for_hq = TRUE, hq_enabled_at = NOW(), status = 'rolling_out'
      WHERE feature_key = p_feature_key;
    WHEN 'all' THEN
      UPDATE feature_rollouts
      SET
        enabled_for_boss = TRUE,
        enabled_for_hq = TRUE,
        enabled_for_all = TRUE,
        fully_released_at = NOW(),
        status = 'fully_released'
      WHERE feature_key = p_feature_key;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION is_feature_enabled(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_feature_test(UUID, UUID, INTEGER, INTEGER, BOOLEAN) TO authenticated;

-- ==================== ADDITIONAL SEED DATA ====================

-- Add more realistic testing features
INSERT INTO shaper_testing_features (name, description, version, status, due_date, test_url, docs_url) VALUES
('Quick Invoice Generator', 'Generate professional invoices from project milestones with one click. Supports PDF export and email sending.', 'v2.7.0-beta', 'alpha', '2024-03-15', '/test/quick-invoice', '/docs/features/invoice'),
('AI Project Matcher', 'AI-powered matching between HQ projects and Boss skills for better project recommendations.', 'v2.8.0-alpha', 'alpha', '2024-04-01', '/test/ai-matcher', '/docs/features/ai-matcher'),
('Video Call Integration', 'Built-in video calls for Boss-HQ meetings without leaving the platform.', 'v3.0.0-alpha', 'alpha', '2024-05-01', NULL, '/docs/features/video-call');

-- Add feature rollouts for new features
INSERT INTO feature_rollouts (feature_key, feature_name, description, min_tests_required, status) VALUES
('quick_invoice', 'Quick Invoice Generator', 'One-click invoice generation from milestones', 3, 'testing'),
('ai_project_matcher', 'AI Project Matcher', 'AI matching for projects and bosses', 10, 'testing'),
('video_call', 'Video Call Integration', 'Built-in video calls', 15, 'testing');
