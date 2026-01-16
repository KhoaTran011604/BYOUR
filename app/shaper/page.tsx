import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ShaperContent } from "@/components/shaper/shaper-content"

export default async function ShaperPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <ShaperContent user={user} profile={profile} />
}
