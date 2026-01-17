import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WebsiteWizard } from "@/components/boss/website-wizard"

export default async function CreateWebsitePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get profile to get handle
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get boss profile
  const { data: bossProfile } = await supabase
    .from("boss_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If not verified, redirect to registration
  if (!bossProfile || bossProfile.verification_status !== "verified") {
    redirect("/boss")
  }

  // Check if website already exists
  const { data: website } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If website exists, redirect to dashboard
  if (website) {
    redirect("/boss/dashboard")
  }

  // Generate handle if not exists
  const handle = profile.handle || `user-${user.id.slice(0, 8)}`

  return <WebsiteWizard userId={user.id} userHandle={handle} />
}
