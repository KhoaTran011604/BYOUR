import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VerificationStatus } from "@/components/boss/verification-status"

export default async function BossVerifyPage() {
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

  // If no profile, redirect to registration
  if (!bossProfile) {
    redirect("/boss")
  }

  // If verified, redirect to dashboard
  if (bossProfile.verification_status === "verified") {
    redirect("/boss/dashboard")
  }

  return (
    <VerificationStatus
      userId={user.id}
      initialStatus={bossProfile.verification_status}
      registrationNumber={bossProfile.registration_number}
    />
  )
}
