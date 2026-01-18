
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ProjectGroupChat } from "@/components/shared/project-group-chat"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface HQChatDetailPageProps {
  params: Promise<{ projectId: string }>
}

export default async function HQChatDetailPage({ params }: HQChatDetailPageProps) {
  const { projectId } = await params
  const supabase = await createClient()
    
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  // Get HQ profile
  const { data: hqProfile } = await supabase
    .from("hq_profiles")
    .select("*, hq_business_profiles(display_name, logo_url)")
    .eq("user_id", user.id)
    .single()

  if (!hqProfile || hqProfile.verification_status !== "verified") {
    redirect("/hq")
  }

  // Get project
  const { data: project } = await supabase
    .from("hq_projects")
    .select("*")
    .eq("id", projectId)

    .eq("hq_id", hqProfile.id)
    .single()

  if (!project) {
    notFound()
  }

  // Fetch chatId server-side
  let chatId: string | null = null
  if (project.status === "in_progress") {
    const { data: chatData } = await supabase
      .from("hq_project_chats")
      .select("id")
      .eq("project_id", project.id)
      .single()

    if (chatData) {
      chatId = chatData.id
    }
  }

  // Get suggested bosses based on project skills
  const { data: suggestedBosses } = await supabase
    .from("boss_profiles")
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        handle
      )
    `)
    .eq("verification_status", "verified")
    .eq("is_available", true)
    .limit(20)

  // Get display name from business profile or company name
  const displayName =
    hqProfile.hq_business_profiles?.display_name ||
    hqProfile.company_name ||
    userProfile?.full_name ||
    "HQ"
  const avatarUrl = hqProfile.hq_business_profiles?.logo_url || userProfile?.avatar_url || null




  return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/hq/hq-chats">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          <div>
            <h1 className="text-2xl font-bold">Project Chats</h1>
            <p className="text-muted-foreground">Communicate with your project bosses</p>
          </div>
        </div>
        <ProjectGroupChat
          projectId={project.id}
          chatId={chatId}
          currentUserId={user.id}
          currentUserName={displayName}
          currentUserAvatar={avatarUrl}
          userRole="hq"
        />
    </div>
  )
}
