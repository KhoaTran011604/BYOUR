"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Filter, Search, Inbox, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InviteCard } from "./invite-card"
import type { BossInvite, InviteStatus } from "@/lib/types"

interface InvitesListProps {
  invites: BossInvite[]
  onAccept: (inviteId: string) => Promise<void>
  onDecline: (inviteId: string) => Promise<void>
}

export function InvitesList({ invites, onAccept, onDecline }: InvitesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "budget">("date")
  const [activeTab, setActiveTab] = useState<InviteStatus | "all">("pending")

  const filteredInvites = invites
    .filter((invite) => {
      // Filter by tab
      if (activeTab !== "all" && invite.status !== activeTab) return false

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          invite.project_title.toLowerCase().includes(query) ||
          invite.client_name.toLowerCase().includes(query) ||
          invite.project_description?.toLowerCase().includes(query)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      // Sort by budget (higher first)
      const budgetA = a.budget_max || a.budget_min || 0
      const budgetB = b.budget_max || b.budget_min || 0
      return budgetB - budgetA
    })

  const pendingCount = invites.filter((i) => i.status === "pending").length
  const acceptedCount = invites.filter((i) => i.status === "accepted").length
  const declinedCount = invites.filter((i) => i.status === "declined").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/boss/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invites</h1>
            <p className="text-muted-foreground">
              Manage project invitations from clients
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invites..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={(v: "date" | "budget") => setSortBy(v)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Newest first</SelectItem>
            <SelectItem value="budget">Highest budget</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Mail className="h-4 w-4" />
            Pending
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedCount})
          </TabsTrigger>
          <TabsTrigger value="declined">
            Declined ({declinedCount})
          </TabsTrigger>
          <TabsTrigger value="all">All ({invites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredInvites.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInvites.map((invite) => (
                <InviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={() => onAccept(invite.id)}
                  onDecline={() => onDecline(invite.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-medium">No invites found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : activeTab === "pending"
                  ? "New invites will appear here"
                  : `No ${activeTab} invites yet`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
