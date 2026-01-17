"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Globe,
  Mail,
  Briefcase,
  DollarSign,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type {
  Website,
  BossProfile,
  BossInvite,
  BossProject,
  BossEarnings,
} from "@/lib/types"

interface BossDashboardProps {
  bossProfile: BossProfile
  website: Website | null
  invites: BossInvite[]
  projects: BossProject[]
  earnings: BossEarnings | null
}

export function BossDashboard({
  bossProfile,
  website,
  invites,
  projects,
  earnings,
}: BossDashboardProps) {
  const pendingInvites = invites.filter((i) => i.status === "pending")
  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "review"
  )
  const completedProjects = projects.filter((p) => p.status === "completed")

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Boss Dashboard</h1>
          <p className="text-muted-foreground">
            {bossProfile.company_name || "Welcome back"}
          </p>
        </div>
        <div className="flex gap-2">
          {website ? (
            <Button asChild variant="outline">
              <Link href={`/${website.handle}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                View Website
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/boss/website/create">
                <Plus className="h-4 w-4" />
                Create HQ Website
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvites.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInvites.length === 1 ? "invite" : "invites"} awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedProjects.length} completed total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings ? `${earnings.currency}${earnings.this_month.toLocaleString()}` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {earnings?.last_month
                ? `${earnings.this_month >= earnings.last_month ? "+" : ""}${(
                    ((earnings.this_month - earnings.last_month) / earnings.last_month) *
                    100
                  ).toFixed(0)}% from last month`
                : "No data yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings
                ? `${earnings.currency}${earnings.total_earned.toLocaleString()}`
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {earnings?.pending_amount
                ? `${earnings.currency}${earnings.pending_amount.toLocaleString()} pending`
                : "No pending payments"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Website Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              <CardTitle>HQ Website</CardTitle>
            </div>
            <CardDescription>
              {website
                ? "Manage your professional website"
                : "Create your professional presence"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {website ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={website.is_published ? "default" : "secondary"}>
                    {website.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">URL</span>
                  <Link
                    href={`/${website.handle}`}
                    className="text-sm font-medium text-accent hover:underline"
                    target="_blank"
                  >
                    byour.app/{website.handle}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Template</span>
                  <span className="text-sm font-medium capitalize">
                    {website.template}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 font-medium">No website yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your HQ website to showcase your services
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {website ? (
              <div className="flex w-full gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/builder/${website.id}`}>Edit Website</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/boss/website/services">
                    Manage Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href="/builder/new">
                  <Plus className="h-4 w-4" />
                  Create HQ Website
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Invites Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                <CardTitle>Invites</CardTitle>
              </div>
              {pendingInvites.length > 0 && (
                <Badge variant="secondary">{pendingInvites.length} new</Badge>
              )}
            </div>
            <CardDescription>Project invitations from clients</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingInvites.length > 0 ? (
              <div className="space-y-3">
                {pendingInvites.slice(0, 3).map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{invite.project_title}</p>
                        <p className="text-sm text-muted-foreground">
                          {invite.client_name}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 font-medium">No pending invites</p>
                <p className="text-sm text-muted-foreground">
                  New invites will appear here
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex w-full gap-2">

              <Button asChild variant="outline" className="flex-1">
              <Link href="/boss/invites">
                View All Invites
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild  className="flex-1">
              <Link href="/boss/boss-chats">
                View All Messages
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Active Projects Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              <CardTitle>Active Projects</CardTitle>
            </div>
            <CardDescription>Your ongoing work</CardDescription>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <div className="space-y-3">
                {activeProjects.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    href={`/boss/projects/${project.id}`}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">{project.title}</p>
                      <Badge
                        variant={
                          project.status === "in_progress" ? "default" : "secondary"
                        }
                      >
                        {project.status === "in_progress" ? "In Progress" : "Review"}
                      </Badge>
                    </div>
                    {project.deadline && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 font-medium">No active projects</p>
                <p className="text-sm text-muted-foreground">
                  Accept an invite to start a project
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/boss/projects">
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Earnings Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              <CardTitle>Earnings</CardTitle>
            </div>
            <CardDescription>Your financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            {earnings ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent/10 p-4">
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold">
                    {earnings.currency}
                    {earnings.total_earned.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-lg font-semibold">
                      {earnings.currency}
                      {earnings.pending_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="text-lg font-semibold">
                      {earnings.projects_completed}
                    </p>
                  </div>
                </div>
                {earnings.average_rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Rating</span>
                    <span className="font-semibold">
                      {earnings.average_rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 font-medium">No earnings yet</p>
                <p className="text-sm text-muted-foreground">
                  Complete projects to start earning
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/boss/earnings">
                View Earnings Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
