"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import type { UserMode, Profile, ShaperProfile, ShaperStats } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import {
  Clock,
  MessageSquare,
  TestTube,
  Sparkles,
  Users,
  CheckCircle2,
  BarChart3,
  Bug,
  Star,
  Trophy,
  Send,
  Rocket,
} from "lucide-react"

interface ShaperContentProps {
  user: User
  profile: Profile | null
  shaperProfile: ShaperProfile | null
  shaperStats: ShaperStats | null
}

const defaultStats: ShaperStats = {
  total_feedbacks: 0,
  total_bugs_reported: 0,
  total_features_tested: 0,
  total_testing_hours: 0,
  ranking: 0,
  total_shapers: 0,
  feedbacks_completed: 0,
  feedbacks_in_progress: 0,
  total_votes_received: 0,
}

export function ShaperContent({ user, profile, shaperProfile, shaperStats }: ShaperContentProps) {
  const [currentMode, setCurrentMode] = useState<UserMode>("shaper")
  const [reason, setReason] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)

  const stats = shaperStats || defaultStats
  const shaper_status = shaperProfile?.status || null

  const handleModeChange = async (mode: UserMode) => {
    setCurrentMode(mode)
    const supabase = createClient()

    if (profile) {
      await supabase.from("profiles").update({ current_mode: mode }).eq("id", user.id)
    }
  }

  const handleApply = async () => {
    if (!reason.trim()) {
      setApplyError("Please enter your reason for joining")
      return
    }

    setIsApplying(true)
    setApplyError(null)

    const supabase = createClient()

    const { error } = await supabase.from("shaper_profiles").insert({
      user_id: user.id,
      reason_for_joining: reason,
      status: "pending",
    })

    if (error) {
      setApplyError(error.message)
      setIsApplying(false)
      return
    }

    // Refresh the page to show pending status
    window.location.reload()
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
          {/* Not Applied Yet - Application Form */}
          {!shaper_status && (
            <Card className="md:col-span-2 lg:col-span-3 border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-accent/20 p-3">
                    <Rocket className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Join the Shaper Program</CardTitle>
                    <CardDescription>
                      Become an early supporter and help shape the future of our platform
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <MessageSquare className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Submit Feedback</p>
                      <p className="text-xs text-muted-foreground">Report bugs, suggest features</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <TestTube className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Test Features</p>
                      <p className="text-xs text-muted-foreground">Early access to new features</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Exclusive Access</p>
                      <p className="text-xs text-muted-foreground">Experimental features first</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you want to join the Shaper program?</Label>
                  <Textarea
                    id="reason"
                    placeholder="Tell us why you're interested and how you can contribute..."
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                {applyError && (
                  <p className="text-sm text-red-500">{applyError}</p>
                )}

                <Button onClick={handleApply} disabled={isApplying} className="w-full md:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  {isApplying ? "Submitting..." : "Apply to Join"}
                </Button>
              </CardContent>
            </Card>
          )}

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
          {shaper_status === "approved" && shaperProfile && (
            <>
              {/* Shaper Stats Card - Full Width */}
              <Card className="md:col-span-2 lg:col-span-3 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      <CardTitle className="text-lg">Shaper Stats</CardTitle>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="mr-1 h-3 w-3" />
                      {shaperProfile.badge_level.charAt(0).toUpperCase() + shaperProfile.badge_level.slice(1)} Shaper
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-accent">{stats.total_feedbacks}</div>
                      <div className="text-xs text-muted-foreground">Feedbacks</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-red-500">{stats.total_bugs_reported}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Bug className="h-3 w-3" /> Bugs Reported
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-blue-500">{stats.total_features_tested}</div>
                      <div className="text-xs text-muted-foreground">Features Tested</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-amber-500 flex items-center justify-center gap-1">
                        <Trophy className="h-5 w-5" /> #{stats.ranking || "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">of {stats.total_shapers} Shapers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    <CardTitle className="text-lg">Testing Zone</CardTitle>
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

              {/* Early Access */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Early Access</CardTitle>
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
                      Sorry, your Shaper application was not approved this time.
                      {shaperProfile?.rejection_reason && (
                        <span className="block mt-2 text-sm">
                          Reason: {shaperProfile.rejection_reason}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
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
