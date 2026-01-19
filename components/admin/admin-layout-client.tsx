"use client"

import type { Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { Separator } from "@/components/ui/separator"

interface AdminLayoutClientProps {
  user: User
  profile: Profile | null
  children: React.ReactNode
}

export function AdminLayoutClient({ user, profile, children }: AdminLayoutClientProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Logged in as {profile?.full_name || user.email}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
