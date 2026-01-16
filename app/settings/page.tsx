import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <a href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">TEST-002</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account settings</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <SettingsForm user={user} profile={profile} />
      </main>
    </div>
  )
}
