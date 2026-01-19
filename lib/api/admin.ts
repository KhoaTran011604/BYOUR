import { createClient } from "@/lib/supabase/server"
import type { ShaperProfile, Profile } from "@/lib/types"

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
