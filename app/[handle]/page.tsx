import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PublicWebsite } from "@/components/public/public-website"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const supabase = await createClient()

  const { data: website } = await supabase
    .from("websites")
    .select("*, profiles(full_name)")
    .eq("handle", handle)
    .eq("is_published", true)
    .single()

  if (!website) {
    return {
      title: "Không tìm thấy trang",
    }
  }

  const profileName = (website.profiles as { full_name: string | null })?.full_name || handle

  return {
    title: `${profileName} | TEST-002`,
    description: `Website chuyên nghiệp của ${profileName} trên TEST-002`,
    openGraph: {
      title: `${profileName} | TEST-002`,
      description: `Website chuyên nghiệp của ${profileName}`,
      url: `https://byour.co/${handle}`,
    },
  }
}

export default async function PublicWebsitePage({ params }: Props) {
  const { handle } = await params
  const supabase = await createClient()

  // Get published website by handle
  const { data: website } = await supabase
    .from("websites")
    .select("*, profiles(full_name, avatar_url)")
    .eq("handle", handle)
    .eq("is_published", true)
    .single()

  if (!website) {
    notFound()
  }

  // Get website blocks
  const { data: blocks } = await supabase
    .from("website_blocks")
    .select("*")
    .eq("website_id", website.id)
    .eq("is_visible", true)
    .order("order_index", { ascending: true })

  // Get services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("website_id", website.id)
    .eq("is_active", true)
    .order("order_index", { ascending: true })

  const profile = website.profiles as { full_name: string | null; avatar_url: string | null } | null

  return (
    <PublicWebsite
      website={website}
      blocks={blocks || []}
      services={services || []}
      profileName={profile?.full_name || null}
      profileAvatar={profile?.avatar_url || null}
    />
  )
}
