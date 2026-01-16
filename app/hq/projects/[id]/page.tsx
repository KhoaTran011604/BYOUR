import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectDetail } from "@/components/hq/project-detail"

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  // Get HQ profile
  const { data: hqProfile } = await supabase
    .from("hq_profiles")
    .select("*, hq_business_profiles(display_name, logo_url)")
    .eq("user_id", user.id)
    .single()

  if (!hqProfile || hqProfile.verification_status !== "verified") {
    redirect("/hq")
  }

  // Get project
  const { data: project } = await supabase
    .from("hq_projects")
    .select("*")
    .eq("id", id)
    .eq("hq_id", hqProfile.id)
    .single()

  if (!project) {
    notFound()
  }

  // Get invites for this project
  const { data: invites } = await supabase
    .from("hq_invites")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  // Get suggested bosses based on project skills
  const { data: suggestedBosses } = await supabase
    .from("boss_profiles")
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        handle
      )
    `)
    .eq("verification_status", "verified")
    .eq("is_available", true)
    .limit(20)

  // Get display name from business profile or company name
  const displayName =
    hqProfile.hq_business_profiles?.display_name ||
    hqProfile.company_name ||
    userProfile?.full_name ||
    "HQ"
  const avatarUrl = hqProfile.hq_business_profiles?.logo_url || userProfile?.avatar_url || null

  return (
    <ProjectDetail
      project={project}
      invites={invites || []}
      suggestedBosses={suggestedBosses || []}
      hqId={hqProfile.id}
      currentUserId={user.id}
      currentUserName={displayName}
      currentUserAvatar={avatarUrl}
    />
  )
}
