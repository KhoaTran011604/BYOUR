import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EarlyAccessContent } from "@/components/shaper/early-access-content"
import {
  getExperimentalFeatures,
  getUpcomingReleases,
  getShaperProfile,
  getUserFeatureToggles,
} from "@/lib/api/shaper"

export default async function ShaperEarlyAccessPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all data in parallel
  const [experimentalFeatures, upcomingReleases, shaperProfile, featureToggles] = await Promise.all([
    getExperimentalFeatures(),
    getUpcomingReleases(),
    getShaperProfile(user.id),
    getUserFeatureToggles(user.id),
  ])

  return (
    <EarlyAccessContent
      userId={user.id}
      experimentalFeatures={experimentalFeatures}
      upcomingReleases={upcomingReleases}
      shaperProfile={shaperProfile}
      featureToggles={featureToggles}
    />
  )
}
