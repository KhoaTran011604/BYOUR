import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BusinessProfileForm } from "@/components/hq/business-profile-form"

export default async function HQBusinessPage() {
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

  // Get existing business profile if any
  const { data: businessProfile } = await supabase
    .from("hq_business_profiles")
    .select("*")
    .eq("hq_id", hqProfile.id)
    .single()

  return (
    <BusinessProfileForm
      hqId={hqProfile.id}
      existingProfile={businessProfile}
      companyName={hqProfile.company_name}
    />
  )
}
