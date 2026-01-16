"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Loader2,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PaymentDialog } from "./payment-dialog"
import { createClient } from "@/lib/supabase/client"
import type { HQInvite, HQInviteStatus } from "@/lib/types"

interface InvitesListProps {
  invites: HQInvite[]
  projectId: string
  hqId: string
}

const statusConfig: Record<HQInviteStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-500" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-green-500" },
  declined: { label: "Declined", icon: XCircle, color: "text-red-500" },
  expired: { label: "Expired", icon: AlertCircle, color: "text-gray-500" },
}

export function InvitesList({ invites, projectId, hqId }: InvitesListProps) {
  const router = useRouter()
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const [paymentInvite, setPaymentInvite] = useState<HQInvite | null>(null)

  const handleWithdraw = async (inviteId: string) => {
    setWithdrawingId(inviteId)

    try {
      const supabase = createClient()
      await supabase
        .from("hq_invites")
        .delete()
        .eq("id", inviteId)
        .eq("hq_id", hqId)

      router.refresh()
    } catch (err) {
      console.error("Withdraw error:", err)
    } finally {
      setWithdrawingId(null)
    }
  }

  const handleProceedToPayment = (invite: HQInvite) => {
    setPaymentInvite(invite)
  }

  if (invites.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No invites sent yet. Browse professionals and send invites to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group invites by status
  const acceptedInvites = invites.filter((i) => i.status === "accepted")
  const pendingInvites = invites.filter((i) => i.status === "pending")
  const otherInvites = invites.filter(
    (i) => i.status === "declined" || i.status === "expired"
  )

  return (
    <div className="space-y-6">
      {/* Accepted Invites - Need Action */}
      {acceptedInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-medium text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Accepted - Ready to Start ({acceptedInvites.length})
          </h3>
          {acceptedInvites.map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              onWithdraw={handleWithdraw}
              isWithdrawing={withdrawingId === invite.id}
              onProceedToPayment={handleProceedToPayment}
              showPaymentAction
            />
          ))}
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-medium text-yellow-600">
            <Clock className="h-5 w-5" />
            Pending Response ({pendingInvites.length})
          </h3>
          {pendingInvites.map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              onWithdraw={handleWithdraw}
              isWithdrawing={withdrawingId === invite.id}
              onProceedToPayment={handleProceedToPayment}
            />
          ))}
        </div>
      )}

      {/* Declined/Expired Invites */}
      {otherInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-muted-foreground">
            Past Invites ({otherInvites.length})
          </h3>
          {otherInvites.map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              onWithdraw={handleWithdraw}
              isWithdrawing={withdrawingId === invite.id}
              onProceedToPayment={handleProceedToPayment}
              isDisabled
            />
          ))}
        </div>
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        open={!!paymentInvite}
        onOpenChange={(open) => !open && setPaymentInvite(null)}
        invite={paymentInvite}
        projectId={projectId}
        hqId={hqId}
      />
    </div>
  )
}

interface InviteCardProps {
  invite: HQInvite
  onWithdraw: (id: string) => void
  isWithdrawing: boolean
  onProceedToPayment: (invite: HQInvite) => void
  showPaymentAction?: boolean
  isDisabled?: boolean
}

function InviteCard({
  invite,
  onWithdraw,
  isWithdrawing,
  onProceedToPayment,
  showPaymentAction,
  isDisabled,
}: InviteCardProps) {
  const status = statusConfig[invite.status]
  const StatusIcon = status.icon

  // Mock boss data - in production this would be fetched
  const mockBossName = "Professional " + invite.boss_id.slice(0, 4)

  return (
    <Card className={isDisabled ? "opacity-60" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{mockBossName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium">{mockBossName}</h4>
                <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                  Invited {new Date(invite.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className={status.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            {/* Proposed Terms */}
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
            </div>

            {invite.message && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {invite.message}
              </p>
            )}

            {/* Actions */}
            {!isDisabled && (
              <div className="mt-3 flex gap-2">
                {showPaymentAction && (
                  <Button size="sm" onClick={() => onProceedToPayment(invite)}>
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                  </Button>
                )}
                {invite.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onWithdraw(invite.id)}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Withdraw Invite"
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
