import type {
  ShaperFeedback,
  ShaperTestingFeature,
  ShaperTestHistory,
  ShaperExperimentalFeature,
  ShaperUpcomingRelease,
  ShaperStats,
  ShaperProfile,
  ShaperFeedbackType,
  ShaperFeedbackStatus,
  ShaperTestingStatus,
  ShaperFeatureStatus,
} from "@/lib/types"

// ==================== CONFIG ====================

export const feedbackTypeConfig: Record<
  ShaperFeedbackType,
  { label: string; color: string }
> = {
  bug: { label: "Bug", color: "text-red-500" },
  feature: { label: "Feature", color: "text-blue-500" },
  improvement: { label: "Improvement", color: "text-green-500" },
}

export const feedbackStatusConfig: Record<
  ShaperFeedbackStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-gray-500" },
  reviewing: { label: "Reviewing", color: "bg-blue-500" },
  planned: { label: "Planned", color: "bg-purple-500" },
  in_progress: { label: "In Progress", color: "bg-amber-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  closed: { label: "Closed", color: "bg-gray-400" },
}

export const testingStatusConfig: Record<
  ShaperTestingStatus,
  { label: string; color: string; description: string }
> = {
  alpha: { label: "Alpha", color: "bg-purple-500", description: "Early stage, may have bugs" },
  beta: { label: "Beta", color: "bg-blue-500", description: "Feature complete, testing" },
  testing: { label: "Testing", color: "bg-amber-500", description: "Active testing phase" },
  ready: { label: "Ready", color: "bg-green-500", description: "Ready for release" },
}

export const featureStatusConfig: Record<
  ShaperFeatureStatus,
  { label: string; color: string }
> = {
  available: { label: "Available", color: "bg-green-500" },
  coming_soon: { label: "Coming Soon", color: "bg-amber-500" },
  locked: { label: "Not Available", color: "bg-gray-500" },
}

// ==================== MOCK DATA - FEEDBACKS ====================

export const mockMyFeedbacks: ShaperFeedback[] = [
  {
    id: "fb-001",
    user_id: "user-001",
    type: "feature",
    title: "Add dark mode for dashboard",
    description: "Would like dark mode option for more comfortable night work.",
    status: "reviewing",
    votes: 24,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-12T15:30:00Z",
  },
  {
    id: "fb-002",
    user_id: "user-001",
    type: "bug",
    title: "Cannot save Creative block with many items",
    description: "When adding more than 10 items to creative block, the save button becomes unresponsive.",
    status: "in_progress",
    votes: 8,
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-14T09:00:00Z",
  },
  {
    id: "fb-003",
    user_id: "user-001",
    type: "improvement",
    title: "Improve builder page load speed",
    description: "Builder is slow with many blocks, hope team can optimize performance.",
    status: "completed",
    votes: 45,
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-15T16:00:00Z",
  },
]

export const mockPopularFeedbacks: (ShaperFeedback & { author_name: string })[] = [
  {
    id: "fb-101",
    user_id: "user-101",
    type: "feature",
    title: "Google Analytics integration",
    description: "Integrate Google Analytics for website tracking.",
    status: "planned",
    votes: 89,
    author_name: "Minh Tran",
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-10T15:30:00Z",
  },
  {
    id: "fb-102",
    user_id: "user-102",
    type: "feature",
    title: "Export website as PDF portfolio",
    description: "Allow exporting the website as a PDF document.",
    status: "reviewing",
    votes: 67,
    author_name: "Linh Nguyen",
    created_at: "2024-01-03T11:00:00Z",
    updated_at: "2024-01-11T14:20:00Z",
  },
  {
    id: "fb-103",
    user_id: "user-103",
    type: "feature",
    title: "Custom domain support",
    description: "Connect custom domain to published website.",
    status: "in_progress",
    votes: 156,
    author_name: "Duc Pham",
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-13T10:00:00Z",
  },
  {
    id: "fb-104",
    user_id: "user-104",
    type: "improvement",
    title: "Add more templates",
    description: "Expand the template library with more design options.",
    status: "planned",
    votes: 78,
    author_name: "Hoa Le",
    created_at: "2024-01-04T12:00:00Z",
    updated_at: "2024-01-12T16:00:00Z",
  },
]

