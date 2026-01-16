import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VerificationForm } from "@/components/hq/verification-form"

export default async function HQPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user already has an HQ profile
  const { data: hqProfile } = await supabase
    .from("hq_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If verified, redirect to dashboard
  if (hqProfile?.verification_status === "verified") {
    redirect("/hq/dashboard")
  }

  // If verifying, redirect to verification page
  if (
    hqProfile?.verification_status === "verifying" ||
    hqProfile?.verification_status === "pending"
  ) {
    redirect("/hq/verify")
  }

  // Show verification form
  return <VerificationForm userId={user.id} />
}
