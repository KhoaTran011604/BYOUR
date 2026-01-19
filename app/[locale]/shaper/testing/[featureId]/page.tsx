import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TestFeatureFlow } from "@/components/shaper/test-feature-flow"
import {
  getTestChecklists,
  getTestResultsForHistory,
  getFeatureRollout,
  getOrCreateTestHistory,
} from "@/lib/api/shaper"

interface Props {
  params: Promise<{ featureId: string }>
}

export default async function TestFeaturePage({ params }: Props) {
  const { featureId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is an approved shaper
  const { data: shaperProfile } = await supabase
    .from("shaper_profiles")
    .select("status")
    .eq("user_id", user.id)
    .single()

  if (!shaperProfile || shaperProfile.status !== "approved") {
    redirect("/shaper")
  }

  // Get the feature
  const { data: feature } = await supabase
    .from("shaper_testing_features")
    .select("*")
    .eq("id", featureId)
    .single()

  if (!feature) {
    notFound()
  }

  // Get or create test history
  const { data: testHistory, error: historyError } = await getOrCreateTestHistory(user.id, featureId)

  if (!testHistory || historyError) {
    redirect("/shaper/testing")
  }

  // Fetch all data in parallel
  const [checklists, existingResults, rollout] = await Promise.all([
    getTestChecklists(featureId),
    getTestResultsForHistory(testHistory.id),
    getFeatureRollout(featureId),
  ])

  return (
    <TestFeatureFlow
      userId={user.id}
      feature={feature}
      testHistory={testHistory}
      checklists={checklists}
      existingResults={existingResults}
      rollout={rollout}
    />
  )
}
