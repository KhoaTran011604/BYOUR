import PusherClient from "pusher-js"

// Types for chat messages
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

export interface TypingUser {
  userId: string
  userName: string
}

// Singleton Pusher client
let pusherClient: PusherClient | null = null

export const getPusherClient = (): PusherClient => {
  if (!pusherClient) {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  }
  return pusherClient
}

export const disconnectPusher = (): void => {
  if (pusherClient) {
    pusherClient.disconnect()
    pusherClient = null
  }
}