// ==================== MOCK DATA - TESTING ====================

export const mockTestingFeatures: ShaperTestingFeature[] = [
  {
    id: "test-001",
    name: "New Template: Portfolio Pro",
    description: "New portfolio template with beautiful layouts and smooth animations.",
    version: "v2.5.0-beta",
    status: "testing",
    due_date: "2024-01-20",
    testers_count: 12,
    bugs_count: 3,
    test_url: "/builder/new?template=portfolio-pro-beta",
    docs_url: "/docs/templates/portfolio-pro",
    demo_component: null,
    demo_instructions: "Truy cập URL test để xem và thử nghiệm template mới.",
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "test-002",
    name: "Drag & Drop Reordering",
    description: "Drag and drop feature to reorder blocks in the website builder.",
    version: "v2.5.0-beta",
    status: "testing",
    due_date: "2024-01-18",
    testers_count: 8,
    bugs_count: 1,
    test_url: "/builder/test-dnd",
    docs_url: "/docs/builder/drag-drop",
    demo_component: null,
    demo_instructions: "Truy cập URL test và thử kéo thả các block.",
    created_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "test-003",
    name: "AI Content Generator",
    description: "Use AI to auto-generate content for website blocks.",
    version: "v2.6.0-alpha",
    status: "alpha",
    due_date: "2024-02-01",
    testers_count: 5,
    bugs_count: 7,
    test_url: "/builder/test-ai",
    docs_url: "/docs/ai/content-generator",
    demo_component: null,
    demo_instructions: "Truy cập URL test và thử tạo nội dung bằng AI.",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "test-004",
    name: "Multi-language Support",
    description: "Multi-language support for websites with translation management.",
    version: "v2.5.0-beta",
    status: "ready",
    due_date: "2024-01-15",
    testers_count: 15,
    bugs_count: 0,
    test_url: "/builder/test-i18n",
    docs_url: "/docs/i18n/setup",
    demo_component: null,
    demo_instructions: "Truy cập URL test và thử đổi ngôn ngữ.",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "test-005",
    name: "HQ Rating for Boss",
    description: "Cho phép Boss đánh giá HQ sau khi hoàn thành dự án.",
    version: "v2.9.0-beta",
    status: "testing",
    due_date: "2024-03-01",
    testers_count: 0,
    bugs_count: 0,
    test_url: null,
    docs_url: "/docs/features/hq-rating",
    demo_component: "hq-rating",
    demo_instructions: "Thử nghiệm tính năng đánh giá Boss ngay trong trang này.",
    created_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "test-006",
    name: "Boss Skills & Tags",
    description: "Cho phép Boss thêm skills và tags vào hồ sơ để HQ dễ dàng tìm kiếm và lựa chọn.",
    version: "v2.9.0-beta",
    status: "testing",
    due_date: "2024-03-15",
    testers_count: 0,
    bugs_count: 0,
    test_url: null,
    docs_url: "/docs/features/boss-skills-tags",
    demo_component: "boss-skills-tags",
    demo_instructions: "Thử nghiệm thêm/xóa skills và tags cho hồ sơ Boss.",
    created_at: "2024-02-05T00:00:00Z",
  },
]

export const mockTestHistory: ShaperTestHistory[] = [
  {
    id: "th-001",
    user_id: "user-001",
    feature_id: "test-001",
    feature_name: "New Template: Portfolio Pro",
    tested_at: "2024-01-12T14:00:00Z",
    duration_minutes: 45,
    bugs_found: 2,
    status: "completed",
  },
  {
    id: "th-002",
    user_id: "user-001",
    feature_id: "test-002",
    feature_name: "Drag & Drop Reordering",
    tested_at: "2024-01-10T10:00:00Z",
    duration_minutes: 30,
    bugs_found: 1,
    status: "completed",
  },
  {
    id: "th-003",
    user_id: "user-001",
    feature_id: "test-005",
    feature_name: "Dark Mode",
    tested_at: "2024-01-05T16:00:00Z",
    duration_minutes: 60,
    bugs_found: 0,
    status: "completed",
  },
]

