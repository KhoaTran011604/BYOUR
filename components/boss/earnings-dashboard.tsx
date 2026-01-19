"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Briefcase,
  Star,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { BossEarnings, EarningsTransaction, PaymentStatus } from "@/lib/types"

interface EarningsDashboardProps {
  earnings: BossEarnings
  transactions: EarningsTransaction[]
}

export function EarningsDashboard({
  earnings,
  transactions,
}: EarningsDashboardProps) {
  const t = useTranslations("boss.earnings")
  const tCommon = useTranslations("common")
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "pending":
        return { label: t("pending"), variant: "secondary" as const }
      case "processing":
        return { label: t("processing"), variant: "outline" as const }
      case "completed":
        return { label: t("projects"), variant: "default" as const }
      case "failed":
        return { label: t("failed"), variant: "destructive" as const }
      default:
        return { label: status, variant: "outline" as const }
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false

    if (timeRange !== "all") {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      if (new Date(t.date) < cutoff) return false
    }

    return true
  })

  const monthChange = earnings.last_month
    ? ((earnings.this_month - earnings.last_month) / earnings.last_month) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/boss/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalEarned")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings.currency}
              {earnings.total_earned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("lifetimeEarnings")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pending")}</CardTitle>
            {monthChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings.currency}
              {earnings.this_month.toLocaleString()}
            </div>
            <p
              className={cn(
                "flex items-center gap-1 text-xs",
                monthChange >= 0 ? "text-green-500" : "text-destructive"
              )}
            >
              {monthChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(monthChange).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pending")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings.currency}
              {earnings.pending_amount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("awaitingRelease")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("projects")}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.projects_completed}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {earnings.average_rating && (
                <>
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {earnings.average_rating.toFixed(1)} {t("avgRating").toLowerCase()}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t("transactionHistory")}</CardTitle>
              <CardDescription>
                {t("paymentHistory")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select
                value={timeRange}
                onValueChange={(v: typeof timeRange) => setTimeRange(v)}
              >
                <SelectTrigger className="w-[140px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">{t("last7Days")}</SelectItem>
                  <SelectItem value="30d">{t("last30Days")}</SelectItem>
                  <SelectItem value="90d">{t("last90Days")}</SelectItem>
                  <SelectItem value="all">{t("allTime")}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v: typeof statusFilter) => setStatusFilter(v)}
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatus")}</SelectItem>
                  <SelectItem value="completed">{t("projects")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="processing">{t("processing")}</SelectItem>
                  <SelectItem value="failed">{t("failed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon("project")}</TableHead>
                  <TableHead>{tCommon("client")}</TableHead>
                  <TableHead>{tCommon("date")}</TableHead>
                  <TableHead>{tCommon("status")}</TableHead>
                  <TableHead className="text-right">{tCommon("amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const status = getStatusConfig(transaction.status)
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.project_title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.client_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.currency}
                        {transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 font-medium">{t("noTransactions")}</p>
              <p className="text-sm text-muted-foreground">
                {statusFilter !== "all" || timeRange !== "all"
                  ? t("adjustFilters")
                  : t("transactionsAppear")}
              </p>
            </div>
          )}
        </CardContent>
        {filteredTransactions.length > 0 && (
          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground">
              {tCommon("showing")} {filteredTransactions.length} {filteredTransactions.length !== 1 ? tCommon("transactions") : tCommon("transaction")}
            </p>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              {tCommon("exportCsv")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
