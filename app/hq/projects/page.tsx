import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectsList } from "@/components/hq/projects-list"

export default async function HQProjectsPage() {
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

  // Get all projects
  const { data: projects } = await supabase
    .from("hq_projects")
    .select("*")
    .eq("hq_id", hqProfile.id)
    .order("created_at", { ascending: false })

  return <ProjectsList projects={projects || []} />
}
