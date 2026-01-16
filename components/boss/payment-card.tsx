"use client"

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

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    description: "Waiting for client to release payment",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    description: "Payment is being processed",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    animate: true,
  },
  completed: {
    icon: CheckCircle2,
    label: "Paid",
    description: "Payment received successfully",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  failed: {
    icon: AlertCircle,
    label: "Failed",
    description: "Payment failed - please contact support",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
}

export function PaymentCard({ project, payment }: PaymentCardProps) {
  if (!payment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Payment
          </CardTitle>
          <CardDescription>Payment details for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 font-medium">No payment yet</p>
            <p className="text-sm text-muted-foreground">
              Payment will be available after the project is completed
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const config = statusConfig[payment.status]
  const Icon = config.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Payment
            </CardTitle>
            <CardDescription>Payment details for this project</CardDescription>
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
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Banner */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-4",
            config.bgColor
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6 shrink-0",
              config.color,
              config.animate && "animate-spin"
            )}
          />
          <div>
            <p className={cn("font-medium", config.color)}>{config.label}</p>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Amount</p>
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
              Payment Method
            </span>
            <span className="font-medium">
              {payment.payment_method || "Not specified"}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {payment.status === "completed" ? "Paid on" : "Created on"}
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
                <span className="text-muted-foreground">Transaction ID</span>
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
            Download Invoice
          </Button>
        </CardFooter>
      )}

      {payment.status === "failed" && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4" />
            Contact Support
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
