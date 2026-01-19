import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/config/admin"
import { toggleTestingFeatureActive } from "@/lib/api/admin"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing feature ID" },
        { status: 400 }
      )
    }

    const result = await toggleTestingFeatureActive(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error toggling feature:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
