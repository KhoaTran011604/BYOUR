import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BossDashboard } from "@/components/boss/boss-dashboard"

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
  console.log("🚀 ~ BossDashboardPage ~ website:", website)

  // Get invites
  const { data: invites } = await supabase
    .from("boss_invites")
    .select("*")
    .eq("boss_id", bossProfile.id)
    .order("created_at", { ascending: false })

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
      invites={invites || []}
      projects={projects || []}
      earnings={earnings}
    />
  )
}
