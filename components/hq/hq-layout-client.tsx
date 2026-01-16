"use client"

import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import type { Profile, UserMode } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

interface HQLayoutClientProps {
  user: User
  profile: Profile
  children: React.ReactNode
}

export function HQLayoutClient({ user, profile, children }: HQLayoutClientProps) {
  const router = useRouter()

  const handleModeChange = async (mode: UserMode) => {
    const supabase = createClient()

    await supabase
      .from("profiles")
      .update({ current_mode: mode })
      .eq("id", user.id)

    // Redirect based on mode
    if (mode === "boss") {
      router.push("/boss")
    } else if (mode === "hq") {
      router.push("/hq")
    } else if (mode === "self") {
      router.push("/self")
    } else if (mode === "shaper") {
      router.push("/shaper")
    } else {
      router.push("/dashboard")
    }

    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader
        user={user}
        profile={profile}
        currentMode={profile.current_mode}
        onModeChange={handleModeChange}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
