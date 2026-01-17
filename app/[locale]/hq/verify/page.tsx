import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HQVerificationStatus } from "@/components/hq/hq-verification-status"

export default async function HQVerifyPage() {
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

  // If no profile, redirect to registration
  if (!hqProfile) {
    redirect("/hq")
  }

  // If verified, redirect to dashboard
  if (hqProfile.verification_status === "verified") {
    redirect("/hq/dashboard")
  }

  return (
    <HQVerificationStatus
      userId={user.id}
      initialStatus={hqProfile.verification_status}
      croVatNumber={hqProfile.cro_vat_number}
      companyName={hqProfile.company_name}
    />
  )
}
