"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CheckCircle, Clock, XCircle, MoreHorizontal } from "lucide-react"
import type { ShaperRequestWithProfile } from "@/lib/api/admin"
import type { ShaperStatus } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface ShaperRequestsListProps {
  initialData: ShaperRequestWithProfile[]
}

const statusConfig: Record<ShaperStatus, { label: string; variant: "default" | "secondary" | "destructive"; icon: typeof Clock }> = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  approved: { label: "Approved", variant: "default", icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
}

export function ShaperRequestsList({ initialData }: ShaperRequestsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (shaperId: string, newStatus: ShaperStatus) => {
    setUpdatingId(shaperId)

    try {
      const response = await fetch("/api/admin/shaper-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shaperId, status: newStatus }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Status updated to ${newStatus}`)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to update status")
      }
    } catch {
      toast.error("Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  if (initialData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No shaper requests found
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Reason for Joining</TableHead>
            <TableHead>Applied At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.map((shaper) => {
            const status = statusConfig[shaper.status]
            const StatusIcon = status.icon
            const isUpdating = updatingId === shaper.id

            return (
              <TableRow key={shaper.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={shaper.profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {getInitials(shaper.profile.full_name, shaper.profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {shaper.profile.full_name || "No name"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {shaper.profile.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-[300px] truncate text-sm">
                    {shaper.reason_for_joining || "-"}
                  </p>
                </TableCell>
                <TableCell>
                  {format(new Date(shaper.applied_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isUpdating || isPending}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {shaper.status !== "approved" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(shaper.id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {shaper.status !== "pending" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(shaper.id, "pending")}
                        >
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                          Set to Pending
                        </DropdownMenuItem>
                      )}
                      {shaper.status !== "rejected" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(shaper.id, "rejected")}
                          className="text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
