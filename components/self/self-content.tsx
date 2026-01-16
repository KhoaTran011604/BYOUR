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
  Building2,
  FileText,
  Lightbulb,
  ExternalLink,
  Globe,
  MapPin,
  ArrowUpCircle,
  Zap,
} from "lucide-react"

interface SelfContentProps {
  user: User
  profile: Profile | null
}

export function SelfContent({ user, profile }: SelfContentProps) {
  const [currentMode, setCurrentMode] = useState<UserMode>("self")

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
          <p className="text-muted-foreground">Explore and learn about freelancing</p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Business Registration Guide */}
          <Card className="md:col-span-2 lg:col-span-2 border-accent/20 bg-accent/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Business Registration Guide</CardTitle>
              </div>
              <CardDescription>
                First step to becoming a professional freelancer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to register your personal business, taxes, and necessary legal procedures to operate legally.
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
                Reference real freelance projects to learn how to present and quote.
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
        </div>
      </main>
    </div>
  )
}
