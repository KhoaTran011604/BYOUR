"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Calendar,
  DollarSign,
  Inbox,
  Loader2,
} from "lucide-react"
import type { BossInvite } from "@/lib/types"

export default function BossChatsPage() {
  const router = useRouter()
  const [acceptedProjects, setAcceptedProjects] = useState<BossInvite[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAcceptedProjects()
  }, [])

  const loadAcceptedProjects = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check if user has boss profile
    const { data: bossProfile } = await supabase
      .from("boss_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!bossProfile) {
      router.push("/boss")
      return
    }

    // Get only accepted invites
    const { data } = await supabase
      .from("hq_invites")
      .select(`
        id,
        hq_id,
        project_id,
        boss_id,
        message,
        proposed_budget,
        proposed_deadline,
        status,
        created_at,
        updated_at,
        hq_projects (
          title,
          description,
          budget_min,
          budget_max,
          currency,
          deadline,
          status
        ),
        hq_profiles (
          company_name,
          hq_business_profiles (
            display_name,
            logo_url
          )
        )
      `)
      .eq("boss_id", user.id)
      .eq("status", "accepted")
      .order("updated_at", { ascending: false })

    // Transform data to BossInvite format
    const transformedProjects: BossInvite[] = (data || []).map((invite: any) => ({
      id: invite.id,
      boss_id: invite.boss_id,
      hq_id: invite.hq_id,
      hq_project_id: invite.project_id,
      client_name: invite.hq_profiles?.hq_business_profiles?.display_name
        || invite.hq_profiles?.company_name
        || "Unknown Company",
      client_avatar: invite.hq_profiles?.hq_business_profiles?.logo_url || null,
      project_title: invite.hq_projects?.title || "Untitled Project",
      project_description: invite.hq_projects?.description || null,
      budget_min: invite.hq_projects?.budget_min || null,
      budget_max: invite.hq_projects?.budget_max || null,
      currency: invite.hq_projects?.currency || "EUR",
      deadline: invite.hq_projects?.deadline || null,
      message: invite.message,
      proposed_budget: invite.proposed_budget,
      proposed_deadline: invite.proposed_deadline,
      status: invite.status,
      created_at: invite.created_at,
      updated_at: invite.updated_at,
    }))

    setAcceptedProjects(transformedProjects)
    setIsLoading(false)
  }

  const filteredProjects = acceptedProjects.filter((project) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      project.project_title.toLowerCase().includes(query) ||
      project.client_name.toLowerCase().includes(query) ||
      project.project_description?.toLowerCase().includes(query)
    )
  })

  const formatBudget = (project: BossInvite) => {
    if (!project.budget_min && !project.budget_max) return "Budget TBD"
    if (project.budget_min && project.budget_max) {
      return `${project.currency}${project.budget_min.toLocaleString()} - ${project.currency}${project.budget_max.toLocaleString()}`
    }
    if (project.budget_max) {
      return `Up to ${project.currency}${project.budget_max.toLocaleString()}`
    }
    return `From ${project.currency}${project.budget_min?.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
            <h1 className="text-2xl font-bold">Project Chats</h1>
            <p className="text-muted-foreground">
              Chat with your clients on accepted projects
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {acceptedProjects.length} Active Projects
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Project List */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/boss/boss-chats/${project.hq_project_id}`}
            >
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.client_avatar || undefined} />
                      <AvatarFallback>
                        {project.client_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {project.project_title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.client_name}
                      </p>
                    </div>
                    <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>

                  {project.project_description && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {project.project_description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatBudget(project)}</span>
                    </div>
                    {project.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-medium">No active projects</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Accept invites to start chatting with clients"}
          </p>
          <Button asChild>
            <Link href="/boss/invites">View Invites</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
