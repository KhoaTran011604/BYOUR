import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RegistrationForm } from "@/components/boss/registration-form"

export default async function BossPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user already has a boss profile
  const { data: bossProfile } = await supabase
    .from("boss_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If verified, redirect to dashboard
  if (bossProfile?.verification_status === "verified") {
    redirect("/boss/dashboard")
  }

  // If verifying, redirect to verification page
  if (
    bossProfile?.verification_status === "verifying" ||
    bossProfile?.verification_status === "pending"
  ) {
    redirect("/boss/verify")
  }

  // Show registration form
  return <RegistrationForm userId={user.id} />
}
