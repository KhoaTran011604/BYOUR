export type UserMode = "boss" | "hq" | "self" | "shaper"

export type ShaperStatus = "pending" | "approved" | "rejected"

export type WebsiteTemplate = "minimal" | "editorial" | "grid"

export type BlockType = "hero" | "about" | "services" | "contact" | "creative"

export type PriceType = "fixed" | "quote"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  handle: string | null
  avatar_url: string | null
  current_mode: UserMode
  shaper_status: ShaperStatus | null
  created_at: string
  updated_at: string
}

export interface Website {
  id: string
  user_id: string
  handle: string
  template: WebsiteTemplate
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteBlock {
  id: string
  website_id: string
  block_type: BlockType
  order_index: number
  content: HeroContent | AboutContent | ServicesContent | ContactContent | CreativeContent
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface HeroContent {
  title: string
  subtitle: string
  image_url: string | null
  cta_text: string | null
  cta_link: string | null
}

export interface AboutContent {
  heading: string
  description: string
  image_url: string | null
}

export interface ServicesContent {
  heading: string
  description: string | null
}

export interface ContactContent {
  heading: string
  email: string | null
  phone: string | null
  address: string | null
  social_links: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
}

export type CreativeItemType = "heading" | "image" | "link" | "divider" | "spacer" | "button" | "text"

export interface CreativeItem {
  id: string
  type: CreativeItemType
  // Heading
  heading_text?: string
  heading_size?: "large" | "medium" | "small"
  // Image
  image_url?: string
  image_alt?: string
  // Link
  link_text?: string
  link_url?: string
  // Button
  button_text?: string
  button_url?: string
  button_style?: "primary" | "secondary" | "outline"
  // Text
  text_content?: string
  // Spacer
  spacer_size?: "small" | "medium" | "large"
}

export interface CreativeContent {
  name: string
  items: CreativeItem[]
}

export interface Service {
  id: string
  website_id: string
  title: string
  description: string | null
  price_type: PriceType
  price_amount: number | null
  currency: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ==================== BOSS MODE TYPES ====================

export type BossVerificationStatus = "pending" | "verifying" | "verified" | "failed"

export type InviteStatus = "pending" | "accepted" | "declined" | "expired"

export type ProjectStatus = "invited" | "in_progress" | "review" | "completed" | "cancelled"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed"

export interface BossProfile {
  id: string
  user_id: string
  registration_number: string
  company_name: string | null
  business_type: string | null
  headline: string | null
  bio: string | null
  skills: string[]
  hourly_rate: number | null
  currency: string
  rating: number | null
  reviews_count: number
  projects_completed: number
  is_available: boolean
  location: string | null
  timezone: string | null
  verification_status: BossVerificationStatus
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface BossInvite {
  id: string
  boss_id: string
  hq_id: string
  hq_project_id: string
  client_name: string
  client_avatar: string | null
  project_title: string
  project_description: string | null
  budget_min: number | null
  budget_max: number | null
  currency: string
  deadline: string | null
  message: string | null
  proposed_budget: number | null
  proposed_deadline: string | null
  status: InviteStatus
  created_at: string
  updated_at: string
}

export interface BossProject {
  id: string
  boss_id: string
  client_id: string
  invite_id: string
  title: string
  description: string | null
  status: ProjectStatus
  budget: number | null
  currency: string
  deadline: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectMessage {
  id: string
  project_id: string
  sender_id: string
  sender_name: string
  sender_avatar: string | null
  message: string
  attachments: ProjectAttachment[]
  created_at: string
}

export interface ProjectAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface BossPayment {
  id: string
  project_id: string
  boss_id: string
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: string | null
  transaction_id: string | null
  paid_at: string | null
  created_at: string
}

export interface BossEarnings {
  total_earned: number
  pending_amount: number
  this_month: number
  last_month: number
  currency: string
  projects_completed: number
  average_rating: number | null
}

export interface EarningsTransaction {
  id: string
  project_id: string
  project_title: string
  client_name: string
  amount: number
  currency: string
  status: PaymentStatus
  date: string
}

// ==================== HQ MODE TYPES ====================

export type HQVerificationStatus = "pending" | "verifying" | "verified" | "failed"

export type HQProjectStatus = "draft" | "open" | "in_progress" | "review" | "completed" | "cancelled"

export type HQInviteStatus = "pending" | "accepted" | "declined" | "expired"

export type HQPaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded"

export interface HQProfile {
  id: string
  user_id: string
  cro_vat_number: string
  company_name: string
  company_address: string | null
  company_website: string | null
  industry: string | null
  company_size: string | null
  verification_status: HQVerificationStatus
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface HQBusinessProfile {
  id: string
  hq_id: string
  display_name: string
  logo_url: string | null
  description: string | null
  contact_email: string | null
  contact_phone: string | null
  social_links: {
    linkedin?: string
    twitter?: string
    facebook?: string
    website?: string
  }
  created_at: string
  updated_at: string
}

export interface HQProject {
  id: string
  hq_id: string
  business_profile_id: string | null
  title: string
  description: string
  requirements: string | null
  deliverables: string[]
  budget_min: number
  budget_max: number
  currency: string
  timeline_start: string | null
  timeline_end: string | null
  deadline: string | null
  tags: string[]
  skills_required: string[]
  status: HQProjectStatus
  assigned_boss_id: string | null
  created_at: string
  updated_at: string
}

export interface HQBossSuggestion {
  id: string
  user_id: string
  full_name: string
  avatar_url: string | null
  company_name: string | null
  business_type: string | null
  headline: string | null
  bio: string | null
  skills: string[]
  hourly_rate: number | null
  currency: string
  rating: number | null
  reviews_count: number
  projects_completed: number
  match_score: number
  website_handle: string | null
}

export interface HQInvite {
  id: string
  hq_id: string
  project_id: string
  boss_id: string
  message: string | null
  proposed_budget: number | null
  proposed_deadline: string | null
  status: HQInviteStatus
  responded_at: string | null
  created_at: string
  updated_at: string
}

export interface HQPayment {
  id: string
  hq_id: string
  project_id: string
  boss_id: string
  amount: number
  currency: string
  status: HQPaymentStatus
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface HQProjectChat {
  id: string
  project_id: string
  created_at: string
  updated_at: string
}

export interface HQChatMessage {
  id: string
  chat_id: string
  sender_id: string
  sender_type: "hq" | "boss"
  sender_name: string
  sender_avatar: string | null
  message: string
  attachments: HQAttachment[]
  is_read: boolean
  created_at: string
}

export interface HQAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface HQMilestone {
  id: string
  project_id: string
  title: string
  description: string | null
  amount: number
  currency: string
  due_date: string | null
  status: "pending" | "in_progress" | "submitted" | "approved" | "rejected"
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface HQDashboardStats {
  total_projects: number
  active_projects: number
  completed_projects: number
  pending_invites: number
  total_spent: number
  currency: string
}

// Project creation wizard steps
export type HQProjectWizardStep =
  | "details"
  | "budget"
  | "tags"
  | "preview"

export interface HQProjectDraft {
  title: string
  description: string
  requirements: string
  deliverables: string[]
  budget_min: number
  budget_max: number
  currency: string
  timeline_start: string | null
  timeline_end: string | null
  deadline: string | null
  tags: string[]
  skills_required: string[]
}
