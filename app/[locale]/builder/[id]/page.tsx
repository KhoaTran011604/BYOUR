import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WebsiteBuilder } from "@/components/builder/website-builder"

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get website with blocks and services
  const { data: website } = await supabase.from("websites").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!website) {
    notFound()
  }

  const { data: blocks } = await supabase
    .from("website_blocks")
    .select("*")
    .eq("website_id", id)
    .order("order_index", { ascending: true })

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("website_id", id)
    .order("order_index", { ascending: true })

  return <WebsiteBuilder website={website} initialBlocks={blocks || []} initialServices={services || []} />
}
