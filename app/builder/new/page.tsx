import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TemplateSelector } from "@/components/builder/template-selector"

export default async function NewWebsitePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user already has a website
  const { data: existingWebsite } = await supabase.from("websites").select("id").eq("user_id", user.id).single()

  if (existingWebsite) {
    redirect(`/builder/${existingWebsite.id}`)
  }

  // Get user profile for handle suggestion
  const { data: profile } = await supabase.from("profiles").select("handle, full_name").eq("id", user.id).single()

  return <TemplateSelector userId={user.id} userHandle={profile?.handle} userName={profile?.full_name} />
}
