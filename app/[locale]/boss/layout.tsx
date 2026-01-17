import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BossLayoutClient } from "@/components/boss/boss-layout-client"

export default async function BossLayout({
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
    <BossLayoutClient user={user} profile={profile}>
      {children}
    </BossLayoutClient>
  )
}
