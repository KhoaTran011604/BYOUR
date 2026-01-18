"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import type PusherClient from "pusher-js"
import type { Channel } from "pusher-js"
import { getPusherClient, disconnectPusher, type ChatMessage } from "@/lib/pusher-client"

interface PusherContextType {
  pusher: PusherClient | null
  isConnected: boolean
  subscribeToChat: (chatId: string) => Channel | null
  unsubscribeFromChat: (chatId: string) => void
  subscribeToUser: (userId: string) => Channel | null
  unsubscribeFromUser: (userId: string) => void
  sendMessage: (message: ChatMessage & { chatId: string; recipientIds?: string[] }) => Promise<void>
  startTyping: (chatId: string, userId: string, userName: string) => Promise<void>
  stopTyping: (chatId: string, userId: string) => Promise<void>
}

const PusherContext = createContext<PusherContextType | null>(null)

export function PusherProvider({ children }: { children: ReactNode }) {
  const [pusher, setPusher] = useState<PusherClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const channelsRef = useRef<Map<string, Channel>>(new Map())

  useEffect(() => {
    const pusherClient = getPusherClient()
    setPusher(pusherClient)

    pusherClient.connection.bind("connected", () => {
      console.log("Pusher connected")
      setIsConnected(true)
    })

    pusherClient.connection.bind("disconnected", () => {
      console.log("Pusher disconnected")
      setIsConnected(false)
    })

    pusherClient.connection.bind("error", (err: Error) => {
      console.error("Pusher connection error:", err)
      setIsConnected(false)
    })

    return () => {
      // Unsubscribe from all channels
      channelsRef.current.forEach((_, channelName) => {
        pusherClient.unsubscribe(channelName)
      })
      channelsRef.current.clear()
      disconnectPusher()
    }
  }, [])

  const subscribeToChat = useCallback(
    (chatId: string): Channel | null => {
      if (!pusher) return null

      const channelName = `chat-${chatId}`

      // Return existing channel if already subscribed
      if (channelsRef.current.has(channelName)) {
        return channelsRef.current.get(channelName)!
      }

      const channel = pusher.subscribe(channelName)
      channelsRef.current.set(channelName, channel)
      return channel
    },
    [pusher]
  )

  const unsubscribeFromChat = useCallback(
    (chatId: string) => {
      if (!pusher) return

      const channelName = `chat-${chatId}`
      pusher.unsubscribe(channelName)
      channelsRef.current.delete(channelName)
    },
    [pusher]
  )

  const subscribeToUser = useCallback(
    (userId: string): Channel | null => {
      if (!pusher) return null

      const channelName = `user-${userId}`

      if (channelsRef.current.has(channelName)) {
        return channelsRef.current.get(channelName)!
      }

      const channel = pusher.subscribe(channelName)
      channelsRef.current.set(channelName, channel)
      return channel
    },
    [pusher]
  )

  const unsubscribeFromUser = useCallback(
    (userId: string) => {
      if (!pusher) return

      const channelName = `user-${userId}`
      pusher.unsubscribe(channelName)
      channelsRef.current.delete(channelName)
    },
    [pusher]
  )

  const sendMessage = useCallback(
    async (message: ChatMessage & { chatId: string; recipientIds?: string[] }) => {
      try {
        await fetch("/api/pusher/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        })
      } catch (error) {
        console.error("Error sending message via Pusher:", error)
      }
    },
    []
  )

  const startTyping = useCallback(
    async (chatId: string, userId: string, userName: string) => {
      try {
        await fetch("/api/pusher/typing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, userId, userName, isTyping: true }),
        })
      } catch (error) {
        console.error("Error sending typing indicator:", error)
      }
    },
    []
  )

  const stopTyping = useCallback(
    async (chatId: string, userId: string) => {
      try {
        await fetch("/api/pusher/typing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, userId, isTyping: false }),
        })
      } catch (error) {
        console.error("Error sending stop typing indicator:", error)
      }
    },
    []
  )

  return (
    <PusherContext.Provider
      value={{
        pusher,
        isConnected,
        subscribeToChat,
        unsubscribeFromChat,
        subscribeToUser,
        unsubscribeFromUser,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </PusherContext.Provider>
  )
}

export function usePusher() {
  const context = useContext(PusherContext)
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider")
  }
  return context
}
