export type UserMode = "boss" | "hq" | "self" | "shaper"

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