// ==================== MOCK DATA - EXPERIMENTAL FEATURES ====================

export const mockExperimentalFeatures: ShaperExperimentalFeature[] = [
  {
    id: "exp-001",
    name: "AI Content Assistant",
    description: "Use AI to suggest and auto-generate content for your website.",
    icon_name: "Brain",
    status: "available",
    release_date: "2024-02-15",
    access_count: 156,
    is_enabled: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "exp-002",
    name: "Advanced Analytics",
    description: "Detailed analytics dashboard with heatmaps and user journey tracking.",
    icon_name: "Zap",
    status: "available",
    release_date: "2024-02-20",
    access_count: 89,
    is_enabled: false,
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "exp-003",
    name: "Custom Themes",
    description: "Create and share custom themes with the community.",
    icon_name: "Palette",
    status: "available",
    release_date: "2024-03-01",
    access_count: 234,
    is_enabled: true,
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "exp-004",
    name: "Multi-site Management",
    description: "Manage multiple websites from a single dashboard.",
    icon_name: "Globe",
    status: "coming_soon",
    release_date: "2024-03-15",
    access_count: 0,
    is_enabled: false,
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "exp-005",
    name: "Team Collaboration",
    description: "Invite team members and collaborate real-time on website.",
    icon_name: "Users",
    status: "coming_soon",
    release_date: "2024-04-01",
    access_count: 0,
    is_enabled: false,
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "exp-006",
    name: "Enterprise SSO",
    description: "Single Sign-On integration for enterprises.",
    icon_name: "Shield",
    status: "locked",
    release_date: "2024-05-01",
    access_count: 0,
    is_enabled: false,
    created_at: "2024-01-25T00:00:00Z",
  },
]

// ==================== MOCK DATA - ROADMAP ====================

export const mockUpcomingReleases: ShaperUpcomingRelease[] = [
  {
    version: "v2.5.0",
    release_date: "2024-01-25",
    features: ["New Portfolio Template", "Drag & Drop Builder", "Multi-language Support"],
  },
  {
    version: "v2.6.0",
    release_date: "2024-02-15",
    features: ["AI Content Assistant", "Performance Improvements", "New Animations"],
  },
  {
    version: "v3.0.0",
    release_date: "2024-03-01",
    features: ["Complete UI Redesign", "Custom Themes", "Plugin System"],
  },
]

// ==================== MOCK DATA - STATS ====================

export const mockShaperStats: ShaperStats = {
  total_feedbacks: 3,
  total_bugs_reported: 5,
  total_features_tested: 4,
  total_testing_hours: 2.25,
  ranking: 15,
  total_shapers: 127,
  feedbacks_completed: 1,
  feedbacks_in_progress: 1,
  total_votes_received: 77,
}

// ==================== MOCK DATA - SHAPER PROFILE ====================

export const mockShaperProfile: ShaperProfile = {
  id: "shaper-001",
  user_id: "user-001",
  status: "approved",
  reason_for_joining: "I want to help improve the platform and provide valuable feedback from a user perspective.",
  applied_at: "2024-01-01T00:00:00Z",
  approved_at: "2024-01-02T10:00:00Z",
  rejected_at: null,
  rejection_reason: null,
  badge_level: "silver",
  contribution_points: 450,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z",
}

// ==================== HELPER FUNCTIONS ====================

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}m`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getBadgeLevelColor(level: ShaperProfile["badge_level"]): string {
  const colors = {
    bronze: "text-amber-600",
    silver: "text-gray-400",
    gold: "text-yellow-500",
    platinum: "text-purple-500",
  }
  return colors[level]
}
