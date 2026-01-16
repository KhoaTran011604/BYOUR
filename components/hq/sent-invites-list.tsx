"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Filter,
  ExternalLink,
  Calendar,
  DollarSign,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { HQInvite, HQInviteStatus } from "@/lib/types"

interface InviteWithProject extends HQInvite {
  hq_projects?: {
    id: string
    title: string
    status: string
  }
}

interface SentInvitesListProps {
  invites: InviteWithProject[]
}

const statusConfig: Record<HQInviteStatus, { label: string; icon: typeof Clock; color: string; bgColor: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-500",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-500",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-500",
  },
}

export function SentInvitesList({ invites }: SentInvitesListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Mock invites for demonstration if empty (static dates to avoid hydration issues)
  const mockInvites: InviteWithProject[] = invites.length > 0 ? invites : [
    {
      id: "1",
      hq_id: "hq1",
      project_id: "proj1",
      boss_id: "boss1",
      message: "We think you would be a great fit for this project!",
      proposed_budget: 5000,
      proposed_deadline: "2024-02-15",
      status: "pending",
      responded_at: null,
      created_at: "2024-01-14T10:00:00.000Z",
      updated_at: "2024-01-14T10:00:00.000Z",
      hq_projects: {
        id: "proj1",
        title: "E-commerce Mobile App",
        status: "open",
      },
    },
    {
      id: "2",
      hq_id: "hq1",
      project_id: "proj2",
      boss_id: "boss2",
      message: null,
      proposed_budget: 3500,
      proposed_deadline: null,
      status: "accepted",
      responded_at: "2024-01-15T14:00:00.000Z",
      created_at: "2024-01-11T09:00:00.000Z",
      updated_at: "2024-01-15T14:00:00.000Z",
      hq_projects: {
        id: "proj2",
        title: "Website Redesign",
        status: "in_progress",
      },
    },
    {
      id: "3",
      hq_id: "hq1",
      project_id: "proj1",
      boss_id: "boss3",
      message: "Looking forward to working with you!",
      proposed_budget: 4500,
      proposed_deadline: "2024-03-01",
      status: "declined",
      responded_at: "2024-01-13T11:00:00.000Z",
      created_at: "2024-01-09T08:00:00.000Z",
      updated_at: "2024-01-13T11:00:00.000Z",
      hq_projects: {
        id: "proj1",
        title: "E-commerce Mobile App",
        status: "open",
      },
    },
  ]

  const filteredInvites = mockInvites.filter((invite) =>
    statusFilter === "all" || invite.status === statusFilter
  )

  // Count by status
  const statusCounts = mockInvites.reduce(
    (counts, invite) => {
      counts[invite.status] = (counts[invite.status] || 0) + 1
      return counts
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Sent Invites</h1>
        <p className="text-muted-foreground">
          Track all invites you&apos;ve sent to professionals
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {(["pending", "accepted", "declined", "expired"] as HQInviteStatus[]).map(
          (status) => {
            const config = statusConfig[status]
            const Icon = config.icon
            return (
              <Card key={status}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}/10`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {statusCounts[status] || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {config.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Invites</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          Showing {filteredInvites.length} invites
        </span>
      </div>

      {/* Invites List */}
      {filteredInvites.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Send className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No invites found</p>
            <p className="mt-2 text-muted-foreground">
              {statusFilter === "all"
                ? "You haven't sent any invites yet"
                : `No ${statusFilter} invites`}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/hq/bosses">Browse Professionals</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInvites.map((invite) => {
            const status = statusConfig[invite.status]
            const StatusIcon = status.icon
            const mockBossName = "Professional " + invite.boss_id.slice(0, 4)

            return (
              <Card key={invite.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{mockBossName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{mockBossName}</h3>
                          {invite.hq_projects && (
                            <Link
                              href={`/hq/projects/${invite.hq_projects.id}`}
                              className="text-sm text-muted-foreground hover:underline"
                            >
                              {invite.hq_projects.title}
                            </Link>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${status.bgColor} text-white`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {invite.proposed_budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>€{invite.proposed_budget.toLocaleString()}</span>
                          </div>
                        )}
                        {invite.proposed_deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span suppressHydrationWarning>
                              {new Date(invite.proposed_deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span suppressHydrationWarning>
                            Sent {new Date(invite.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {invite.message && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {invite.message}
                        </p>
                      )}

                      {/* Response Info */}
                      {invite.responded_at && (
                        <p className="mt-2 text-xs text-muted-foreground" suppressHydrationWarning>
                          Responded on{" "}
                          {new Date(invite.responded_at).toLocaleDateString()}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-3 flex gap-2">
                        {invite.hq_projects && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/hq/projects/${invite.hq_projects.id}`}>
                              <ExternalLink className="h-4 w-4" />
                              View Project
                            </Link>
                          </Button>
                        )}
                        {invite.status === "accepted" && (
                          <Button size="sm" asChild>
                            <Link href={`/hq/projects/${invite.project_id}`}>
                              Proceed to Payment
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
