import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HQChatsList } from "@/components/hq/hq-chats-list"

export default async function HQChatsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get HQ profile
  const { data: hqProfile } = await supabase
    .from("hq_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!hqProfile || hqProfile.verification_status !== "verified") {
    redirect("/hq")
  }

  // Get projects with active chats (in_progress status with assigned boss)
  const { data: projectsWithChats } = await supabase
    .from("hq_projects")
    .select(`
      id,
      title,
      status,
      assigned_boss_id,
      created_at,
      updated_at,
      hq_project_chats (
        id,
        created_at,
        hq_chat_messages (
          id,
          message,
          sender_id,
          sender_type,
          is_read,
          created_at
        )
      ),
      profiles:assigned_boss_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("hq_id", hqProfile.id)
    .eq("status", "in_progress")
    .not("assigned_boss_id", "is", null)
    .order("updated_at", { ascending: false })

  const { data: projects } = await supabase
    .from("hq_projects")
    .select("*")
    .eq("hq_id", hqProfile.id)
    .order("created_at", { ascending: false })

  return (
    <HQChatsList
      projects={projects || []}
      currentUserId={user.id}
    />
  )
}
