import { createClient } from "@/lib/supabase/server"
import type { ShaperProfile, Profile, ShaperTestingFeature, ShaperTestingStatus, ShaperTestChecklist } from "@/lib/types"

export interface ShaperRequestWithProfile extends ShaperProfile {
  profile: Pick<Profile, "email" | "full_name" | "avatar_url">
}

export async function getAllShaperProfiles(): Promise<ShaperRequestWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_profiles")
    .select(`
      *,
      profile:profiles!shaper_profiles_user_id_fkey (
        email,
        full_name,
        avatar_url
      )
    `)
    .order("applied_at", { ascending: false })

  if (error) {
    console.error("Error fetching shaper profiles:", error)
    return []
  }

  return (data || []).map((item) => ({
    ...item,
    profile: item.profile || { email: "", full_name: null, avatar_url: null },
  }))
}

export async function updateShaperStatus(
  shaperId: string,
  newStatus: "pending" | "approved" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  }

  if (newStatus === "approved") {
    updateData.approved_at = new Date().toISOString()
    updateData.rejected_at = null
    updateData.rejection_reason = null
  } else if (newStatus === "rejected") {
    updateData.rejected_at = new Date().toISOString()
    updateData.approved_at = null
  } else {
    updateData.approved_at = null
    updateData.rejected_at = null
    updateData.rejection_reason = null
  }

  const { error } = await supabase
    .from("shaper_profiles")
    .update(updateData)
    .eq("id", shaperId)

  if (error) {
    console.error("Error updating shaper status:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ==================== TESTING FEATURES (ADMIN) ====================

export async function getAllTestingFeatures(): Promise<ShaperTestingFeature[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_testing_features")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testing features:", error)
    return []
  }

  return data || []
}

export async function createTestingFeature(feature: {
  name: string
  description: string
  version: string
  status: ShaperTestingStatus
  due_date?: string | null
  test_url?: string | null
  docs_url?: string | null
  demo_component?: string | null
  demo_instructions?: string | null
}): Promise<{ success: boolean; data?: ShaperTestingFeature; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_testing_features")
    .insert({
      name: feature.name,
      description: feature.description,
      version: feature.version,
      status: feature.status,
      due_date: feature.due_date || null,
      test_url: feature.test_url || null,
      docs_url: feature.docs_url || null,
      demo_component: feature.demo_component || "generic",
      demo_instructions: feature.demo_instructions || null,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating testing feature:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateTestingFeature(
  id: string,
  updates: {
    name?: string
    description?: string
    version?: string
    status?: ShaperTestingStatus
    due_date?: string | null
    test_url?: string | null
    docs_url?: string | null
    demo_component?: string | null
    demo_instructions?: string | null
    is_active?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Handle empty strings as null
  if (updateData.due_date === "") updateData.due_date = null
  if (updateData.test_url === "") updateData.test_url = null
  if (updateData.docs_url === "") updateData.docs_url = null
  if (updateData.demo_instructions === "") updateData.demo_instructions = null

  const { error } = await supabase
    .from("shaper_testing_features")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Error updating testing feature:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteTestingFeature(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("shaper_testing_features")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting testing feature:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function toggleTestingFeatureActive(
  id: string
): Promise<{ success: boolean; isActive?: boolean; error?: string }> {
  const supabase = await createClient()

  // Get current state
  const { data: feature, error: fetchError } = await supabase
    .from("shaper_testing_features")
    .select("is_active")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching feature:", fetchError)
    return { success: false, error: fetchError.message }
  }

  const newIsActive = !feature.is_active

  const { error } = await supabase
    .from("shaper_testing_features")
    .update({
      is_active: newIsActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error toggling feature:", error)
    return { success: false, error: error.message }
  }

  return { success: true, isActive: newIsActive }
}

export async function getTestingFeatureById(id: string): Promise<ShaperTestingFeature | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_testing_features")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching testing feature:", error)
    return null
  }

  return data
}

// ==================== TEST CHECKLISTS (ADMIN) ====================

export async function getTestChecklistsByFeature(featureId: string): Promise<ShaperTestChecklist[]> {
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

export async function createTestChecklist(checklist: {
  feature_id: string
  title: string
  description?: string | null
  test_steps: string[]
  expected_result: string
  order_index?: number
  is_critical?: boolean
}): Promise<{ success: boolean; data?: ShaperTestChecklist; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shaper_test_checklists")
    .insert({
      feature_id: checklist.feature_id,
      title: checklist.title,
      description: checklist.description || null,
      test_steps: checklist.test_steps,
      expected_result: checklist.expected_result,
      order_index: checklist.order_index || 1,
      is_critical: checklist.is_critical || false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating test checklist:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateTestChecklist(
  id: string,
  updates: {
    title?: string
    description?: string | null
    test_steps?: string[]
    expected_result?: string
    order_index?: number
    is_critical?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = { ...updates }

  // Handle empty strings as null
  if (updateData.description === "") updateData.description = null

  const { error } = await supabase
    .from("shaper_test_checklists")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Error updating test checklist:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteTestChecklist(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("shaper_test_checklists")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting test checklist:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
