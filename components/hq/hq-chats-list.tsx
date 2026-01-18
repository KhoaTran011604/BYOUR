"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquare, ArrowLeft, Clock, User, FolderOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

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

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No active chats</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
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
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30",
                chat.unreadCount > 0 && "border-l-4 border-l-primary bg-primary/5"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar với status indicator */}
                  <div className="relative shrink-0">
                    <Avatar className="h-14 w-14 ring-2 ring-background shadow-sm">
                      <AvatarImage src={chat.bossAvatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-lg font-semibold">
                        {chat.bossName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm">
                        {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header row: Project title + time */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderOpen className="h-4 w-4 text-primary shrink-0" />
                        <h3 className={cn(
                          "font-semibold truncate text-base",
                          chat.unreadCount > 0 && "text-foreground"
                        )}>
                          {chat.projectTitle}
                        </h3>
                      </div>
                      {chat.lastMessageTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(chat.lastMessageTime)}</span>
                        </div>
                      )}
                    </div>

                    {/* Boss info row */}
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {chat.bossName}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                        Boss
                      </Badge>
                    </div>

                    {/* Last message preview */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className={cn(
                        "flex-1 text-sm truncate rounded-md bg-muted/50 px-3 py-2",
                        chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          <span className="truncate">{chat.lastMessage}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
