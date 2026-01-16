"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import type { UserMode, Profile, Website } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import {
  Globe,
  Plus,
  ExternalLink,
  Pencil,
  Users,
  Lightbulb,
  Zap,
  Clock,
  MessageSquare,
  TestTube,
  Sparkles,
  FileText,
  Building2,
  MapPin,
  ArrowUpCircle,
  CheckCircle2,
} from "lucide-react"

interface DashboardContentProps {
  user: User
  profile: Profile | null
  website: Website | null
}

export function DashboardContent({ user, profile, website }: DashboardContentProps) {
  const router = useRouter()
  const [currentMode, setCurrentMode] = useState<UserMode>(profile?.current_mode || "self")
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
          <p className="text-muted-foreground">Welcome to your digital office</p>
        </div>

        {/* Mobile Mode Info */}
        <div className="mb-6 sm:hidden">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current mode</span>
                <span className="font-medium capitalize">{currentMode}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Website Card - Boss mode only */}
          {currentMode === "boss" && (
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Your Website</CardTitle>
              </div>
              <CardDescription>
                {website ? `byour.co/${website.handle}` : "Create a professional microsite"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {website ? (
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={website.is_published ? "text-green-600 font-medium" : "text-amber-600 font-medium"}
                    >
                      {website.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/builder/${website.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit website
                    </Link>
                  </Button>
                  {website.is_published && (
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href={`/${website.handle}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View website
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/builder/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create new website
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
          )}

          {/* Mode-specific Cards */}
          {currentMode === "boss" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Work Management</CardTitle>
                  </div>
                  <CardDescription>Track projects and clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your freelance work professionally
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Coming soon
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Clients</CardTitle>
                  </div>
                  <CardDescription>Client list and relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Build relationships with potential clients</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Coming soon
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "hq" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Team</CardTitle>
                  </div>
                  <CardDescription>Manage team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Invite and manage members in your business</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Coming soon
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </div>
                  <CardDescription>Manage company projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Track and manage ongoing projects</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Coming soon
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "self" && (
            <>
              {/* Business Registration Guide */}
              <Card className="md:col-span-2 lg:col-span-2 border-accent/20 bg-accent/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Business Registration Guide</CardTitle>
                  </div>
                  <CardDescription>
                    The first step to becoming a professional freelancer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to register your individual business, taxes, and the necessary legal procedures to operate legally.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/self/business-registration">
                      <FileText className="mr-2 h-4 w-4" />
                      View guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* 3 Resource Cards */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Example Projects</CardTitle>
                  </div>
                  <CardDescription>View sample projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reference real freelance projects to learn presentation and pricing.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/self/projects">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Projects
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Example HQ Websites</CardTitle>
                  </div>
                  <CardDescription>Sample business websites</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore high-quality HQ websites for inspiration for your website.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/self/hq-websites">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Websites
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Ireland Guide</CardTitle>
                  </div>
                  <CardDescription>Guide to working in Ireland</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Information about visas, taxes, and freelance opportunities in Ireland.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/self/ireland">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Upgrade CTA */}
              <Card className="md:col-span-2 lg:col-span-3 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <ArrowUpCircle className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Ready to Upgrade?</h3>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to Boss Mode to unlock full freelance work management features.
                        </p>
                      </div>
                    </div>
                    <Button size="lg" className="shrink-0">
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "shaper" && (
            <>
              {/* Pending Approval - Waiting Screen */}
              {shaper_status !== "approved" && (
                <Card className="md:col-span-2 lg:col-span-3 border-amber-500/30 bg-amber-500/5">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="rounded-full bg-amber-500/10 p-4">
                        <Clock className="h-12 w-12 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Pending Approval</h3>
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

              {/* Approved - Shaper Dashboard (default when no status or approved) */}
              {shaper_status === "approved" && (
                <>
                  {/* Feedback Hub */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg">Feedback Hub</CardTitle>
                      </div>
                      <CardDescription>Contribute your feedback</CardDescription>
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
                        Access the testing environment to test features before official release.
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
              {profile?.shaper_status === "rejected" && (
                <Card className="md:col-span-2 lg:col-span-3 border-red-500/30 bg-red-500/5">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="rounded-full bg-red-500/10 p-4">
                        <Users className="h-12 w-12 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Application Not Approved</h3>
                        <p className="text-muted-foreground max-w-md">
                          Unfortunately, your Shaper application was not approved this time. You can apply again later.
                        </p>
                      </div>
                      <Button variant="outline" className="mt-2">
                        Apply again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{website ? 1 : 0}</div>
                <div className="text-sm text-muted-foreground">Website</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent capitalize">{currentMode}</div>
                <div className="text-sm text-muted-foreground">Mode</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
