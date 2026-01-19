import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/config/admin"
import {
  createTestingFeature,
  updateTestingFeature,
  deleteTestingFeature,
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
    const { name, description, version, status, due_date, test_url, docs_url, demo_component, demo_instructions } = body

    if (!name || !description || !version) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await createTestingFeature({
      name,
      description,
      version,
      status: status || "alpha",
      due_date,
      test_url,
      docs_url,
      demo_component,
      demo_instructions,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating feature:", error)
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
        { success: false, error: "Missing feature ID" },
        { status: 400 }
      )
    }

    const result = await updateTestingFeature(id, updates)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating feature:", error)
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
        { success: false, error: "Missing feature ID" },
        { status: 400 }
      )
    }

    const result = await deleteTestingFeature(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting feature:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
