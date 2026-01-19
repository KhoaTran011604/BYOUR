"use client"

import { useTranslations } from "next-intl"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  DollarSign,
  CreditCard,
  Calendar,
  ExternalLink,
  Download,
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { BossPayment, BossProject } from "@/lib/types"

interface PaymentCardProps {
  project: BossProject
  payment: BossPayment | null
}

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
}

const statusColors = {
  pending: { color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  processing: { color: "text-blue-500", bgColor: "bg-blue-500/10", animate: true },
  completed: { color: "text-green-500", bgColor: "bg-green-500/10" },
  failed: { color: "text-destructive", bgColor: "bg-destructive/10" },
}

export function PaymentCard({ project, payment }: PaymentCardProps) {
  const t = useTranslations("boss.payment")

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t("pending"),
      processing: t("processing"),
      completed: t("paid"),
      failed: t("failed"),
    }
    return labels[status] || status
  }

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      pending: t("pendingDesc"),
      processing: t("processingDesc"),
      completed: t("paidDesc"),
      failed: t("failedDesc"),
    }
    return descriptions[status] || ""
  }
  if (!payment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            {t("payment")}
          </CardTitle>
          <CardDescription>{t("paymentDetails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 font-medium">{t("noPaymentYet")}</p>
            <p className="text-sm text-muted-foreground">
              {t("paymentAfterComplete")}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const Icon = statusIcons[payment.status]
  const colors = statusColors[payment.status]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              {t("payment")}
            </CardTitle>
            <CardDescription>{t("paymentDetails")}</CardDescription>
          </div>
          <Badge
            variant={
              payment.status === "completed"
                ? "default"
                : payment.status === "failed"
                ? "destructive"
                : "secondary"
            }
          >
            {getStatusLabel(payment.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Banner */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-4",
            colors.bgColor
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6 shrink-0",
              colors.color,
              colors.animate && "animate-spin"
            )}
          />
          <div>
            <p className={cn("font-medium", colors.color)}>{getStatusLabel(payment.status)}</p>
            <p className="text-sm text-muted-foreground">{getStatusDescription(payment.status)}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">{t("amount")}</p>
          <p className="text-3xl font-bold">
            {payment.currency}
            {payment.amount.toLocaleString()}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              {t("paymentMethod")}
            </span>
            <span className="font-medium">
              {payment.payment_method || t("notSpecified")}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {payment.status === "completed" ? t("paidOn") : t("createdOn")}
            </span>
            <span className="font-medium">
              {new Date(
                payment.paid_at || payment.created_at
              ).toLocaleDateString()}
            </span>
          </div>

          {payment.transaction_id && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("transactionId")}</span>
                <span className="font-mono text-xs">{payment.transaction_id}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      {payment.status === "completed" && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4" />
            {t("downloadInvoice")}
          </Button>
        </CardFooter>
      )}

      {payment.status === "failed" && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4" />
            {t("contactSupport")}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
