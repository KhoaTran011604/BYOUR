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
  RefreshCw,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { HQAttachment } from "@/lib/types"

interface ChatMessage {
  id: string
  chat_id: string
  sender_id: string
  sender_type: "hq" | "boss"
  sender_name: string
  sender_avatar: string | null
  message: string
  attachments: HQAttachment[]
  is_read: boolean
  created_at: string
}

interface ProjectGroupChatProps {
  projectId: string
  chatId: string | null
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string | null
  userRole: "hq" | "boss" // Role of current user
}

export function ProjectGroupChat({
  projectId,
  chatId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  userRole,
}: ProjectGroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId)
  const [attachments, setAttachments] = useState<File[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load messages
  useEffect(() => {
    loadMessages()
  }, [currentChatId])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const loadMessages = async () => {
    if (!currentChatId) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    // Fetch messages with sender profile info
    const { data, error } = await supabase
      .from("hq_chat_messages")
      .select(`
        *,
        profiles:sender_id (
          full_name,
          avatar_url
        )
      `)
      .eq("chat_id", currentChatId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error loading messages:", error)
    } else {
      // Transform data to match ChatMessage type
      const transformedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
        id: msg.id,
        chat_id: msg.chat_id,
        sender_id: msg.sender_id,
        sender_type: msg.sender_type,
        sender_name: msg.profiles?.full_name || (msg.sender_type === "hq" ? "HQ" : "Boss"),
        sender_avatar: msg.profiles?.avatar_url || null,
        message: msg.message,
        attachments: msg.attachments || [],
        is_read: msg.is_read,
        created_at: msg.created_at,
      }))
      setMessages(transformedMessages)
    }
    setIsLoading(false)
  }

  const ensureChatExists = async (): Promise<string | null> => {
    if (currentChatId) {
      return currentChatId
    }

    const supabase = createClient()

    // Create new chat for this project
    const { data, error } = await supabase
      .from("hq_project_chats")
      .insert({ project_id: projectId })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating chat:", error)
      return null
    }

    setCurrentChatId(data.id)
    return data.id
  }

  const handleSend = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    setIsSending(true)

    try {
      const supabase = createClient()

      // Ensure chat exists
      const chatIdToUse = await ensureChatExists()
      if (!chatIdToUse) {
        throw new Error("Could not create chat")
      }

      // Upload attachments if any
      const uploadedAttachments: HQAttachment[] = []
      for (const file of attachments) {
        const fileName = `${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("chat-attachments")
          .upload(`${projectId}/${fileName}`, file)

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("chat-attachments")
            .getPublicUrl(uploadData.path)

          uploadedAttachments.push({
            id: Date.now().toString(),
            name: file.name,
            url: urlData.publicUrl,
            type: file.type,
            size: file.size,
          })
        }
      }

      // Insert message with current user's role
      const { data: msgData, error: msgError } = await supabase
        .from("hq_chat_messages")
        .insert({
          chat_id: chatIdToUse,
          sender_id: currentUserId,
          sender_type: userRole,
          message: newMessage.trim(),
          attachments: uploadedAttachments,
        })
        .select()
        .single()

      if (msgError) throw msgError

      // Add to local state
      const newMsg: ChatMessage = {
        id: msgData.id,
        chat_id: chatIdToUse,
        sender_id: currentUserId,
        sender_type: userRole,
        sender_name: currentUserName,
        sender_avatar: currentUserAvatar,
        message: newMessage.trim(),
        attachments: uploadedAttachments,
        is_read: false,
        created_at: msgData.created_at,
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

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadMessages()
    setIsRefreshing(false)
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
      return date.toLocaleDateString("en-US")
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
  }, {} as Record<string, ChatMessage[]>)

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg border">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Group Chat</span>
          <Badge variant="outline" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh messages"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="min-h-0 flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation now!
            </p>
          </div>
        ) : (
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
                    const isHQ = message.sender_type === "hq"

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isOwn ? "flex-row-reverse" : ""
                        )}
                      >
                        {/* Avatar with HQ indicator */}
                        <div className="relative shrink-0">
                          <Avatar className={cn(
                            "h-8 w-8",
                            isHQ && !isOwn && "ring-2 ring-amber-400 ring-offset-2"
                          )}>
                            <AvatarImage src={message.sender_avatar || undefined} />
                            <AvatarFallback className={cn(
                              isHQ && !isOwn && "bg-amber-100 text-amber-700"
                            )}>
                              {message.sender_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {isHQ && !isOwn && (
                            <div className="absolute -top-1 -right-1 rounded-full bg-amber-400 p-0.5">
                              <Crown className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        <div
                          className={cn(
                            "max-w-[70%] space-y-1",
                            isOwn ? "items-end" : "items-start"
                          )}
                        >
                          {/* Sender name with HQ badge */}
                          <div className={cn(
                            "flex items-center gap-2",
                            isOwn ? "flex-row-reverse" : ""
                          )}>
                            <span className={cn(
                              "text-xs font-medium",
                              isHQ && !isOwn && "text-amber-600"
                            )}>
                              {message.sender_name}
                            </span>
                            {isHQ && !isOwn && (
                              <Badge variant="secondary" className="h-4 bg-amber-100 px-1 text-[10px] text-amber-700">
                                HQ
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                              {formatTime(message.created_at)}
                            </span>
                          </div>

                          {/* Message bubble */}
                          <div
                            className={cn(
                              "rounded-lg px-3 py-2",
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : isHQ
                                  ? "bg-amber-50 border border-amber-200 text-amber-900"
                                  : "bg-muted"
                            )}
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
        )}
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
            placeholder="Enter message..."
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
