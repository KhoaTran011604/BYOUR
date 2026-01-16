import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: website } = await supabase
    .from("websites")
    .select("handle, is_published")
    .eq("user_id", user.id)
    .single()

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
          <h1 className="text-2xl font-bold">Hồ sơ của bạn</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và website</p>
        </div>

        <ProfileForm user={user} profile={profile} website={website} />
      </main>
    </div>
  )
}
