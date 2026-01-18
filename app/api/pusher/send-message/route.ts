import { NextRequest, NextResponse } from "next/server"
import { getPusherServer, getChatChannel, getUserChannel, PUSHER_EVENTS } from "@/lib/pusher-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, recipientIds, ...message } = body

    const pusher = getPusherServer()

    // Send message to the chat channel
    await pusher.trigger(getChatChannel(chatId), PUSHER_EVENTS.NEW_MESSAGE, message)

    // Send notification to each recipient's personal channel
    if (recipientIds && Array.isArray(recipientIds)) {
      const notificationPromises = recipientIds.map((userId: string) =>
        pusher.trigger(getUserChannel(userId), PUSHER_EVENTS.NEW_MESSAGE_NOTIFICATION, {
          ...message,
          chatId,
        })
      )
      await Promise.all(notificationPromises)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending message via Pusher:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
