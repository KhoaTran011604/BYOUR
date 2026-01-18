import { NextRequest, NextResponse } from "next/server"
import { getPusherServer, getChatChannel, PUSHER_EVENTS } from "@/lib/pusher-server"

export async function POST(request: NextRequest) {
  try {
    const { chatId, userId, userName, isTyping } = await request.json()

    const pusher = getPusherServer()
    const event = isTyping ? PUSHER_EVENTS.USER_TYPING : PUSHER_EVENTS.USER_STOPPED_TYPING

    await pusher.trigger(getChatChannel(chatId), event, {
      userId,
      userName,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending typing indicator via Pusher:", error)
    return NextResponse.json({ error: "Failed to send typing indicator" }, { status: 500 })
  }
}
