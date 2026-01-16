"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import type { UserMode, Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import {
  Clock,
  MessageSquare,
  TestTube,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react"

interface ShaperContentProps {
  user: User
  profile: Profile | null
}

export function ShaperContent({ user, profile }: ShaperContentProps) {
  const [currentMode, setCurrentMode] = useState<UserMode>("shaper")
  const shaper_status = "approved"

  const handleModeChange = async (mode: UserMode) => {
    setCurrentMode(mode)
    const supabase = createClient()

    if (profile) {
      await supabase.from("profiles").update({ current_mode: mode }).eq("id", user.id)
    }
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0]

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} profile={profile} currentMode={currentMode} onModeChange={handleModeChange} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Hello, {displayName}</h1>
          <p className="text-muted-foreground">Internal contribution and product development</p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Approval - Waiting Screen */}
          {shaper_status === "pending" && (
            <Card className="md:col-span-2 lg:col-span-3 border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="rounded-full bg-amber-500/10 p-4">
                    <Clock className="h-12 w-12 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Pending approval</h3>
                    <p className="text-muted-foreground max-w-md">
                      Your Shaper application is being reviewed by Admin. We will notify you via email when there is a result.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Application submitted successfully</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approved - Shaper Dashboard */}
          {shaper_status === "approved" && (
            <>
              {/* Feedback Hub */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Feedback Hub</CardTitle>
                  </div>
                  <CardDescription>Contribute feedback for the product</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send feedback, suggest new features, and report bugs to improve the platform.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/shaper/feedback">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Testing Environment */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Testing Environment</CardTitle>
                  </div>
                  <CardDescription>Test new features</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access testing environment to test features before official release.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/shaper/testing">
                      <TestTube className="mr-2 h-4 w-4" />
                      Test New Features
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Experimental Features */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Experimental Features</CardTitle>
                  </div>
                  <CardDescription>Earliest experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get early access to experimental features before all other users.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/shaper/early-access">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Early Access
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Rejected Status */}
          {shaper_status === "rejected" && (
            <Card className="md:col-span-2 lg:col-span-3 border-red-500/30 bg-red-500/5">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="rounded-full bg-red-500/10 p-4">
                    <Users className="h-12 w-12 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Application not approved</h3>
                    <p className="text-muted-foreground max-w-md">
                      Sorry, your Shaper application was not approved this time. You can apply again later.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Apply again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
