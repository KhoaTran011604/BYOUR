import Pusher from "pusher"

// Singleton Pusher server instance
let pusherServer: Pusher | null = null

export const getPusherServer = (): Pusher => {
  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    })
  }
  return pusherServer
}

// Channel naming conventions
export const getChatChannel = (chatId: string) => `chat-${chatId}`
export const getUserChannel = (userId: string) => `user-${userId}`

// Event names
export const PUSHER_EVENTS = {
  NEW_MESSAGE: "new-message",
  NEW_MESSAGE_NOTIFICATION: "new-message-notification",
  USER_TYPING: "user-typing",
  USER_STOPPED_TYPING: "user-stopped-typing",
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
} as const
