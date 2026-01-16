"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  Image,
  FileText,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Download,
  X,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { BossProject, ProjectMessage, ProjectAttachment } from "@/lib/types"

interface ProjectChatProps {
  project: BossProject
  messages: ProjectMessage[]
  currentUserId: string
  currentUserName: string
  currentUserAvatar?: string
  clientName: string
  clientAvatar?: string
  onSendMessage: (message: string, attachments?: File[]) => Promise<void>
}

export function ProjectChat({
  project,
  messages,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  clientName,
  clientAvatar,
  onSendMessage,
}: ProjectChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    setIsSending(true)
    try {
      await onSendMessage(newMessage, attachments)
      setNewMessage("")
      setAttachments([])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString()
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: ProjectMessage[] }[] = []
  messages.forEach((msg) => {
    const dateStr = formatDate(msg.created_at)
    const lastGroup = groupedMessages[groupedMessages.length - 1]
    if (lastGroup?.date === dateStr) {
      lastGroup.messages.push(msg)
    } else {
      groupedMessages.push({ date: dateStr, messages: [msg] })
    }
  })

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="md:hidden">
            <Link href="/boss/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src={clientAvatar} />
            <AvatarFallback>
              {clientName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-muted-foreground">with {clientName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Badge
            variant={
              project.status === "in_progress"
                ? "default"
                : project.status === "completed"
                ? "secondary"
                : "outline"
            }
          >
            {project.status.replace("_", " ")}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Info className="mr-2 h-4 w-4" />
                Project Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View Files
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Divider */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex-1 border-t" />
                <span className="text-xs text-muted-foreground">{group.date}</span>
                <div className="flex-1 border-t" />
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {group.messages.map((message) => {
                  const isOwn = message.sender_id === currentUserId

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwn && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={
                            isOwn
                              ? currentUserAvatar
                              : message.sender_avatar || clientAvatar
                          }
                        />
                        <AvatarFallback className="text-xs">
                          {message.sender_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={cn(
                          "max-w-[70%] space-y-1",
                          isOwn && "items-end"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2",
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.message}
                          </p>
                        </div>

                        {/* Attachments */}
                        {message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.attachments.map((att) => (
                              <AttachmentPreview key={att.id} attachment={att} />
                            ))}
                          </div>
                        )}

                        <p
                          className={cn(
                            "text-xs text-muted-foreground",
                            isOwn && "text-right"
                          )}
                        >
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 border-t px-4 py-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative flex items-center gap-2 rounded-md bg-muted px-3 py-2"
            >
              <FileText className="h-4 w-4" />
              <span className="max-w-[100px] truncate text-sm">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="rounded-full p-0.5 hover:bg-background"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t p-4">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isSending || (!newMessage.trim() && attachments.length === 0)}>
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}

function AttachmentPreview({ attachment }: { attachment: ProjectAttachment }) {
  const isImage = attachment.type.startsWith("image/")

  if (isImage) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg border"
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="h-32 w-32 object-cover"
        />
      </a>
    )
  }

  return (
    <a
      href={attachment.url}
      download={attachment.name}
      className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 hover:bg-muted"
    >
      <FileText className="h-4 w-4" />
      <span className="max-w-[150px] truncate text-sm">{attachment.name}</span>
      <Download className="h-4 w-4 text-muted-foreground" />
    </a>
  )
}
