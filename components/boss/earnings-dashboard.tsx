"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { BossEarnings, EarningsTransaction, PaymentStatus } from "@/lib/types"

interface EarningsDashboardProps {
  earnings: BossEarnings
  transactions: EarningsTransaction[]
}

const statusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "outline" },
  completed: { label: "Completed", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
}

export function EarningsDashboard({
  earnings,
  transactions,
}: EarningsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")

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
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">
          Track your income and payment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings.currency}
              {earnings.total_earned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings.currency}
              {earnings.pending_amount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting release
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.projects_completed}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {earnings.average_rating && (
                <>
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {earnings.average_rating.toFixed(1)} avg. rating
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
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Your payment history and pending transactions
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
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
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
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const status = statusConfig[transaction.status]
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
              <p className="mb-2 font-medium">No transactions found</p>
              <p className="text-sm text-muted-foreground">
                {statusFilter !== "all" || timeRange !== "all"
                  ? "Try adjusting your filters"
                  : "Your transactions will appear here"}
              </p>
            </div>
          )}
        </CardContent>
        {filteredTransactions.length > 0 && (
          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
            </p>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
