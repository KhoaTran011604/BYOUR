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
  ShaperTestChecklist,
  ShaperTestResult,
  ShaperFeatureFeedback,
  FeatureRollout,
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

// ==================== FEATURE ROLLOUT & TEST FLOW ====================

export async function getFeatureRollout(featureId: string): Promise<FeatureRollout | null> {
  const supabase = await createClient()

  // Get feature name first to match with rollout
  const { data: feature } = await supabase
    .from("shaper_testing_features")
    .select("name")
    .eq("id", featureId)
    .single()

  if (!feature) return null

  const { data, error } = await supabase
    .from("feature_rollouts")
    .select("*")
    .eq("feature_name", feature.name)
    .maybeSingle()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching feature rollout:", error)
    return null
  }

  return data || null
}

export async function getTestChecklists(featureId: string): Promise<ShaperTestChecklist[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_test_checklists")
    .select("*")
    .eq("feature_id", featureId)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching test checklists:", error)
    return []
  }

  return data || []
}

export async function getTestResultsForHistory(testHistoryId: string): Promise<ShaperTestResult[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_test_results")
    .select("*")
    .eq("test_history_id", testHistoryId)

  if (error) {
    console.error("Error fetching test results:", error)
    return []
  }

  return data || []
}

export async function submitTestResult(
  testHistoryId: string,
  checklistId: string,
  userId: string,
  passed: boolean,
  actualResult?: string,
  notes?: string
): Promise<{ success: boolean; data?: ShaperTestResult; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_test_results")
    .upsert(
      {
        test_history_id: testHistoryId,
        checklist_id: checklistId,
        user_id: userId,
        passed,
        actual_result: actualResult || null,
        notes: notes || null,
      },
      { onConflict: "test_history_id,checklist_id" }
    )
    .select()
    .single()

  if (error) {
    console.error("Error submitting test result:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getFeatureFeedback(
  testHistoryId: string
): Promise<ShaperFeatureFeedback | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_feature_feedback")
    .select("*")
    .eq("test_history_id", testHistoryId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching feature feedback:", error)
    return null
  }

  return data || null
}

export async function submitFeatureFeedback(
  testHistoryId: string,
  featureId: string,
  userId: string,
  feedback: {
    overall_rating: number
    recommend_release: boolean
    usability_score: number
    performance_score: number
    design_score: number
    pros?: string
    cons?: string
    suggestions?: string
    would_use_as_boss?: boolean
    would_use_as_hq?: boolean
  }
): Promise<{ success: boolean; data?: ShaperFeatureFeedback; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_feature_feedback")
    .upsert(
      {
        test_history_id: testHistoryId,
        feature_id: featureId,
        user_id: userId,
        ...feedback,
      },
      { onConflict: "test_history_id,feature_id" }
    )
    .select()
    .single()

  if (error) {
    console.error("Error submitting feature feedback:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function completeFeatureTest(
  testHistoryId: string,
  featureId: string,
  passedCount: number,
  totalCount: number,
  recommendRelease: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.rpc("complete_feature_test", {
    p_test_history_id: testHistoryId,
    p_feature_id: featureId,
    p_passed_count: passedCount,
    p_total_count: totalCount,
    p_recommend_release: recommendRelease,
  })

  if (error) {
    console.error("Error completing feature test:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getOrCreateTestHistory(
  userId: string,
  featureId: string
): Promise<{ data: ShaperTestHistory | null; isNew: boolean; error?: string }> {
  const supabase = await createClient()

  // Check for existing in-progress test
  const { data: existing } = await supabase
    .from("shaper_test_history")
    .select(`
      *,
      shaper_testing_features:feature_id (name)
    `)
    .eq("user_id", userId)
    .eq("feature_id", featureId)
    .eq("status", "in_progress")
    .single()

  if (existing) {
    return {
      data: {
        ...existing,
        feature_name: existing.shaper_testing_features?.name || "Unknown Feature",
      },
      isNew: false,
    }
  }

  // Create new test history
  const { data, error } = await supabase
    .from("shaper_test_history")
    .insert({
      user_id: userId,
      feature_id: featureId,
      status: "in_progress",
    })
    .select(`
      *,
      shaper_testing_features:feature_id (name)
    `)
    .single()

  if (error) {
    console.error("Error creating test history:", error)
    return { data: null, isNew: false, error: error.message }
  }

  return {
    data: {
      ...data,
      feature_name: data.shaper_testing_features?.name || "Unknown Feature",
    },
    isNew: true,
  }
}
