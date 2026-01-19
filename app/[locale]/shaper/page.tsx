import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ShaperContent } from "@/components/shaper/shaper-content"
import { getShaperProfile, getShaperStats } from "@/lib/api/shaper"

export default async function ShaperPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch shaper-specific data
  const shaperProfile = await getShaperProfile(user.id)
  const shaperStats = await getShaperStats(user.id)

  return (
    <ShaperContent
      user={user}
      profile={profile}
      shaperProfile={shaperProfile}
      shaperStats={shaperStats}
    />
  )
}
