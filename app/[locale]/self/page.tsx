import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SelfContent } from "@/components/self/self-content"

export default async function SelfPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <SelfContent user={user} profile={profile} />
}
