import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BrowseBosses } from "@/components/hq/browse-bosses"

export default async function HQBossesPage() {
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

  if (!hqProfile || hqProfile.verification_status !== "verified") {
    redirect("/hq")
  }

  // Get verified and available bosses
  const { data: bosses } = await supabase
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
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(50)
  console.log("🚀 ~ HQBossesPage ~ bosses:", bosses)

  // Get HQ's projects for inviting
  const { data: projects } = await supabase
    .from("hq_projects")
    .select("id, title, status, skills_required")
    .eq("hq_id", hqProfile.id)
    .in("status", ["open", "draft"])
  console.log("🚀 ~ HQBossesPage ~ projects:", projects)

  return (
    <BrowseBosses
      bosses={bosses || []}
      projects={projects || []}
      hqId={hqProfile.id}
    />
  )
}
