"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectGroupChat } from "@/components/shared/project-group-chat"
import { createClient } from "@/lib/supabase/client"

interface HQChatDetailProps {
  chatId: string
  projectId: string
  projectTitle: string
  bossName: string
  bossAvatar: string | null
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string | null
}

export function HQChatDetail({
  chatId,
  projectId,
  projectTitle,
  bossName,
  bossAvatar,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: HQChatDetailProps) {
  const router = useRouter()

  // Mark messages as read when component mounts and on visibility change
  useEffect(() => {
    const markAsRead = async () => {
      const supabase = createClient()
      await supabase.rpc("mark_hq_chat_as_read", {
        p_chat_id: chatId,
        p_user_id: currentUserId,
      })
    }

    markAsRead()

    // Also mark as read when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        markAsRead()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [chatId, currentUserId])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/hq/hq-chats")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={bossAvatar || undefined} />
          <AvatarFallback>{bossName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{projectTitle}</h1>
          <p className="text-sm text-muted-foreground">Chat with {bossName}</p>
        </div>

        <Button variant="outline" asChild>
          <Link href={`/hq/projects/${projectId}`}>View Project</Link>
        </Button>
      </div>

      {/* Chat Component */}
      <ProjectGroupChat
        projectId={projectId}
        chatId={chatId}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        currentUserAvatar={currentUserAvatar}
        userRole="hq"
      />
    </div>
  )
}
