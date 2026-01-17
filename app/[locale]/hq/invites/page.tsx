import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SentInvitesList } from "@/components/hq/sent-invites-list"

export default async function HQInvitesPage() {
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

  // Get all invites with project info
  const { data: invites } = await supabase
    .from("hq_invites")
    .select(`
      *,
      hq_projects:project_id (
        id,
        title,
        status
      )
    `)
    .eq("hq_id", hqProfile.id)
    .order("created_at", { ascending: false })

  return <SentInvitesList invites={invites || []} />
}
