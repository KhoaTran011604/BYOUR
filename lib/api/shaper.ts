import { createClient } from "@/lib/supabase/server"
import type {
  ShaperProfile,
  ShaperFeedback,
  ShaperTestingFeature,
  ShaperTestHistory,
  ShaperExperimentalFeature,
  ShaperUpcomingRelease,
  ShaperStats,
  ShaperFeedbackType,
} from "@/lib/types"

// ==================== SHAPER PROFILE ====================

export async function getShaperProfile(userId: string): Promise<ShaperProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching shaper profile:", error)
    return null
  }

  return data
}

export async function applyShaperProgram(
  userId: string,
  reasonForJoining: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("shaper_profiles").insert({
    user_id: userId,
    reason_for_joining: reasonForJoining,
    status: "pending",
  })

  if (error) {
    console.error("Error applying to shaper program:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ==================== SHAPER STATS ====================

export async function getShaperStats(userId: string): Promise<ShaperStats | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_shaper_stats", { p_user_id: userId })

  if (error) {
    console.error("Error fetching shaper stats:", error)
    return null
  }

  return data as ShaperStats
}

// ==================== FEEDBACKS ====================

export async function getMyFeedbacks(userId: string): Promise<ShaperFeedback[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_feedbacks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching feedbacks:", error)
    return []
  }

  return data || []
}

export async function getPopularFeedbacks(limit = 10): Promise<(ShaperFeedback & { author_name: string })[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_feedbacks")
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .order("votes", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching popular feedbacks:", error)
    return []
  }

  return (data || []).map((item) => ({
    ...item,
    author_name: item.profiles?.full_name || "Anonymous",
  }))
}

export async function submitFeedback(
  userId: string,
  type: ShaperFeedbackType,
  title: string,
  description: string
): Promise<{ success: boolean; data?: ShaperFeedback; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_feedbacks")
    .insert({
      user_id: userId,
      type,
      title,
      description,
    })
    .select()
    .single()

  if (error) {
    console.error("Error submitting feedback:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function toggleFeedbackVote(
  feedbackId: string,
  userId: string
): Promise<{ success: boolean; voted: boolean; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("toggle_feedback_vote", {
    p_feedback_id: feedbackId,
    p_user_id: userId,
  })

  if (error) {
    console.error("Error toggling vote:", error)
    return { success: false, voted: false, error: error.message }
  }

  return { success: true, voted: data }
}

export async function getUserVotedFeedbacks(userId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_feedback_votes")
    .select("feedback_id")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user votes:", error)
    return []
  }

  return (data || []).map((v) => v.feedback_id)
}

// ==================== TESTING FEATURES ====================

export async function getTestingFeatures(): Promise<ShaperTestingFeature[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_testing_features")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testing features:", error)
    return []
  }

  return data || []
}

export async function getTestHistory(userId: string): Promise<ShaperTestHistory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_test_history")
    .select(`
      *,
      shaper_testing_features:feature_id (name)
    `)
    .eq("user_id", userId)
    .order("tested_at", { ascending: false })

  if (error) {
    console.error("Error fetching test history:", error)
    return []
  }

  return (data || []).map((item) => ({
    ...item,
    feature_name: item.shaper_testing_features?.name || "Unknown Feature",
  }))
}

export async function startTesting(
  userId: string,
  featureId: string
): Promise<{ success: boolean; data?: ShaperTestHistory; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_test_history")
    .insert({
      user_id: userId,
      feature_id: featureId,
      status: "in_progress",
    })
    .select()
    .single()

  if (error) {
    console.error("Error starting test:", error)
    return { success: false, error: error.message }
  }

  // Increment testers count
  await supabase.rpc("increment_testers_count", { p_feature_id: featureId })

  return { success: true, data }
}

export async function completeTesting(
  testId: string,
  durationMinutes: number,
  bugsFound: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("shaper_test_history")
    .update({
      status: "completed",
      duration_minutes: durationMinutes,
      bugs_found: bugsFound,
    })
    .eq("id", testId)

  if (error) {
    console.error("Error completing test:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ==================== EXPERIMENTAL FEATURES ====================

export async function getExperimentalFeatures(): Promise<ShaperExperimentalFeature[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_experimental_features")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching experimental features:", error)
    return []
  }

  return data || []
}

export async function getUserFeatureToggles(userId: string): Promise<Record<string, boolean>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_user_feature_toggles")
    .select("feature_id, is_enabled")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching feature toggles:", error)
    return {}
  }

  const toggles: Record<string, boolean> = {}
  for (const item of data || []) {
    toggles[item.feature_id] = item.is_enabled
  }
  return toggles
}

export async function toggleFeature(
  userId: string,
  featureId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("shaper_user_feature_toggles")
    .upsert(
      {
        user_id: userId,
        feature_id: featureId,
        is_enabled: enabled,
        enabled_at: enabled ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,feature_id" }
    )

  if (error) {
    console.error("Error toggling feature:", error)
    return { success: false, error: error.message }
  }

  // Update access count if enabling
  if (enabled) {
    await supabase
      .from("shaper_experimental_features")
      .update({ access_count: supabase.rpc("increment_access_count") })
      .eq("id", featureId)
  }

  return { success: true }
}

// ==================== UPCOMING RELEASES ====================

export async function getUpcomingReleases(): Promise<ShaperUpcomingRelease[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_upcoming_releases")
    .select("*")
    .eq("is_released", false)
    .order("release_date", { ascending: true })

  if (error) {
    console.error("Error fetching upcoming releases:", error)
    return []
  }

  return data || []
}
