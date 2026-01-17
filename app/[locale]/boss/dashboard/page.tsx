import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BossDashboard } from "@/components/boss/boss-dashboard"
import type { BossInvite } from "@/lib/types"

export default async function BossDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get boss profile
  const { data: bossProfile } = await supabase
    .from("boss_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If not verified, redirect to registration/verification
  if (!bossProfile || bossProfile.verification_status !== "verified") {
    redirect("/boss")
  }

  // Get website
  const { data: website } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Get invites from hq_invites with joined project and business profile data
  // Note: hq_invites.boss_id references profiles(id) which is user_id
  const { data: rawInvites } = await supabase
    .from("hq_invites")
    .select(`
      id,
      hq_id,
      project_id,
      boss_id,
      message,
      proposed_budget,
      proposed_deadline,
      status,
      created_at,
      updated_at,
      hq_projects!inner (
        title,
        description,
        budget_min,
        budget_max,
        currency,
        deadline
      ),
      hq_profiles!inner (
        company_name,
        hq_business_profiles (
          display_name,
          logo_url
        )
      )
    `)
    .eq("boss_id", user.id)
    .order("created_at", { ascending: false })

  // Transform data to BossInvite format
  const invites: BossInvite[] = (rawInvites || []).map((invite: any) => ({
    id: invite.id,
    boss_id: invite.boss_id,
    hq_id: invite.hq_id,
    hq_project_id: invite.project_id,
    client_name: invite.hq_profiles?.hq_business_profiles?.display_name
      || invite.hq_profiles?.company_name
      || "Unknown Company",
    client_avatar: invite.hq_profiles?.hq_business_profiles?.logo_url || null,
    project_title: invite.hq_projects?.title || "Untitled Project",
    project_description: invite.hq_projects?.description || null,
    budget_min: invite.hq_projects?.budget_min || null,
    budget_max: invite.hq_projects?.budget_max || null,
    currency: invite.hq_projects?.currency || "EUR",
    deadline: invite.hq_projects?.deadline || null,
    message: invite.message,
    proposed_budget: invite.proposed_budget,
    proposed_deadline: invite.proposed_deadline,
    status: invite.status,
    created_at: invite.created_at,
    updated_at: invite.updated_at,
  }))

  // Get projects
  const { data: projects } = await supabase
    .from("boss_projects")
    .select("*")
    .eq("boss_id", bossProfile.id)
    .order("created_at", { ascending: false })

  // Calculate earnings (in production, this would be a proper aggregation)
  const completedProjects = projects?.filter((p) => p.status === "completed") || []
  const totalEarned = completedProjects.reduce((sum, p) => sum + (p.budget || 0), 0)

  const earnings = {
    total_earned: totalEarned,
    pending_amount: 0,
    this_month: 0,
    last_month: 0,
    currency: "€",
    projects_completed: completedProjects.length,
    average_rating: null,
  }

  return (
    <BossDashboard
      bossProfile={bossProfile}
      website={website}
      invites={invites}
      projects={projects || []}
      earnings={earnings}
      currentUserId={user.id}
    />
  )
}
