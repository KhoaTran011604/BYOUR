import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectWizard } from "@/components/hq/project-wizard"

export default async function CreateProjectPage() {
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

  // Get business profile if exists
  const { data: businessProfile } = await supabase
    .from("hq_business_profiles")
    .select("*")
    .eq("hq_id", hqProfile.id)
    .single()

  return (
    <ProjectWizard
      hqId={hqProfile.id}
      businessProfileId={businessProfile?.id || null}
    />
  )
}
