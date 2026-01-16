import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EarningsDashboard } from "@/components/boss/earnings-dashboard"
import type { BossEarnings, EarningsTransaction } from "@/lib/types"

export default async function EarningsPage() {
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

  if (!bossProfile || bossProfile.verification_status !== "verified") {
    redirect("/boss")
  }

  // Get completed projects for earnings calculation
  const { data: projects } = await supabase
    .from("boss_projects")
    .select("*")
    .eq("boss_id", bossProfile.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })

  // Calculate earnings
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const totalEarned = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0

  const thisMonthEarnings =
    projects
      ?.filter((p) => p.completed_at && new Date(p.completed_at) >= thisMonthStart)
      .reduce((sum, p) => sum + (p.budget || 0), 0) || 0

  const lastMonthEarnings =
    projects
      ?.filter(
        (p) =>
          p.completed_at &&
          new Date(p.completed_at) >= lastMonthStart &&
          new Date(p.completed_at) <= lastMonthEnd
      )
      .reduce((sum, p) => sum + (p.budget || 0), 0) || 0

  const earnings: BossEarnings = {
    total_earned: totalEarned,
    pending_amount: 0, // Would come from pending payments
    this_month: thisMonthEarnings,
    last_month: lastMonthEarnings,
    currency: "€",
    projects_completed: projects?.length || 0,
    average_rating: 4.8, // Would come from reviews
  }

  // Convert projects to transactions
  const transactions: EarningsTransaction[] =
    projects?.map((project) => ({
      id: project.id,
      project_id: project.id,
      project_title: project.title,
      client_name: "Client", // Would come from client relation
      amount: project.budget || 0,
      currency: project.currency || "€",
      status: "completed" as const,
      date: project.completed_at || project.created_at,
    })) || []

  return <EarningsDashboard earnings={earnings} transactions={transactions} />
}
