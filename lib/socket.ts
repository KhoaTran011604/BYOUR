import { io, Socket } from "socket.io-client"

export interface ChatMessage {
  id: string
  chat_id: string
  project_id: string
  sender_id: string
  sender_type: "hq" | "boss"
  sender_name: string
  sender_avatar: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface OnlineUser {
  userId: string
  userName: string
  userAvatar: string | null
  userRole: "hq" | "boss"
  socketId: string
}

export interface ServerToClientEvents {
  "new-message": (message: ChatMessage) => void
  "new-message-notification": (message: ChatMessage) => void
  "user-joined": (data: { userId: string; userName: string; userRole: string }) => void
  "user-left": (data: { userId: string; userName: string }) => void
  "online-users": (users: OnlineUser[]) => void
  "user-typing": (data: { userId: string; userName: string }) => void
  "user-stopped-typing": (data: { userId: string }) => void
}

export interface ClientToServerEvents {
  "register-user": (data: { userId: string }) => void
  "join-chat": (data: {
    chatId: string
    userId: string
    userName: string
    userAvatar: string | null
    userRole: "hq" | "boss"
  }) => void
  "leave-chat": (data: { chatId: string }) => void
  "send-message": (message: ChatMessage & { chatId: string; recipientIds?: string[] }) => void
  "typing-start": (data: { chatId: string; userId: string; userName: string }) => void
  "typing-stop": (data: { chatId: string; userId: string }) => void
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

let socket: TypedSocket | null = null

export const getSocket = (): TypedSocket => {
  if (!socket) {
    socket = io({
      path: "/api/socket",
      autoConnect: false,
    })
  }
  return socket
}

export const connectSocket = (): TypedSocket => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect()
  }
}
