import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HQLayoutClient } from "@/components/hq/hq-layout-client"

export default async function HQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <HQLayoutClient user={user} profile={profile}>
      {children}
    </HQLayoutClient>
  )
}
