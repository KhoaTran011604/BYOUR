import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/config/admin"
import {
  createTestChecklist,
  updateTestChecklist,
  deleteTestChecklist,
} from "@/lib/api/admin"

async function checkAdminAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    return null
  }
  return user
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkAdminAuth()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { feature_id, title, description, test_steps, expected_result, order_index, is_critical } = body

    if (!feature_id || !title || !expected_result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await createTestChecklist({
      feature_id,
      title,
      description,
      test_steps: test_steps || [],
      expected_result,
      order_index,
      is_critical,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating checklist:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await checkAdminAuth()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing checklist ID" },
        { status: 400 }
      )
    }

    const result = await updateTestChecklist(id, updates)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating checklist:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await checkAdminAuth()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing checklist ID" },
        { status: 400 }
      )
    }

    const result = await deleteTestChecklist(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting checklist:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
