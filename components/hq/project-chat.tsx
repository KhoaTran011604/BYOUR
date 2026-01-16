"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  Image,
  File,
  X,
  Download,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import type { HQChatMessage, HQAttachment } from "@/lib/types"

interface ProjectChatProps {
  projectId: string
  chatId: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string | null
}

// Static mock messages for demonstration (avoid hydration issues)
const getInitialMockMessages = (): HQChatMessage[] => [
  {
    id: "1",
    chat_id: "chat1",
    sender_id: "boss1",
    sender_type: "boss",
    sender_name: "John Developer",
    sender_avatar: null,
    message: "Hi! I've reviewed the project requirements and I'm excited to get started. I have a few questions about the technical stack.",
    attachments: [],
    is_read: true,
    created_at: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    chat_id: "chat1",
    sender_id: "hq1",
    sender_type: "hq",
    sender_name: "Acme Corp",
    sender_avatar: null,
    message: "Great to have you on board! Sure, feel free to ask any questions.",
    attachments: [],
    is_read: true,
    created_at: "2024-01-15T11:00:00.000Z",
  },
  {
    id: "3",
    chat_id: "chat1",
    sender_id: "boss1",
    sender_type: "boss",
    sender_name: "John Developer",
    sender_avatar: null,
    message: "For the frontend, I'm thinking of using Next.js with TypeScript. Is that aligned with your preferences?",
    attachments: [],
    is_read: true,
    created_at: "2024-01-15T12:00:00.000Z",
  },
  {
    id: "4",
    chat_id: "chat1",
    sender_id: "hq1",
    sender_type: "hq",
    sender_name: "Acme Corp",
    sender_avatar: null,
    message: "Yes, that's perfect! We already use Next.js in some of our other projects.",
    attachments: [],
    is_read: true,
    created_at: "2024-01-15T14:00:00.000Z",
  },
]

export function ProjectChat({
  projectId,
  chatId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: ProjectChatProps) {
  const [messages, setMessages] = useState<HQChatMessage[]>(getInitialMockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    setIsSending(true)

    try {
      // In production, this would upload attachments and send to Supabase
      const newMsg: HQChatMessage = {
        id: Date.now().toString(),
        chat_id: chatId,
        sender_id: currentUserId,
        sender_type: "hq",
        sender_name: currentUserName,
        sender_avatar: currentUserAvatar,
        message: newMessage.trim(),
        attachments: attachments.map((file) => ({
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
        })),
        is_read: false,
        created_at: new Date().toISOString(),
      }

      setMessages([...messages, newMsg])
      setNewMessage("")
      setAttachments([])
    } catch (err) {
      console.error("Send error:", err)
    } finally {
      setIsSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments([...attachments, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
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

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, HQChatMessage[]>)

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(messagesByDate).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-xs text-muted-foreground" suppressHydrationWarning>
                    {date}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {dateMessages.map((message) => {
                  const isOwn = message.sender_id === currentUserId

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={message.sender_avatar || undefined} />
                        <AvatarFallback>
                          {message.sender_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`max-w-[70%] space-y-1 ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {message.sender_name}
                          </span>
                          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                            {formatTime(message.created_at)}
                          </span>
                        </div>

                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.message}
                          </p>
                        </div>

                        {/* Attachments */}
                        {message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.attachments.map((attachment) => (
                              <a
                                key={attachment.id}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted"
                              >
                                {attachment.type.startsWith("image/") ? (
                                  <Image className="h-4 w-4" />
                                ) : (
                                  <File className="h-4 w-4" />
                                )}
                                <span className="max-w-[150px] truncate">
                                  {attachment.name}
                                </span>
                                <Download className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="border-t px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5"
              >
                {file.type.startsWith("image/") ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <File className="h-4 w-4" />
                )}
                <span className="max-w-[150px] truncate text-sm">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={isSending}
          />
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
