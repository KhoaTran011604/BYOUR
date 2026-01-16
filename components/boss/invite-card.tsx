"use client"

import { useState } from "react"
import {
  Calendar,
  DollarSign,
  Clock,
  User,
  Check,
  X,
  Loader2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { BossInvite } from "@/lib/types"

interface InviteCardProps {
  invite: BossInvite
  onAccept: () => Promise<void>
  onDecline: () => Promise<void>
}

const statusConfig = {
  pending: {
    variant: "secondary" as const,
    label: "Pending",
  },
  accepted: {
    variant: "default" as const,
    label: "Accepted",
  },
  declined: {
    variant: "outline" as const,
    label: "Declined",
  },
  expired: {
    variant: "destructive" as const,
    label: "Expired",
  },
}

export function InviteCard({ invite, onAccept, onDecline }: InviteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      await onAccept()
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    try {
      await onDecline()
    } finally {
      setIsDeclining(false)
    }
  }

  const formatBudget = () => {
    if (!invite.budget_min && !invite.budget_max) return "Budget TBD"
    if (invite.budget_min && invite.budget_max) {
      return `${invite.currency}${invite.budget_min.toLocaleString()} - ${invite.currency}${invite.budget_max.toLocaleString()}`
    }
    if (invite.budget_max) {
      return `Up to ${invite.currency}${invite.budget_max.toLocaleString()}`
    }
    return `From ${invite.currency}${invite.budget_min?.toLocaleString()}`
  }

  const daysAgo = Math.floor(
    (Date.now() - new Date(invite.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  const status = statusConfig[invite.status]
  const isPending = invite.status === "pending"

  return (
    <Card className={cn(isPending && "ring-2 ring-accent/20")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={invite.client_avatar || undefined} />
              <AvatarFallback>
                {invite.client_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{invite.client_name}</p>
              <p className="text-xs text-muted-foreground">
                {daysAgo === 0
                  ? "Today"
                  : daysAgo === 1
                  ? "Yesterday"
                  : `${daysAgo} days ago`}
              </p>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <CardTitle className="text-base">{invite.project_title}</CardTitle>
          {invite.project_description && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CardDescription className="mt-1 line-clamp-2">
                {invite.project_description}
              </CardDescription>
              {invite.project_description.length > 100 && (
                <CollapsibleTrigger asChild>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="ml-1 h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              <CollapsibleContent>
                <p className="mt-2 text-sm text-muted-foreground">
                  {invite.project_description}
                </p>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{formatBudget()}</span>
          </div>
          {invite.deadline && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due {new Date(invite.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      {isPending && (
        <CardFooter className="gap-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDecline}
            disabled={isAccepting || isDeclining}
          >
            {isDeclining ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <X className="h-4 w-4" />
                Decline
              </>
            )}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAccept}
            disabled={isAccepting || isDeclining}
          >
            {isAccepting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                Accept
              </>
            )}
          </Button>
        </CardFooter>
      )}

      {invite.status === "accepted" && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full">
            <MessageSquare className="h-4 w-4" />
            Open Project Chat
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
