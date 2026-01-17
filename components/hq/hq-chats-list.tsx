"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessage {
  id: string
  message: string
  sender_id: string
  sender_type: string
  is_read: boolean
  created_at: string
}

interface ProjectChat {
  id: string
  created_at: string
  hq_chat_messages: ChatMessage[]
}

interface BossProfile {
  id: string
  full_name: string
  avatar_url: string | null
}

interface ProjectWithChat {
  id: string
  title: string
  status: string
  assigned_boss_id: string
  created_at: string
  updated_at: string
  hq_project_chats: ProjectChat[]
  profiles: BossProfile | null
}

interface HQChatsListProps {
  projects: ProjectWithChat[]
  currentUserId: string
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
  return date.toLocaleDateString()
}

export function HQChatsList({ projects, currentUserId }: HQChatsListProps) {
  const router = useRouter()

  // Process projects to get chat info
  const chatsData = projects
    .map((project) => {
       const chat = project.hq_project_chats?.[0]
       const messages = chat?.hq_chat_messages || []
       const sortedMessages = [...messages].sort(
         (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
       )
       const lastMessage = sortedMessages[0] || null
       const unreadCount = messages.filter(
         (m) => !m.is_read && m.sender_id !== currentUserId
       ).length

      return {
        projectId: project.id,
        chatId: chat?.id,
        projectTitle: project.title,
        bossName: project.profiles?.full_name || "Boss",
        bossAvatar: project.profiles?.avatar_url,
        lastMessage:  "No messages yet",
        lastMessageTime: null,
        unreadCount:0,
      }
    })

  if (chatsData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/hq/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Project Chats</h1>
            <p className="text-muted-foreground">Communicate with your project bosses</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No active chats</p>
            <p className="text-sm text-muted-foreground">
              Chats will appear here when you have projects in progress with assigned bosses.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/hq/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Project Chats</h1>
          <p className="text-muted-foreground">
            {chatsData.length} active chat{chatsData.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {chatsData.map((chat) => (
          <Link key={chat.projectId} href={`/hq/hq-chats/${chat.projectId}`}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.bossAvatar || undefined} />
                  <AvatarFallback>
                    {chat.bossName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.projectTitle}</h3>
                    {chat.lastMessageTime && (
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        {formatTimeAgo(chat.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.bossName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <Badge variant="default" className="shrink-0">
                    {chat.unreadCount}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
