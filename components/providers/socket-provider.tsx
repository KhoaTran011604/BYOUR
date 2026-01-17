"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  getSocket,
  connectSocket,
  disconnectSocket,
  type TypedSocket,
  type ChatMessage,
  type OnlineUser,
} from "@/lib/socket"

interface SocketContextType {
  socket: TypedSocket | null
  isConnected: boolean
  joinChat: (data: {
    chatId: string
    userId: string
    userName: string
    userAvatar: string | null
    userRole: "hq" | "boss"
  }) => void
  leaveChat: (chatId: string) => void
  sendMessage: (message: ChatMessage & { chatId: string }) => void
  startTyping: (chatId: string, userId: string, userName: string) => void
  stopTyping: (chatId: string, userId: string) => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<TypedSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = connectSocket()
    setSocket(socketInstance)

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    return () => {
      disconnectSocket()
    }
  }, [])

  const joinChat = useCallback(
    (data: {
      chatId: string
      userId: string
      userName: string
      userAvatar: string | null
      userRole: "hq" | "boss"
    }) => {
      if (socket?.connected) {
        socket.emit("join-chat", data)
      }
    },
    [socket]
  )

  const leaveChat = useCallback(
    (chatId: string) => {
      if (socket?.connected) {
        socket.emit("leave-chat", { chatId })
      }
    },
    [socket]
  )

  const sendMessage = useCallback(
    (message: ChatMessage & { chatId: string }) => {
      if (socket?.connected) {
        socket.emit("send-message", message)
      }
    },
    [socket]
  )

  const startTyping = useCallback(
    (chatId: string, userId: string, userName: string) => {
      if (socket?.connected) {
        socket.emit("typing-start", { chatId, userId, userName })
      }
    },
    [socket]
  )

  const stopTyping = useCallback(
    (chatId: string, userId: string) => {
      if (socket?.connected) {
        socket.emit("typing-stop", { chatId, userId })
      }
    },
    [socket]
  )

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinChat,
        leaveChat,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
