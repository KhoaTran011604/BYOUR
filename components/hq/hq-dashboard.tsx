"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Plus,
  FolderKanban,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  TrendingUp,
  AlertCircle,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { usePusher } from "@/components/providers/pusher-provider"
import { useToast } from "@/hooks/use-toast"
import type { HQProfile, HQBusinessProfile, HQProject } from "@/lib/types"
import type { ChatMessage } from "@/lib/pusher-client"

interface HQDashboardProps {
  hqProfile: HQProfile
  businessProfile: HQBusinessProfile | null
  projects: HQProject[]
  pendingInvitesCount: number
  currentUserId: string
}

const projectStatusColors: Record<string, string> = {
  draft: "bg-gray-500",
  open: "bg-blue-500",
  in_progress: "bg-yellow-500",
  review: "bg-purple-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
}

export function HQDashboard({
  hqProfile,
  businessProfile,
  projects,
  pendingInvitesCount,
  currentUserId,
}: HQDashboardProps) {
  const router = useRouter()
  const { subscribeToUser, unsubscribeFromUser } = usePusher()
  const { toast } = useToast()

  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "review"
  )
  const completedProjects = projects.filter((p) => p.status === "completed")
  const openProjects = projects.filter((p) => p.status === "open")

  // Calculate total spent (mock data - in production would come from payments)
  const totalSpent = completedProjects.reduce(
    (sum, p) => sum + (p.budget_min + p.budget_max) / 2,
    0
  )

  // Subscribe to user channel for notifications
  useEffect(() => {
    if (!currentUserId) return

    const channel = subscribeToUser(currentUserId)
    if (!channel) return

    const handleNewMessage = (message: ChatMessage) => {
      // Only show toast if message is from another user
      if (message.sender_id !== currentUserId) {
        toast({
          title: `New message from ${message.sender_name}`,
          description: message.message.length > 50
            ? message.message.substring(0, 50) + "..."
            : message.message,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/hq/hq-chats/${message.project_id}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View
            </Button>
          ),
        })
      }
    }

    channel.bind("new-message-notification", handleNewMessage)

    return () => {
      channel.unbind("new-message-notification", handleNewMessage)
      unsubscribeFromUser(currentUserId)
    }
  }, [currentUserId, subscribeToUser, unsubscribeFromUser, toast, router])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{hqProfile.company_name}</h1>
          <p className="text-muted-foreground">
            Welcome to your HQ Dashboard
          </p>
        </div>
        <Button asChild>
          <Link href="/hq/projects/create">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Alert if no business profile */}
      {!businessProfile && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div className="flex-1">
              <p className="font-medium">Complete Your Business Profile</p>
              <p className="text-sm text-muted-foreground">
                Add your business details to attract top professionals
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/hq/business">
                Set Up Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {openProjects.length} open, {activeProjects.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitesCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedProjects.length} projects completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest project activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hq/projects">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No projects yet</p>
                <Button className="mt-4" asChild>
                  <Link href="/hq/projects/create">
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/hq/projects/${project.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="space-y-1">
                        <p className="font-medium">{project.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            €{project.budget_min.toLocaleString()} - €
                            {project.budget_max.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span>{project.skills_required.length} skills</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          projectStatusColors[project.status]
                        } text-white`}
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hq/hq-chats">
                <MessageSquare className="h-4 w-4" />
                Chats
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hq/projects/create">
                <Plus className="h-4 w-4" />
                Create New Project
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hq/bosses">
                <Users className="h-4 w-4" />
                Browse Professionals
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hq/business">
                <Building2 className="h-4 w-4" />
                {businessProfile ? "Edit Business Profile" : "Create Business Profile"}
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hq/invites">
                <Clock className="h-4 w-4" />
                View Sent Invites
                {pendingInvitesCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {pendingInvitesCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects Progress */}
      {activeProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Project Progress</CardTitle>
            <CardDescription>Track your ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeProjects.map((project) => {
                // Mock progress calculation
                const progress = project.status === "review" ? 90 : 50
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/hq/projects/${project.id}`}
                        className="font-medium hover:underline"
                      >
                        {project.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Budget: €{project.budget_min.toLocaleString()} - €
                        {project.budget_max.toLocaleString()}
                      </span>
                      <Badge variant="outline">
                        {project.status === "review" ? "In Review" : "In Progress"}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
