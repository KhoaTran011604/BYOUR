import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HQDashboard } from "@/components/hq/hq-dashboard"

export default async function HQDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get HQ profile
  const { data: hqProfile } = await supabase
    .from("hq_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If no profile or not verified, redirect
  if (!hqProfile) {
    redirect("/hq")
  }

  if (hqProfile.verification_status !== "verified") {
    redirect("/hq/verify")
  }

  // Get business profile if exists
  const { data: businessProfile } = await supabase
    .from("hq_business_profiles")
    .select("*")
    .eq("hq_id", hqProfile.id)
    .single()

  // Get projects
  const { data: projects } = await supabase
    .from("hq_projects")
    .select("*")
    .eq("hq_id", hqProfile.id)
    .order("created_at", { ascending: false })

  // Get pending invites count
  const { count: pendingInvites } = await supabase
    .from("hq_invites")
    .select("*", { count: "exact", head: true })
    .eq("hq_id", hqProfile.id)
    .eq("status", "pending")

  return (
    <HQDashboard
      hqProfile={hqProfile}
      businessProfile={businessProfile}
      projects={projects || []}
      pendingInvitesCount={pendingInvites || 0}
    />
  )
}
