"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useRouter } from "@/i18n/navigation"
import {
  Globe,
  Mail,
  Briefcase,
  DollarSign,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
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
import { usePusher } from "@/components/providers/pusher-provider"
import { useToast } from "@/hooks/use-toast"
import type {
  Website,
  BossProfile,
  BossInvite,
  BossProject,
  BossEarnings,
} from "@/lib/types"
import type { ChatMessage } from "@/lib/pusher-client"

interface BossDashboardProps {
  bossProfile: BossProfile
  website: Website | null
  invites: BossInvite[]
  projects: BossProject[]
  earnings: BossEarnings | null
  currentUserId: string
}

export function BossDashboard({
  bossProfile,
  website,
  invites,
  projects,
  earnings,
  currentUserId,
}: BossDashboardProps) {
  const router = useRouter()
  const { subscribeToUser, unsubscribeFromUser } = usePusher()
  const { toast } = useToast()
  const t = useTranslations("boss")
  const tCommon = useTranslations("common")

  const pendingInvites = invites.filter((i) => i.status === "pending")
  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "review"
  )
  const completedProjects = projects.filter((p) => p.status === "completed")

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
              onClick={() => router.push(`/boss/boss-chats/${message.project_id}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {tCommon("view")}
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
  }, [currentUserId, subscribeToUser, unsubscribeFromUser, toast, router, tCommon])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {bossProfile.company_name || t("dashboard.welcomeBack")}
          </p>
        </div>
        <div className="flex gap-2">
          {website ? (
            <Button asChild variant="outline">
              <Link href={`/${website.handle}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                {t("website.viewWebsite")}
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/boss/website/create">
                <Plus className="h-4 w-4" />
                {t("website.createWebsite")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.pendingInvites")}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t("dashboard.activeProjects")}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedProjects.length} {t("projects.completed").toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.thisMonth")}</CardTitle>
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
                : tCommon("noDataYet")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.totalEarnings")}</CardTitle>
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
                ? `${earnings.currency}${earnings.pending_amount.toLocaleString()} ${t("dashboard.pending").toLowerCase()}`
                : t("dashboard.noPendingPayments")}
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
              <CardTitle>{t("website.title")}</CardTitle>
            </div>
            <CardDescription>
              {website
                ? t("website.manage")
                : t("website.createPresence")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {website ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{tCommon("status")}</span>
                  <Badge variant={website.is_published ? "default" : "secondary"}>
                    {website.is_published ? t("website.published") : t("website.draft")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("website.url")}</span>
                  <Link
                    href={`/${website.handle}`}
                    className="text-sm font-medium text-accent hover:underline"
                    target="_blank"
                  >
                    byour.app/{website.handle}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("website.template")}</span>
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
                <p className="mb-2 font-medium">{t("website.noWebsite")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("website.createDescription")}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {website ? (
              <div className="flex w-full gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/builder/${website.id}`}>{t("website.editWebsite")}</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/boss/website/services">
                    {t("website.manageServices")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href="/builder/new">
                  <Plus className="h-4 w-4" />
                  {t("website.createWebsite")}
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
                <CardTitle>{t("invites.title")}</CardTitle>
              </div>
              {pendingInvites.length > 0 && (
                <Badge variant="secondary">{pendingInvites.length} new</Badge>
              )}
            </div>
            <CardDescription>{t("invites.description")}</CardDescription>
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
                      {tCommon("view")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mb-2 font-medium">{t("invites.noPending")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("invites.newInvitesAppear")}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex w-full gap-2">

              <Button asChild variant="outline" className="flex-1">
              <Link href="/boss/invites">
                {t("invites.viewAllInvites")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild  className="flex-1">
              <Link href="/boss/boss-chats">
                {t("invites.viewAllMessages")}
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
              <CardTitle>{t("projects.activeProjects")}</CardTitle>
            </div>
            <CardDescription>{t("projects.yourOngoingWork")}</CardDescription>
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
                        {project.status === "in_progress" ? t("projects.inProgress") : t("projects.inReview")}
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
                <p className="mb-2 font-medium">{t("projects.noActiveProjects")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("projects.acceptToStart")}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/boss/projects">
                {t("projects.viewAllProjects")}
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
              <CardTitle>{t("earnings.title")}</CardTitle>
            </div>
            <CardDescription>{t("earnings.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {earnings ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent/10 p-4">
                  <p className="text-sm text-muted-foreground">{t("earnings.totalEarned")}</p>
                  <p className="text-3xl font-bold">
                    {earnings.currency}
                    {earnings.total_earned.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("earnings.pending")}</p>
                    <p className="text-lg font-semibold">
                      {earnings.currency}
                      {earnings.pending_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("earnings.projects")}</p>
                    <p className="text-lg font-semibold">
                      {earnings.projects_completed}
                    </p>
                  </div>
                </div>
                {earnings.average_rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("earnings.avgRating")}</span>
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
                <p className="mb-2 font-medium">{t("earnings.noEarnings")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("earnings.completeToEarn")}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/boss/earnings">
                {t("earnings.viewDetails")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
